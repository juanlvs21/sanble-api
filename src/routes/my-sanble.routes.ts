import { MySanbleController } from "../controllers/my-sanble.controller";
import { ErrorRouter } from "../error";
import { sessionMiddleware } from "../middlewares/session.middleware";

const router = new ErrorRouter();

router.get("/fairs", sessionMiddleware, MySanbleController.getFairsList);
router.post("/fairs", sessionMiddleware, MySanbleController.saveFair);
router.get("/stands", sessionMiddleware, MySanbleController.getStandsList);

export default router.router;
