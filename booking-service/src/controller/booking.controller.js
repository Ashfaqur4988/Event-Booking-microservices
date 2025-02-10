import bookingService from "../service/booking.service.js";
import { StatusCodes } from "http-status-codes";

const bookingController = {
  confirmBooking: async (req, res, next) => {
    try {
      const userId = req.user.id;
      if (!userId) throw new Error("User not found");
      const booking = await bookingService.confirmBooking(userId);
      res.status(StatusCodes.CREATED).json(booking);
    } catch (error) {
      next(error);
    }
  },

  getBookings: async (req, res, next) => {
    try {
      const bookings = await bookingService.getBookings();
      res.status(StatusCodes.OK).json(bookings);
    } catch (error) {
      next(error);
    }
  },

  getBookingById: async (req, res, next) => {
    try {
      const bookingId = req.params;
      const booking = await bookingService.getBookingById(bookingId);
      res.status(StatusCodes.OK).json(booking);
    } catch (error) {
      next(error);
    }
  },

  getBookingByUserId: async (req, res, next) => {
    try {
      const user = req.user.id;
      const booking = await bookingService.getBookingByUserId(userId);
      res.status(StatusCodes.OK).json(booking);
    } catch (error) {
      next(error);
    }
  },
};

export default bookingController;
