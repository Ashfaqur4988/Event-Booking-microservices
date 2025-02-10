import prisma from "../config/database/prisma.js";

class CartRepository {
  async addToCart(userId, eventId, quantity, price, totalAmount) {
    return await prisma.cart.create({
      data: { userId, eventId, quantity, price, totalAmount },
    });
  }

  async updateCart(cartId, quantity, totalAmount) {
    const cartItems = await prisma.cart.findUnique({ where: { id: cartId } });
    return await prisma.cart.update({
      where: { id: cartId },
      data: { quantity: quantity, totalAmount: totalAmount },
    });
  }

  async removeFromCart(userId, eventId) {
    return await prisma.cart.deleteMany({ where: { userId, eventId } });
  }

  async getCartByUserId(userId) {
    const cart = await prisma.cart.findMany({ where: { userId: userId } });
    return cart[0];
  }

  async clearCart(userId) {
    return await prisma.cart.deleteMany({ where: { userId } });
  }
}

export default new CartRepository();
