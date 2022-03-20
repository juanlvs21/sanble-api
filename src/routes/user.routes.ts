import { UserController } from "../controllers/user.controller";
import { ErrorRouter } from "../error";
import {
  signUpValidator,
  logInValidator,
} from "../validators/users.validators";
// import { auth } from '../middlewares/auth.middleware';

const router = new ErrorRouter();

// router
//   .route('/')
//   .get(auth, UserController.getUsers)
//   .post(signUpValidator, UserController.createUser)
//   .delete(auth, UserController.deleteUser)
//   .put(auth, UserController.updateUserData);

router.post("/signup", signUpValidator, UserController.signUp);
router.post("/login", logInValidator, UserController.logIn);

export default router.router;
