export interface IAdmin extends Document {
  nama: string;
  email: string;
  password: string;
  no_telepon: string;
  comparePassword: (password: string) => Promise<boolean>;
}
