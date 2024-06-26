import { InvitationController } from "../controllers/invitation.controller";
import { ErrorRouter } from "../error";
import { sessionMiddleware } from "../middlewares/session.middleware";
import { invitationValidator } from "../validators/invitation.validators";

const router = new ErrorRouter();

router.get("/sent", sessionMiddleware, InvitationController.getSent);
router.get("/received", sessionMiddleware, InvitationController.getReceived);
router.get("/form/fairs", sessionMiddleware, InvitationController.getListFairs);
router.get(
  "/form/stands",
  sessionMiddleware,
  InvitationController.getListStands
);
router.post(
  "/",
  sessionMiddleware,
  invitationValidator,
  InvitationController.sendInvitation
);
router.delete(
  "/:id/unsend",
  sessionMiddleware,
  InvitationController.unsendInvitation
);
router.delete(
  "/:id/decline",
  sessionMiddleware,
  InvitationController.declineInvitation
);

export default router.router;
