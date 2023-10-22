import { check } from "express-validator";
import { EInvitationType } from "../interfaces/IInvitation";
import { validate } from "../middlewares/validator.middleware";

const formInvitation = [
  check("fairID", "La Feria es requerida").notEmpty(),
  check("standID", "El Stand es requerido").notEmpty(),
  check("type", "El tipo de invitación es requerido")
    .isString()
    .notEmpty()
    .isIn([EInvitationType.STAND_INVITATION, EInvitationType.FAIR_REQUEST])
    .withMessage(
      `El tipo de invitación debe ser "Invitar a Stand" o "Solicitud a Feria"`
    ),
];

export const invitationValidator = validate(formInvitation);
