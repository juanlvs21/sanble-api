import { Handler } from "express";
import { StatusCodes } from "http-status-codes";

import { InvitationService } from "../services/invitation.service";

export class InvitationController {
  static sendInvitation: Handler = async (req, res) => {
    const fair = await InvitationService.sendInvitation(req.body, req.uid);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: fair,
      message: "Invitación/solicitud enviada exitosamente",
    });
  };

  static getListStands: Handler = async (req, res) => {
    const stands = await InvitationService.getListStands(req.query, req.uid);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: stands,
      message: "Listado de stands",
    });
  };

  static getListFairs: Handler = async (req, res) => {
    const fairs = await InvitationService.getListFairs(req.query, req.uid);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: fairs,
      message: "Listado de ferias",
    });
  };
}
