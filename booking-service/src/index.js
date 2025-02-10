import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "./config/index.js";
import { globalErrorHandler } from "./middlewares/errorHandler.js";
import allRoutes from "./routes/allRoutes.routes.js";
import { consumeMessage } from "./kafka/consumer.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Order Service");
});
app.use("/", allRoutes);
app.use(globalErrorHandler);

app.listen(config.PORT, () => {
  consumeMessage();
  console.log("Booking Service listening on port ", config.PORT);
});
