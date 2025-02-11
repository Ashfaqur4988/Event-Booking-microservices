import logger from "../config/logger.js";
import eventRepository from "../repository/event.repository.js";

class EventService {
  async getAllEvents() {
    logger.info("Event service - Getting all events");
    return await eventRepository.getAllEvents();
  }

  async getEventById(id) {
    logger.info("Event service - Getting event by id");
    return await eventRepository.getEventById(id);
  }

  async getEventByCategory(category) {
    logger.info("Event service - Getting event by category");
    return await eventRepository.getEventByCategory(category);
  }

  async updateEvent(id, eventData) {
    logger.info("Event service - Updating event");
    return await eventRepository.updateEvent(id, eventData);
  }

  async createEvent(eventData) {
    logger.info("Event service - Creating event");
    return await eventRepository.createEvent(eventData);
  }

  async decreaseSeats(eventId, seats) {
    logger.info("Event service - Decreasing seats");
    return await eventRepository.decreaseSeats(eventId, seats);
  }
}

export default new EventService();
