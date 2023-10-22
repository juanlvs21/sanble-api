import { Router } from "express";

import userRoutes from "./user.routes";
import favoriteRoutes from "./favorite.routes";
import fairRoutes from "./fair.routes";
import standRoutes from "./stand.routes";
import productRoutes from "./product.routes";
import mySanbleRoutes from "./my-sanble.routes";
import invitationRoutes from "./invitation.route";
import notificationRoutes from "./notification.routes";

const router = Router();

router.use("/user", userRoutes);
router.use("/favorites", favoriteRoutes);
router.use("/fairs", fairRoutes);
router.use("/stands", standRoutes);
router.use("/products", productRoutes);
router.use("/my-sanble", mySanbleRoutes);
router.use("/invitations", notificationRoutes);
router.use("/notification", invitationRoutes);

router.get("/ping", (_req, res) => res.status(200).send("pong"));
router.get("/healthcheck", (_req, res) => res.status(200).send("pong"));

export default router;
