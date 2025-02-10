import prisma from "../config/database/prisma.js";

class EventRepository {
  async getAllEvents() {
    return await prisma.event.findMany();
  }

  async getEventById(id) {
    return await prisma.event.findUnique({
      where: {
        id,
      },
    });
  }

  async getEventByCategory(category) {
    return await prisma.event.findMany({
      where: {
        category,
      },
    });
  }

  async updateEvent(id, eventData) {
    return await prisma.event.update({
      where: { id },
      data: eventData,
    });
  }

  async createEvent(eventData) {
    return await prisma.event.create({ data: eventData });
  }

  async decreaseSeats(eventId, seats) {
    return await prisma.event.update({
      where: { id: eventId },
      data: { seats: { decrement: seats } },
    });
  }
}

export default new EventRepository();
