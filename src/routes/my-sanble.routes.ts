import { MySanbleController } from "../controllers/my-sanble.controller";
import { ErrorRouter } from "../error";
import { sessionMiddleware } from "../middlewares/session.middleware";
import { fairsValidator } from "../validators/fairs.validators";

const router = new ErrorRouter();

router.get("/fairs", sessionMiddleware, MySanbleController.getFairsList);
router.post(
  "/fairs",
  sessionMiddleware,
  fairsValidator,
  MySanbleController.saveFair
);
router.get("/stands", sessionMiddleware, MySanbleController.getStandsList);

export default router.router;
