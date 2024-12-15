import { VillaPhoto } from "../models/villaPhotoModel";
import { Villa } from "../models/villaModel";
import path from "path";
import fs from "fs";

const villaPhotoSeeder = async () => {
  console.log("Seeding Villa Photos...");

  try {
    // Ambil semua villa dari database
    const villas = await Villa.find();

    if (villas.length === 0) {
      console.log("No villas found to create photos.");
      return;
    }

    const baseUrl = "http://localhost:8000/images/villa";
    const imageFolder = "src/assets/img/villa";

    // Membaca semua file di folder image villa
    const availablePhotos = fs.readdirSync(imageFolder).filter((file) => {
      return file.endsWith(".jpg") || file.endsWith(".png");
    });

    if (availablePhotos.length === 0) {
      console.log("No photos found in the villa folder.");
      return;
    }

    // Loop setiap villa
    let photoIndex = 0; // Index untuk memastikan foto pertama berbeda
    for (const villa of villas) {
      const villaPhotoIds = []; // Menyimpan ID foto untuk villa ini

      // **Foto Pertama**: Pilih foto berdasarkan urutan
      if (photoIndex >= availablePhotos.length) {
        photoIndex = 0; // Reset index jika habis
      }
      const firstPhoto = availablePhotos[photoIndex];
      const firstPhotoPath = path.join(imageFolder, firstPhoto);
      const firstPhotoUrl = `${baseUrl}/${firstPhoto}`;

      const villaFirstPhoto = await VillaPhoto.create({
        villa: villa._id,
        name: firstPhoto,
        url: firstPhotoUrl,
        filepath: firstPhotoPath,
      });

      villaPhotoIds.push(villaFirstPhoto._id); // Tambahkan ID foto ke array
      photoIndex++; // Naikkan index untuk foto berikutnya

      // **Foto Lainnya**: Pilih secara acak dengan jumlah bervariasi
      const additionalPhotosCount = Math.floor(Math.random() * 4) + 3; // Random jumlah antara 3-6
      for (let i = 0; i < additionalPhotosCount; i++) {
        const randomPhoto =
          availablePhotos[Math.floor(Math.random() * availablePhotos.length)];
        const photoPath = path.join(imageFolder, randomPhoto);
        const photoUrl = `${baseUrl}/${randomPhoto}`;

        const villaPhoto = await VillaPhoto.create({
          villa: villa._id,
          name: randomPhoto,
          url: photoUrl,
          filepath: photoPath,
        });

        villaPhotoIds.push(villaPhoto._id); // Tambahkan ID foto ke array
      }

      // Push array foto ke dalam data villa
      await Villa.findByIdAndUpdate(
        villa._id,
        { $push: { foto_villa: { $each: villaPhotoIds } } }, // Push array foto_villa
        { new: true } // Mengembalikan data terbaru
      );

      console.log(`Added photos to villa: ${villa._id}`);
    }

    console.log("Villa Photos seeded successfully!");
  } catch (error) {
    console.error("Error seeding villa photos:", error);
  }
};

export default villaPhotoSeeder;
