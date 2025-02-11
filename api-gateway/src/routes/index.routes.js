import express from "express";
import proxy from "express-http-proxy";
import config from "../config/index.js";

const router = express.Router();

router.use("/auth", proxy(config.AUTH_SERVICE_URL));
router.use("/event", proxy(config.EVENT_SERVICE_URL));
router.use("/booking", proxy(config.BOOKING_SERVICE_URL));

export default router;
