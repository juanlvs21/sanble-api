import { Router } from "express";

import userRoutes from "./user.routes";
import fairRoutes from "./fair.routes";
import standRoutes from "./stand.routes";

const router = Router();

router.use("/users", userRoutes);
router.use("/fairs", fairRoutes);
router.use("/stands", standRoutes);

export default router;