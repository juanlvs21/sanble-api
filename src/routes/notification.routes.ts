import { NotificationController } from "../controllers/notification.controller";
import { ErrorRouter } from "../error";
import { tokenNotificationValidator } from "../validators/notification.validator";

const router = new ErrorRouter();

router.post(
  "/token",
  tokenNotificationValidator,
  NotificationController.saveToken
);

export default router.router;
