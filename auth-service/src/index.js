import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import { globalErrorHandler } from "./middleware/errorHandler.js";
import { consumeMessages } from "./kafka/consumer.js";

dotenv.config();

const app = express();

app.use(cookieParser());

app.use(cors());
app.use(express.json());

app.use("/", authRoutes);

app.use(globalErrorHandler);

app.listen(process.env.PORT, () => {
  consumeMessages();
  console.log(`auth service listening on port ${process.env.PORT}`);
});
