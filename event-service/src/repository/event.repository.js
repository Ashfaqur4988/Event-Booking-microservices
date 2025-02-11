import prisma from "../config/database/prisma.js";
import logger from "../config/logger.js";

class EventRepository {
  async getAllEvents() {
    logger.info("Event repository - Getting all events");
    return await prisma.event.findMany();
  }

  async getEventById(id) {
    logger.info("Event repository - Getting event by id");
    return await prisma.event.findUnique({
      where: {
        id,
      },
    });
  }

  async getEventByCategory(category) {
    logger.info("Event repository - Getting event by category");
    return await prisma.event.findMany({
      where: {
        category,
      },
    });
  }

  async updateEvent(id, eventData) {
    logger.info("Event repository - Updating event");
    return await prisma.event.update({
      where: { id },
      data: eventData,
    });
  }

  async createEvent(eventData) {
    logger.info("Event repository - Creating event");
    return await prisma.event.create({ data: eventData });
  }

  async decreaseSeats(eventId, seats) {
    logger.info("Event repository - Decreasing seats");
    return await prisma.event.update({
      where: { id: eventId },
      data: { seats: { decrement: seats } },
    });
  }
}

export default new EventRepository();
