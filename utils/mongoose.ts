import { NowResponse } from "@vercel/node";
import mongoose from "mongoose";
import { INTERNAL_SERVER_ERROR } from "http-status";
import { config } from "dotenv";
config();

import { MONGODB_URI } from "./env";

export const makeConnection = async (res: NowResponse) => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.info(`Database is connected✔️`);
  } catch (error) {
    console.error(error);
    res.status(INTERNAL_SERVER_ERROR).json({
      statusCode: INTERNAL_SERVER_ERROR,
      message: "Internal Server Error",
    });
  }
};
