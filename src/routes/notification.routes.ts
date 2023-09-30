import { NotificationController } from "../controllers/notification.controller";
import { ErrorRouter } from "../error";
import { sessionMiddleware } from "../middlewares/session.middleware";
import { tokenNotificationValidator } from "../validators/notification.validator";

const router = new ErrorRouter();

router.post(
  "/token",
  sessionMiddleware,
  tokenNotificationValidator,
  NotificationController.saveToken
);

export default router.router;
