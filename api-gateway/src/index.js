import express from "express";
import cors from "cors";
import serviceRoutes from "./routes/index.routes.js";
import config from "./config/index.js";
import logger from "./config/logger.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", serviceRoutes);

app.get("/test", (req, res) => {
  res.send("API Gateway");
});

app.listen(process.env.PORT || 3000, () => {
  logger.info(`API Gateway listening on port ${config.PORT}`);
});
