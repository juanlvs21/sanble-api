import { FairController } from "../controllers/fair.controller";
import { ErrorRouter } from "../error";
import { sessionMiddleware } from "../middlewares/session.middleware";

const router = new ErrorRouter();

router.get("/upcoming", sessionMiddleware, FairController.getUpcoming);

export default router.router;
