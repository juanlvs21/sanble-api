// import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";

interface IPayload {
  user: {
    id: string;
  };
}

export class JWT {
  static generateToken(payload: IPayload, expiresIn: number | string = "24h") {
    const token = "";
    // const token = jwt.sign(payload, JWT_SECRET, {
    //   expiresIn,
    // });

    return token;
  }

  static verifyToken(token: string): IPayload {
    // const payload = jwt.verify(token, JWT_SECRET) as IPayload;
    const payload = {
      user: {
        id: "",
      },
    };

    return payload;
  }
}
