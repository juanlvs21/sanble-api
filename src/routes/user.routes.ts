import { UserController } from "../controllers/user.controller";
import { ErrorRouter } from "../error";
import { sessionMiddleware } from "../middlewares/session.middleware";
import { signUpValidator } from "../validators/auth.validators";

const router = new ErrorRouter();

router.post("/signup", signUpValidator, UserController.signUp);
router.get("/profile", sessionMiddleware, UserController.getProfile);
router.patch(
  "/favorite/fair",
  sessionMiddleware,
  UserController.setFavoriteFair
);
router.patch(
  "/favorite/stand",
  sessionMiddleware,
  UserController.setFavoriteStand
);
router.patch(
  "/favorite/product",
  sessionMiddleware,
  UserController.setFavoriteProduct
);

export default router.router;
