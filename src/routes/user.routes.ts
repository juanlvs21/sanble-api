import { UserController } from "../controllers/user.controller";
import { ErrorRouter } from "../error";
import { sessionMiddleware } from "../middlewares/session.middleware";
import {
  changePasswordValidator,
  recoveryPasswordValidator,
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
router.patch(
  "/change-password",
  sessionMiddleware,
  changePasswordValidator,
  UserController.changePassword
);

router.post(
  "/recovery-password",
  recoveryPasswordValidator,
  UserController.recoveryPassword
);

export default router.router;
