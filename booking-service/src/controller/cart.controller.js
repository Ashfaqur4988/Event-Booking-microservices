import { StatusCodes } from "http-status-codes";
import cartService from "../service/cart.service.js";
import logger from "../config/logger.js";

const cartController = {
  addToCart: async (req, res, next) => {
    try {
      logger.info("Cart controller - Adding to cart");
      const userId = req.user.id;
      const { eventId, quantity, price } = req.body;

      const cart = await cartService.addToCart(
        userId,
        eventId,
        quantity,
        price
      );
      logger.info("Cart controller - Added to cart");
      res.status(StatusCodes.CREATED).json(cart);
    } catch (error) {
      next(error);
    }
  },

  updateCart: async (req, res, next) => {
    try {
      logger.info("Cart controller - Updating cart");
      const userId = req.user.id;
      const { quantity } = req.body;
      const cart = await cartService.updateCart(userId, quantity);
      logger.info("Cart controller - Updated cart");
      res.status(StatusCodes.OK).json(cart);
    } catch (error) {
      next(error);
    }
  },

  removeFromCart: async (req, res, next) => {
    try {
      logger.info("Cart controller - Removing from cart");
      const userId = req.user.id;
      const { eventId } = req.params;
      const cart = await cartService.removeFromCart(userId, eventId);
      logger.info("Cart controller - Removed from cart");
      res.status(StatusCodes.OK).json(cart);
    } catch (error) {
      next(error);
    }
  },

  getCartByUserId: async (req, res, next) => {
    console.log(req.user.id);
    try {
      logger.info("Cart controller - Getting cart by user id");
      const userId = req.user.id;
      const cart = await cartService.getCartByUserId(userId);
      logger.info("Cart controller - Got cart by user id");
      res.status(StatusCodes.OK).json(cart);
    } catch (error) {
      next(error);
    }
  },

  clearCart: async (req, res, next) => {
    try {
      logger.info("Cart controller - Clearing cart");
      const userId = req.user.id;
      const cart = await cartService.clearCart(userId);
      logger.info("Cart controller - Cleared cart");
      res.status(StatusCodes.OK).json(cart);
    } catch (error) {
      next(error);
    }
  },
};

export default cartController;
