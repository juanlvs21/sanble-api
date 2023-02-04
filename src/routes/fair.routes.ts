import { FairController } from "../controllers/fair.controller";
import { ErrorRouter } from "../error";
import { sessionMiddleware } from "../middlewares/session.middleware";
import { fairPhotographValidator } from "../validators/fair.validators";
import { reviewValidator } from "../validators/review.validators";

const router = new ErrorRouter();

router.get("/", sessionMiddleware, FairController.getList);
router.get("/best", sessionMiddleware, FairController.getBest);
router.get("/geolocation", sessionMiddleware, FairController.getGeolocationAll);
router.get("/:fairID", sessionMiddleware, FairController.getDetails);
router.get("/:fairID/stands", sessionMiddleware, FairController.getStands);
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
router.post(
  "/:fairID/photograph",
  sessionMiddleware,
  fairPhotographValidator,
  FairController.uploadPhotograph
);

export default router.router;
