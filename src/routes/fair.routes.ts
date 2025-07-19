import { FairController } from "../controllers/fair.controller";
import { ErrorRouter } from "../error";
import { sessionMiddleware } from "../middlewares/session.middleware";
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
router.delete(
  "/:fairID/reviews",
  sessionMiddleware,
  FairController.deleteReview
);
router.get(
  "/:fairID/photograph/:photoID",
  sessionMiddleware,
  FairController.getPhotograph
);
router.post(
  "/:fairID/photograph",
  sessionMiddleware,
  FairController.uploadPhotograph
);
router.post(
  "/:fairID/photograph/:photoID",
  sessionMiddleware,
  FairController.updatePhotograph
);
router.delete(
  "/:fairID/photograph/:photoID",
  sessionMiddleware,
  FairController.deletePhotograph
);
router.get("/:fairID/posts", sessionMiddleware, FairController.getListPosts);
router.post("/:fairID/posts", sessionMiddleware, FairController.savePost);
router.put(
  "/:fairID/posts/:postID",
  sessionMiddleware,
  FairController.updatePost
);
router.delete(
  "/:fairID/posts/:postID",
  sessionMiddleware,
  FairController.deletePost
);
router.delete(
  "/:fairID/stands/:standID",
  sessionMiddleware,
  FairController.removeStand
);

export default router.router;
