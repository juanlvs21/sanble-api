// Copyright 2020 Dofusturas ~ All rights reserved.

import mongoose from "mongoose";
import { MONGODB_URI } from "@/config";

export const makeConnection = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log(`Database is connected✔️`);
  } catch (error) {
    console.error(error);
  }
};
