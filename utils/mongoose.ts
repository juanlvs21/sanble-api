import mongoose from "mongoose";
import { config } from "dotenv";
config();

import { MONGODB_URI } from "./env";

export const makeConnection = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.info(`Database is connected✔️`);
  } catch (error) {
    console.error(error);
  }
};
