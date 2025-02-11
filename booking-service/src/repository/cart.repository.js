import prisma from "../config/database/prisma.js";
import logger from "../config/logger.js";

class CartRepository {
  async addToCart(userId, eventId, quantity, price, totalAmount) {
    logger.info("Cart repository - Adding to cart");
    return await prisma.cart.create({
      data: { userId, eventId, quantity, price, totalAmount },
    });
  }

  async updateCart(cartId, quantity, totalAmount) {
    logger.info("Cart repository - Updating cart");
    const cartItems = await prisma.cart.findUnique({ where: { id: cartId } });
    return await prisma.cart.update({
      where: { id: cartId },
      data: { quantity: quantity, totalAmount: totalAmount },
    });
  }

  async removeFromCart(userId, eventId) {
    logger.info("Cart repository - Removing from cart");
    return await prisma.cart.deleteMany({ where: { userId, eventId } });
  }

  async getCartByUserId(userId) {
    logger.info("Cart repository - Getting cart by user id");
    const cart = await prisma.cart.findMany({ where: { userId: userId } });
    return cart[0];
  }

  async clearCart(userId) {
    logger.info("Cart repository - Clearing cart");
    return await prisma.cart.deleteMany({ where: { userId } });
  }
}

export default new CartRepository();
