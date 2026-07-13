import cors from "cors";
import express from "express";
import helmet from "helmet";
import { errorHandler } from "./common/middleware/error-handler.js";
import { generalLimiter } from "./common/middleware/rate-limit.js";
import { apiRouter } from "./routes/index.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(generalLimiter);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api", apiRouter);

  app.get("/", (_req, res) => {
    res.send("Server is running successfully");
  });

  app.use(errorHandler);

  return app;
}
