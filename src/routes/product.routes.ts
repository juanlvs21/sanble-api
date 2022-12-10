import { ProductController } from "../controllers/product.controller";
import { ErrorRouter } from "../error";
import { sessionMiddleware } from "../middlewares/session.middleware";

const router = new ErrorRouter();

router.get("/types", sessionMiddleware, ProductController.getTypes);

export default router.router;
