import config from "../config/index.js";
import { produceMessage } from "../kafka/producer.js";
import { AppError } from "../middlewares/errorHandler.js";
import bookingRepository from "../repository/booking.repository.js";
import cartRepository from "../repository/cart.repository.js";
import axios from "axios";
import logger from "../config/logger.js";

class BookingService {
  async confirmBooking(userId) {
    logger.info(`Confirm booking service`);
    let cartData = await cartRepository.getCartByUserId(userId);
    if (!cartData) {
      logger.error("Cart not found");
      throw new AppError(StatusCodes.NOT_FOUND, "Cart not found");
    }
    const event = await axios.get(
      `${config.EVENT_SERVICE_URL}/${cartData.eventId}`
    );
    if (event.seats <= 0) {
      logger.error("Seats not available");
      throw new AppError(StatusCodes.NOT_FOUND, "Seats not available");
    }
    const orderData = {
      userId: userId,
      eventId: cartData.eventId,
      price: cartData.price,
      totalAmount: cartData.totalAmount,
      quantity: cartData.quantity,
    };
    const bookingData = await bookingRepository.confirmBooking(orderData);

    await produceMessage("order-created", {
      eventId: bookingData.eventId,
      userId: bookingData.userId,
      bookingId: bookingData.id,
      seats: bookingData.quantity,
    });

    await cartRepository.clearCart(userId);

    return bookingData;
  }

  async updateBookingStatus(bookingId, status) {
    logger.info(`Update booking status service`);
    const updatedBooking = await bookingRepository.updateBookingStatus(
      bookingId,
      status
    );

    logger.info(
      "before sending message from booking producer, message: BOOKING_CONFIRMED "
    );

    await produceMessage("booking-confirmed", {
      orderId: updatedBooking.id,
      userId: updatedBooking.userId,
      eventId: updatedBooking.eventId,
      quantity: updatedBooking.quantity,
      price: updatedBooking.price,
      totalAmount: updatedBooking.totalAmount,
      status: updatedBooking.status,
    });
    logger.info(
      "after sending message from booking producer, message: BOOKING_CONFIRMED "
    );

    return updatedBooking;
  }

  async getBookings() {
    logger.info(`Get bookings service`);
    return await bookingRepository.getBookings();
  }

  async getBookingById(bookingId) {
    logger.info(`Get booking by id service`);
    return await bookingRepository.getBookingById(bookingId);
  }

  async getBookingByUserId(userId) {
    logger.info(`Get booking by user id service`);
    return await bookingRepository.getBookingByUserId(userId);
  }
}

export default new BookingService();
