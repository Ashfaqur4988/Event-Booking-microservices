import config from "../config/index.js";
import { produceMessage } from "../kafka/producer.js";
import { AppError } from "../middlewares/errorHandler.js";
import bookingRepository from "../repository/booking.repository.js";
import cartRepository from "../repository/cart.repository.js";
import axios from "axios";

class BookingService {
  async confirmBooking(userId) {
    let cartData = await cartRepository.getCartByUserId(userId);
    if (!cartData) {
      throw new AppError(StatusCodes.NOT_FOUND, "Cart not found");
    }
    const event = await axios.get(
      `${config.EVENT_SERVICE_URL}/${cartData.eventId}`
    );
    if (event.seats <= 0) {
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
    const updatedBooking = await bookingRepository.updateBookingStatus(
      bookingId,
      status
    );

    console.log(
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
    console.log(
      "after sending message from booking producer, message: BOOKING_CONFIRMED "
    );

    return updatedBooking;
  }

  async getBookings() {
    return await bookingRepository.getBookings();
  }

  async getBookingById(bookingId) {
    return await bookingRepository.getBookingById(bookingId);
  }

  async getBookingByUserId(userId) {
    return await bookingRepository.getBookingByUserId(userId);
  }
}

export default new BookingService();
