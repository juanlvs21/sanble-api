import { InvitationController } from "../controllers/invitation.controller";
import { ErrorRouter } from "../error";
import { sessionMiddleware } from "../middlewares/session.middleware";
import { invitationValidator } from "../validators/invitation.validators";

const router = new ErrorRouter();

// router.get("/sent", sessionMiddleware, FavoriteController.getFavoriteFair);
// router.get("/received", sessionMiddleware, FavoriteController.getFavoriteStand);
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
export default router.router;
