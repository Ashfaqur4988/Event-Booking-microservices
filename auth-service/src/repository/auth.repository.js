import prisma from "../config/database/prisma.js";

class UserRepository {
  async findByEmail(email) {
    return await prisma.user.findUnique({ where: { email } });
  }

  async findById(id) {
    return await prisma.user.findUnique({ where: { id } });
  }

  async createUser(userData) {
    return await prisma.user.create({ data: userData });
  }

  async updateUser(id, userData) {
    return await prisma.user.update({ where: { id }, data: userData });
  }

  async deleteUser(id) {
    return await prisma.user.delete({ where: { id } });
  }

  async getUserById(userId) {
    return await prisma.user.findUnique({
      where: { id: userId },
    });
  }
}

export default new UserRepository();
