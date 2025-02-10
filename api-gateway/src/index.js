import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import serviceRoutes from "./routes/index.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", serviceRoutes);

app.get("/test", (req, res) => {
  res.send("API Gateway");
});

app.listen(process.env.PORT, () => {
  console.log(`API Gateway listening on port ${process.env.PORT}`);
});
