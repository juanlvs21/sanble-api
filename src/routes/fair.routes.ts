import { FairController } from "../controllers/fair.controller";
import { ErrorRouter } from "../error";
import { sessionMiddleware } from "../middlewares/session.middleware";
import { reviewValidator } from "../validators/review.validators";

const router = new ErrorRouter();

router.get("/", sessionMiddleware, FairController.getList);
router.get("/best", sessionMiddleware, FairController.getBest);
router.get("/geolocation", sessionMiddleware, FairController.getGeolocationAll);
router.get("/:fairID", sessionMiddleware, FairController.getDetails);
router.get(
  "/:fairID/reviews",
  sessionMiddleware,
  FairController.getListReviews
);
router.post(
  "/:fairID/reviews",
  sessionMiddleware,
  reviewValidator,
  FairController.saveReview
);

export default router.router;
