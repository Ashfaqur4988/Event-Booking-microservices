import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "./config/index.js";
import logger from "./config/logger.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Notification Service");
});

app.listen(config.PORT || 3004, () => {
  logger.info("Notification Service listening on port ", config.PORT);
});
