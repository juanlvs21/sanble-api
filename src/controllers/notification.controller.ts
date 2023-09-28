import { Handler } from "express";
import { StatusCodes } from "http-status-codes";

import { NotificationService } from "../services/notification.service";

export class NotificationController {
  static saveToken: Handler = async (req, res) => {
    await NotificationService.saveToken(req.uid, req.body);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      message: "Token guardado exitosamente",
    });
  };
}
