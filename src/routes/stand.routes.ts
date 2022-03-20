import { StandController } from "../controllers/stand.controller";
import { ErrorRouter } from "../error";

const router = new ErrorRouter();

router.get("/best", StandController.getBest);

export default router.router;
