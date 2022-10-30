import { UserController } from "../controllers/user.controller";
import { ErrorRouter } from "../error";
import { sessionMiddleware } from "../middlewares/session.middleware";
import { signUpValidator } from "../validators/auth.validators";

const router = new ErrorRouter();

router.post("/signup", signUpValidator, UserController.signUp);
router.get("/profile", sessionMiddleware, UserController.getProfile);

export default router.router;
