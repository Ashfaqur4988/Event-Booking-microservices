import { StatusCodes } from "http-status-codes";
import cartService from "../service/cart.service.js";

const cartController = {
  addToCart: async (req, res, next) => {
    try {
      console.log(req.user.id);
      const userId = req.user.id;
      const { eventId, quantity, price } = req.body;

      const cart = await cartService.addToCart(
        userId,
        eventId,
        quantity,
        price
      );

      res.status(StatusCodes.CREATED).json(cart);
    } catch (error) {
      next(error);
    }
  },

  updateCart: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { quantity } = req.body;
      const cart = await cartService.updateCart(userId, quantity);
      res.status(StatusCodes.OK).json(cart);
    } catch (error) {
      next(error);
    }
  },

  removeFromCart: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { eventId } = req.params;
      const cart = await cartService.removeFromCart(userId, eventId);
      res.status(StatusCodes.OK).json(cart);
    } catch (error) {
      next(error);
    }
  },

  getCartByUserId: async (req, res, next) => {
    console.log(req.user.id);
    try {
      const userId = req.user.id;
      const cart = await cartService.getCartByUserId(userId);
      res.status(StatusCodes.OK).json(cart);
    } catch (error) {
      next(error);
    }
  },

  clearCart: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const cart = await cartService.clearCart(userId);
      res.status(StatusCodes.OK).json(cart);
    } catch (error) {
      next(error);
    }
  },
};

export default cartController;
