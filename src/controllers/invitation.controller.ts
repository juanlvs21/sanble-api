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
}
