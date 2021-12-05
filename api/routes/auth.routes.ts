import { Router } from "express";

const router = Router();

// Controllers
import { signIn, signUp } from "../controllers/auth.controller";

// Validators
import { signInValidator, signUpValidator } from "../validators/auth.validator";

router.post("/signup/", signUpValidator, signUp);
router.post("/signin/", signInValidator, signIn);

export default router;
