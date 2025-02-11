import prisma from "../config/database/prisma.js";
import logger from "../config/logger.js";

class UserRepository {
  async findByEmail(email) {
    logger.info("auth repository - Finding user by email");
    return await prisma.user.findUnique({ where: { email } });
  }

  async findById(id) {
    logger.info("auth repository - Finding user by id");
    return await prisma.user.findUnique({ where: { id } });
  }

  async createUser(userData) {
    logger.info("auth repository - Creating user");
    return await prisma.user.create({ data: userData });
  }

  async updateUser(id, userData) {
    logger.info("auth repository - Updating user");
    return await prisma.user.update({ where: { id }, data: userData });
  }

  async deleteUser(id) {
    logger.info("auth repository - Deleting user");
    return await prisma.user.delete({ where: { id } });
  }

  async getUserById(userId) {
    logger.info("auth repository - Getting user by id");
    return await prisma.user.findUnique({
      where: { id: userId },
    });
  }
}

export default new UserRepository();
