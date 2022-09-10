import { Router } from "express";

import authRoutes from "./auth.routes";
import fairRoutes from "./fair.routes";
import standRoutes from "./stand.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/fairs", fairRoutes);
router.use("/stands", standRoutes);

router.get("/ping", (_req, res) => res.status(200).send("pong"));
router.get("/healthcheck", (_req, res) => res.status(200).send("pong"));

export default router;
