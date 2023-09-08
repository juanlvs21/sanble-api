import { StandController } from "../controllers/stand.controller";
import { ErrorRouter } from "../error";
import { sessionMiddleware } from "../middlewares/session.middleware";
import { reviewValidator } from "../validators/review.validators";

const router = new ErrorRouter();

router.get("/", sessionMiddleware, StandController.getList);
router.get("/best", sessionMiddleware, StandController.getBest);
router.get("/:standID", sessionMiddleware, StandController.getDetails);
router.get(
  "/:standID/reviews",
  sessionMiddleware,
  StandController.getListReviews
);
router.post(
  "/:standID/reviews",
  sessionMiddleware,
  reviewValidator,
  StandController.saveReview
);
router.delete(
  "/:standID/reviews",
  sessionMiddleware,
  StandController.deleteReview
);
router.post(
  "/:standID/photograph",
  sessionMiddleware,
  StandController.uploadPhotograph
);
router.post(
  "/:standID/photograph/:photoID",
  sessionMiddleware,
  StandController.updatePhotograph
);
router.delete(
  "/:standID/photograph/:photoID",
  sessionMiddleware,
  StandController.deletePhotograph
);

export default router.router;
