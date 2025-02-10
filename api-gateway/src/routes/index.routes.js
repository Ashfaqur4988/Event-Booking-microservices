import express from "express";
import proxy from "express-http-proxy";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.use("/auth", proxy(process.env.AUTH_SERVICE_URL));
router.use("/event", proxy(process.env.EVENT_SERVICE_URL));
router.use("/booking", proxy(process.env.BOOKING_SERVICE_URL));

export default router;
