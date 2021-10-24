import mongoose from "mongoose";
import { DB_URI } from "@/config/env";

export const makeConnection = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log(`Database is connected✔️`);
  } catch (error) {
    console.error(error);
  }
};
