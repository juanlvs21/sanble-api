import { AuthController } from "../controllers/auth.controller";
import { ErrorRouter } from "../error";
import {
  signUpValidator,
  signInValidator,
} from "../validators/auth.validators";
// import { auth } from '../middlewares/auth.middleware';

const router = new ErrorRouter();

// router
//   .route('/')
//   .get(auth, UserController.geIUsers)
//   .post(signUpValidator, UserController.createUser)
//   .delete(auth, UserController.deleteUser)
//   .put(auth, UserController.updateUserData);

router.post("/signup", signUpValidator, AuthController.signUp);
router.post("/signin", signInValidator, AuthController.signIn);

export default router.router;
