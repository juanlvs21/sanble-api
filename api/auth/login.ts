import { NowRequest, NowResponse } from "@vercel/node";
import { OK, METHOD_NOT_ALLOWED, INTERNAL_SERVER_ERROR } from "http-status";

// Config
import { makeConnection } from "../../config/mongoose";

export default async (req: NowRequest, res: NowResponse) => {
  try {
    if (req.method === "POST") {
      await makeConnection(); // Connected to the database

      res.status(200).json({
        status: OK,
        message: "/auth/login",
      });
    } else {
      res.status(405).json({
        status: METHOD_NOT_ALLOWED.toString,
        message: "Method Not Allowed",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: INTERNAL_SERVER_ERROR,
      message: "Internal Server Error",
    });
  }
};
