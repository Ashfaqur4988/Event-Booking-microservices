import express from "express";
import cartController from "../controller/cart.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import bookingController from "../controller/booking.controller.js";

const router = express.Router();

router
  .get("/cart-by-user", authMiddleware.protect, cartController.getCartByUserId)
  .post("/cart", authMiddleware.protect, cartController.addToCart)
  .delete("/clear-cart", authMiddleware.protect, cartController.clearCart)
  .delete(
    "/remove-from-cart/:eventId",
    authMiddleware.protect,
    cartController.removeFromCart
  )
  .patch("/update-cart", authMiddleware.protect, cartController.updateCart);

router
  .get("/order", bookingController.getBookings)
  .post(
    "/create-order",
    authMiddleware.protect,
    bookingController.confirmBooking
  )
  .get("/order/:id", bookingController.getBookingById)
  .get("/order-by-user-id", bookingController.getBookingByUserId);

export default router;
