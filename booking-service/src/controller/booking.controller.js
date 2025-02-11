import bookingService from "../service/booking.service.js";
import { StatusCodes } from "http-status-codes";
import logger from "../config/logger.js";

const bookingController = {
  confirmBooking: async (req, res, next) => {
    try {
      logger.info(`Confirm booking controller`);
      const userId = req.user.id;
      if (!userId) {
        logger.error("User not found");
        throw new Error("User not found");
      }
      const booking = await bookingService.confirmBooking(userId);
      logger.info(`Confirm booking controller, booking created`);
      res.status(StatusCodes.CREATED).json(booking);
    } catch (error) {
      next(error);
    }
  },

  getBookings: async (req, res, next) => {
    try {
      logger.info(`Get bookings controller`);
      const bookings = await bookingService.getBookings();
      res.status(StatusCodes.OK).json(bookings);
    } catch (error) {
      next(error);
    }
  },

  getBookingById: async (req, res, next) => {
    try {
      logger.info(`Get booking by id controller`);
      const bookingId = req.params;
      const booking = await bookingService.getBookingById(bookingId);
      res.status(StatusCodes.OK).json(booking);
    } catch (error) {
      next(error);
    }
  },

  getBookingByUserId: async (req, res, next) => {
    try {
      logger.info(`Get booking by user id controller`);
      const userId = req.user.id;
      const booking = await bookingService.getBookingByUserId(userId);
      res.status(StatusCodes.OK).json(booking);
    } catch (error) {
      next(error);
    }
  },
};

export default bookingController;
