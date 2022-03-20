import { FairController } from "../controllers/fair.controller";
import { ErrorRouter } from "../error";

const router = new ErrorRouter();

router.get("/upcoming", FairController.getUpcoming);

export default router.router;
