import { AuthController } from "../controllers/auth.controller";
import { ErrorRouter } from "../error";
import { sessionMiddleware } from "../middlewares/session.middleware";
import {
  signUpExternalValidator,
  signUpValidator,
} from "../validators/auth.validators";

const router = new ErrorRouter();

router.post("/signup", signUpValidator, AuthController.signUp);
router.post(
  "/signup/external",
  sessionMiddleware,
  signUpExternalValidator,
  AuthController.signUpExternal
);

export default router.router;
