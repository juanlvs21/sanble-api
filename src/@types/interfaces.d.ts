/*************************************** MODELS *****************************************/

interface IUser extends TMongoDocument {
  id?: string;
  username: string;
  email: string;
  password: string;
  name: string;
  disabled?: boolean;
  photoURL?: string;
  phoneNumber?: string;
  emailVerified?: boolean;
  comparePassword: (password: string) => Promise<Boolean>;
}
