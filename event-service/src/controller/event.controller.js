import { StatusCodes } from "http-status-codes";
import eventService from "../service/event.service.js";

const eventController = {
  getAllEvents: async (req, res, next) => {
    try {
      const events = await eventService.getAllEvents();
      res.status(StatusCodes.OK).json(events);
    } catch (error) {
      next(error);
    }
  },

  getEventsById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const event = await eventService.getEventById(id);
      res.status(StatusCodes.OK).json(event);
    } catch (error) {
      next(error);
    }
  },

  getEventsByCategory: async (req, res, next) => {
    try {
      const { category } = req.params;
      const events = await eventService.getEventByCategory(category);
      res.status(StatusCodes.OK).json(events);
    } catch (error) {
      next(error);
    }
  },

  createEvent: async (req, res, next) => {
    try {
      const eventData = req.body;
      const event = await eventService.createEvent(eventData);
      res.status(StatusCodes.CREATED).json(event);
    } catch (error) {
      next(error);
    }
  },

  updateEvent: async (req, res, next) => {
    try {
      const { id } = req.params;
      const eventData = req.body;
      const event = await eventService.updateEvent(id, eventData);
      res.status(StatusCodes.OK).json(event);
    } catch (error) {
      next(error);
    }
  },
};

export default eventController;
