import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import { config } from "dotenv";

config();

// Config
import { LOG_MODE, PORT } from "./config/env";

// Routes
import routes from "./routes";

const app = express();

// I18n

// Settings
app.set("port", PORT);

// Middlewares input
app.use(cors());
app.use(morgan(LOG_MODE));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static files
app.use("/static", express.static(path.resolve(__dirname, "../public")));

// Api Key Middleware
// app.use(apiKeyMiddleware);

// Routes
app.use("/api", routes);

// Middlewares not found
app.use(function (req, res) {
  res.status(404).json({
    message: "Not Found",
    path: req.url,
    statusCode: 404,
  });
});

export default app;
