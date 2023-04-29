import { MySanbleController } from "../controllers/my-sanble.controller";
import { ErrorRouter } from "../error";
import { sessionMiddleware } from "../middlewares/session.middleware";
import { fairValidator } from "../validators/fairs.validators";
import { standValidator } from "../validators/stands.validators";

const router = new ErrorRouter();

router.get("/fairs", sessionMiddleware, MySanbleController.getFairsList);
router.post(
  "/fairs",
  sessionMiddleware,
  fairValidator,
  MySanbleController.saveFair
);
router.get("/stands", sessionMiddleware, MySanbleController.getStandsList);
router.post(
  "/stands",
  sessionMiddleware,
  standValidator,
  MySanbleController.saveStand
);

export default router.router;
