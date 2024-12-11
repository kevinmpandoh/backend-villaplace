import { Villa } from "../models/villaModel";
import { VillaPhoto } from "../models/villaPhotoModel";

const villaPhotoSeeder = async () => {
  try {
    console.log("Seeding Villa Photos...");

    // Ambil semua villa yang sudah ada di database
    const villas = await Villa.find();

    if (!villas.length) {
      console.log("No villas found. Please seed villas first.");
      return;
    }

    // Seeder foto untuk setiap villa
    for (const villa of villas) {
      const photoUrls = [
        "https://source.unsplash.com/random/800x600?villa1",
        "https://source.unsplash.com/random/800x600?villa2",
        "https://source.unsplash.com/random/800x600?villa3",
      ];

      const photos = await Promise.all(
        photoUrls.map(async (url, index) => {
          const photo = await VillaPhoto.create({
            villa: villa._id,
            name: `Photo ${index + 1} - ${villa.nama}`,
            url: url,
            filepath: `path/to/photo-${index + 1}.jpg`, // Contoh file path
          });

          return photo._id;
        })
      );

      // Update Villa dengan foto yang telah ditambahkan
      await Villa.findByIdAndUpdate(
        villa._id,
        { $push: { foto_villa: { $each: photos } } },
        { new: true }
      );
    }

    console.log("Villa photos have been seeded successfully.");
  } catch (error) {
    console.error("Error seeding Villa Photos:", error);
  }
};

export default villaPhotoSeeder;
