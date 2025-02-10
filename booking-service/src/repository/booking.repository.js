import prisma from "../config/database/prisma.js";

class BookingRepository {
  async confirmBooking(orderData) {
    return await prisma.booking.create({ data: orderData });
  }

  async getBookings() {
    return await prisma.booking.findMany();
  }

  async getBookingById(bookingId) {
    return await prisma.booking.findUnique({ where: { bookingId } });
  }

  async getBookingByUserId(userId) {
    return await prisma.booking.findMany({ where: { userId } });
  }

  async updateBookingStatus(bookingId, status) {
    return await prisma.booking.update({
      where: { id: bookingId },
      data: { status: status },
    });
  }
}

export default new BookingRepository();
