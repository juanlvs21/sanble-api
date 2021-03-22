import { VercelRequest, VercelResponse } from "@vercel/node";
import {
  OK,
  METHOD_NOT_ALLOWED,
  UNPROCESSABLE_ENTITY,
  INTERNAL_SERVER_ERROR,
} from "http-status";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

// Utils
import { db } from "../../utils/firebase";
import { valid } from "../../utils/validator";

// Type
import { TStand } from "../../types/TStand";

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    if (req.method === "OPTIONS") {
      res.status(OK).end();
    } else if (req.method === "POST") {
      const body =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body;

      const validator = await valid(body, {
        name: ["required"],
        description: ["required"],
        uuid_user: ["required"],
      });

      if (!validator.valid)
        return res.status(UNPROCESSABLE_ENTITY).json({
          statusCode: UNPROCESSABLE_ENTITY,
          message: "Fields validation error",
          data: validator.errors,
        });

      // Extract data
      const { name, slogan, description, uuid_user } = body;

      const uuid: string = uuidv4();

      const data: TStand = {
        name,
        description,
        slogan: slogan || "",
        items: [],
        promotions: [],
        stars: 0,
        url_photo: "",
        creationTime: dayjs().format(),
        uuid,
        uuid_user,
      };

      await db.collection("stands").doc(uuid).set(data);

      res.status(OK).json({
        statusCode: OK,
        message: "Stand successfully registered",
        data,
      });
    } else {
      res.status(METHOD_NOT_ALLOWED).json({
        statusCode: METHOD_NOT_ALLOWED,
        message: "Method Not Allowed",
      });
    }
  } catch (error) {
    console.error(error);

    res.status(INTERNAL_SERVER_ERROR).json({
      statusCode: INTERNAL_SERVER_ERROR,
      message: "Internal Server Error",
    });
  }
};
