import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";

import { NOT_FOUND } from "http-status";

// Import Middlewares
import handleErrorMiddleware from "@/middlewares/error.middleware";
import routes from "@/routes";

const app = express();

// Settings
app.set("port", process.env.PORT || 3000);

// Middlewares input
app.use(
  cors({
    origin: "*",
  })
);
app.use(morgan(process.env.LOG_MODE || "dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static Index Page
app.use("/", express.static(path.resolve(__dirname, "../public")));

// Routes
app.use("/api", routes);

// Middlewares output
app.use(handleErrorMiddleware);

// Middlewares not found
app.use(function (req, res, next) {
  res.status(NOT_FOUND).json({
    message: "Not Found",
    path: req.url,
    statusCode: NOT_FOUND,
  });
});

export default app;
