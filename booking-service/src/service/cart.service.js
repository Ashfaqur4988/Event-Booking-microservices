import cartRepository from "../repository/cart.repository.js";
import axios from "axios";
import { StatusCodes } from "http-status-codes";
import config from "../config/index.js";
import { AppError } from "../middlewares/errorHandler.js";

class CartService {
  async addToCart(userId, eventId, quantity, price) {
    const event = await axios.get(`${config.EVENT_SERVICE_URL}/${eventId}`);
    if (!event) {
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
    const cart = await cartRepository.getCartByUserId(userId);
    if (!cart) {
      throw new AppError(StatusCodes.NOT_FOUND, "Cart not found");
    }

    if (quantity <= 0) {
      return await cartRepository.removeFromCart(userId, cart.eventId);
    }

    const total = cart.price * quantity;
    return await cartRepository.updateCart(cart.id, quantity, total);
  }

  async removeFromCart(userId, eventId) {
    const cart = await cartRepository.getCartByUserId(userId);
    if (!cart) {
      throw new AppError(StatusCodes.NOT_FOUND, "Cart not found");
    }
    return await cartRepository.removeFromCart(userId, eventId);
  }

  async getCartByUserId(userId) {
    return await cartRepository.getCartByUserId(userId);
  }

  async clearCart(userId) {
    return await cartRepository.clearCart(userId);
  }
}

export default new CartService();
