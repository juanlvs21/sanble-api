import { Router } from "express";

// Errors
import { handlerExceptionRoute } from "@/error";

// Validators
import * as authValidator from "@/utils/validators/auth.validator";

// Controllers
import * as authCtrl from "@/controllers/auth.controller";

// Router
const router = Router();

router.post(
  "/login",
  authValidator.logInValidator,
  handlerExceptionRoute(authCtrl.login)
);

export default router;
