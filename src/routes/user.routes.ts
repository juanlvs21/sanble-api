import { UserController } from "../controllers/user.controller";
import { ErrorRouter } from "../error";
import { sessionMiddleware } from "../middlewares/session.middleware";
import {
  changePasswordValidator,
  signUpValidator,
  updateUserValidator,
} from "../validators/auth.validators";

const router = new ErrorRouter();

router.post("/signup", signUpValidator, UserController.signUp);
router.get("/profile", sessionMiddleware, UserController.getProfile);
router.put(
  "/profile",
  sessionMiddleware,
  updateUserValidator,
  UserController.updateUser
);
router.put(
  "/change-password",
  sessionMiddleware,
  changePasswordValidator,
  UserController.changePassword
);

export default router.router;
