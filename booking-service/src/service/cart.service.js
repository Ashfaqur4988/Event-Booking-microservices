import cartRepository from "../repository/cart.repository.js";
import axios from "axios";
import { StatusCodes } from "http-status-codes";
import config from "../config/index.js";
import { AppError } from "../middlewares/errorHandler.js";
import logger from "../config/logger.js";

class CartService {
  async addToCart(userId, eventId, quantity, price) {
    logger.info("Cart service - Adding to cart");
    const event = await axios.get(`${config.EVENT_SERVICE_URL}/${eventId}`);
    if (!event) {
      logger.error("Event not found");
      throw new AppError(StatusCodes.NOT_FOUND, "Event not found");
    }
    const total = quantity * price;
    return await cartRepository.addToCart(
      userId,
      eventId,
      quantity,
      price,
      total
    );
  }

  async updateCart(userId, quantity) {
    logger.info("Cart service - Updating cart");
    const cart = await cartRepository.getCartByUserId(userId);
    if (!cart) {
      logger.error("Cart not found");
      throw new AppError(StatusCodes.NOT_FOUND, "Cart not found");
    }

    if (quantity <= 0) {
      return await cartRepository.removeFromCart(userId, cart.eventId);
    }

    const total = cart.price * quantity;
    return await cartRepository.updateCart(cart.id, quantity, total);
  }

  async removeFromCart(userId, eventId) {
    logger.info("Cart service - Removing from cart");
    const cart = await cartRepository.getCartByUserId(userId);
    if (!cart) {
      logger.error("Cart not found");
      throw new AppError(StatusCodes.NOT_FOUND, "Cart not found");
    }

    return await cartRepository.removeFromCart(userId, eventId);
  }

  async getCartByUserId(userId) {
    logger.info("Cart service - Getting cart by user id");
    return await cartRepository.getCartByUserId(userId);
  }

  async clearCart(userId) {
    logger.info("Cart service - Clearing cart");
    return await cartRepository.clearCart(userId);
  }
}

export default new CartService();
