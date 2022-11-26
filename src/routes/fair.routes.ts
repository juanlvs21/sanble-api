import { FairController } from "../controllers/fair.controller";
import { ErrorRouter } from "../error";
import { sessionMiddleware } from "../middlewares/session.middleware";

const router = new ErrorRouter();

router.get(
  "/",
  // sessionMiddleware,
  FairController.getList
);
router.get("/best", sessionMiddleware, FairController.getBest);
router.get("/geolocation", sessionMiddleware, FairController.getGeolocationAll);
router.get("/:fairID", sessionMiddleware, FairController.getDetails);

export default router.router;
