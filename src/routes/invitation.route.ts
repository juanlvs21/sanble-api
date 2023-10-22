import { InvitationController } from "../controllers/invitation.controller";
import { ErrorRouter } from "../error";
import { sessionMiddleware } from "../middlewares/session.middleware";

const router = new ErrorRouter();

// router.get("/sent", sessionMiddleware, FavoriteController.getFavoriteFair);
// router.get("/received", sessionMiddleware, FavoriteController.getFavoriteStand);
router.post("/", sessionMiddleware, InvitationController.sendInvitation);

export default router.router;
