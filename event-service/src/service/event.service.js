import eventRepository from "../repository/event.repository.js";

class EventService {
  async getAllEvents() {
    return await eventRepository.getAllEvents();
  }

  async getEventById(id) {
    return await eventRepository.getEventById(id);
  }

  async getEventByCategory(category) {
    return await eventRepository.getEventByCategory(category);
  }

  async updateEvent(id, eventData) {
    return await eventRepository.updateEvent(id, eventData);
  }

  async createEvent(eventData) {
    return await eventRepository.createEvent(eventData);
  }

  async decreaseSeats(eventId, seats) {
    return await eventRepository.decreaseSeats(eventId, seats);
  }
}

export default new EventService();
