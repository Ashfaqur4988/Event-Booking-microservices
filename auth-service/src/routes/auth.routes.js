import express from "express";
import authController from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// router.get("/test", (req, res) => {
//   res.status(200).json({ message: "Auth service is working" });
// });

router
  .get("/get-user", authMiddleware.protect, authController.getUser)
  .post("/signup", authController.signup)
  .post("/login", authController.login)
  .post("/logout", authController.logout);

export default router;
