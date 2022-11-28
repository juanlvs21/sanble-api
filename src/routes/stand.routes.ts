import { StandController } from "../controllers/stand.controller";
import { ErrorRouter } from "../error";
import { sessionMiddleware } from "../middlewares/session.middleware";

const router = new ErrorRouter();

router.get("/list", sessionMiddleware, StandController.getList);
router.get("/best", sessionMiddleware, StandController.getBest);

export default router.router;
