import { StandController } from "../controllers/stand.controller";
import { ErrorRouter } from "../error";
import { sessionMiddleware } from "../middlewares/session.middleware";

const router = new ErrorRouter();

router.get("/", sessionMiddleware, StandController.getList);
router.get("/best", sessionMiddleware, StandController.getBest);
router.get("/:standID", sessionMiddleware, StandController.getDetails);

export default router.router;
