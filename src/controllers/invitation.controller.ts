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

  static getReceived: Handler = async (req, res) => {
    const received = await InvitationService.getReceived(req.query, req.uid);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: received,
      message: "Listado de invitaciones recibidas",
    });
  };

  static getSent: Handler = async (req, res) => {
    const sent = await InvitationService.getSent(req.query, req.uid);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      data: sent,
      message: "Listado de invitaciones enviadas",
    });
  };

  static unsendInvitation: Handler = async (req, res) => {
    await InvitationService.unsendInvitation(req.params.id, req.uid);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      message: "Invitación cancelada exitosamente",
    });
  };

  static declineInvitation: Handler = async (req, res) => {
    await InvitationService.declineInvitation(req.params.id, req.uid);

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      message: "Invitación rechazada exitosamente",
    });
  };
}
