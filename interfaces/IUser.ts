type TMongoDocument = import("mongoose").Document;

export default interface IUser extends TMongoDocument {
  uuid: string;
  name?: string;
  email: string;
  username: string;
  password: string;
  url_avatar: string;
  is_active: boolean;
  admin: boolean;
  email_verified_at: string;
  token_email_verified: string;
  password_reset: object;
  createdAt: Date;

  encryptPassword(password: string): Promise<void>;
  comparePassword(password: string): Promise<boolean>;
}
