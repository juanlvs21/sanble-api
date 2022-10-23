import { FairController } from "../controllers/fair.controller";
import { ErrorRouter } from "../error";
import { sessionMiddleware } from "../middlewares/session.middleware";

const router = new ErrorRouter();

router.get("/", sessionMiddleware, FairController.getList);
router.get("/best", sessionMiddleware, FairController.getBest);

export default router.router;
