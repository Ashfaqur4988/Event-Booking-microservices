import express from "express";
import cors from "cors";
import { config } from "./config/index.js";
import eventRoutes from "./routes/event.routes.js";
import { globalErrorHandler } from "./middleware/errorHandler.js";
import logger from "./config/logger.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", eventRoutes);
app.use(globalErrorHandler);

app.listen(config.PORT || 3002, () => {
  logger.info("event service listening on port ", config.PORT);
});
