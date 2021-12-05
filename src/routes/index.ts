import { Router, Response } from "express";

import authRoutes from "@/routes/auth.routes";

const routes = Router();

routes.get("/", (_, res: Response) => {
  res.status(200).json({ data: "Welcome to de API" });
});

routes.use("/auth", authRoutes);

export default routes;
