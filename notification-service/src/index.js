import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "./config/index.js";
import { consumeMessages } from "./kafka/consumer.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Notification Service");
});

app.listen(config.PORT, () => {
  consumeMessages();
  console.log(`Notification Service listening on port ${config.PORT}`);
});
