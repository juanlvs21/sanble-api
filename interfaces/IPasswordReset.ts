type TMongoDocument = import("mongoose").Document;

export default interface IPasswordReset extends TMongoDocument {
  password_reset: string;
  password_reset_used: boolean;
  password_reset_date: Date;
}
