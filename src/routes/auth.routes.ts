import { AuthController } from "../controllers/auth.controller";
import { ErrorRouter } from "../error";
import { sessionMiddleware } from "../middlewares/session.middleware";
import { signUpValidator } from "../validators/auth.validators";

const router = new ErrorRouter();

router.post("/signup", signUpValidator, AuthController.signUp);
router.get("/user", sessionMiddleware, AuthController.getUserData);

export default router.router;
