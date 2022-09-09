import mongoose, { ConnectOptions } from "mongoose";
import { MONGODB_URI } from "./env";

export const makeConnection = async () => {
  try {
    const dbOptions: ConnectOptions = {
      //   user: config.DB.USER,
      //   pass: config.DB.PASSWORD
    };

    mongoose.connect(MONGODB_URI, dbOptions).then(() => {
      process.stdout.write(`Database is connected✅`);
    });

    const connection = mongoose.connection;

    connection.once("open", () => {
      process.stdout.write(`Database is open`);
    });

    connection.on("error", (err) => {
      process.stderr.write("Mongodb connection error ❌", err);
      process.exit();
    });
  } catch (err) {
    process.stderr.write("Mongodb makeConnection error ❌");
  }
};
