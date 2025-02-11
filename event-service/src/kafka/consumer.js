import { Kafka } from "kafkajs";
import eventRepository from "../repository/event.repository.js";
import { produceMessage } from "./producer.js"; // Make sure producer.js has proper error handling
import logger from "../config/logger.js";

const kafka = new Kafka({
  clientId: "booking-service", // More descriptive client ID
  brokers: ["192.168.56.165:9092"], // Use environment variable
});

const consumer = kafka.consumer({ groupId: "event-service-group" });

const consumeMessage = async () => {
  try {
    logger.info("Event service consumer connecting...");
    await consumer.connect();
    logger.info("Event service consumer connected.");

    await consumer.subscribe({ topic: "order-created", fromBeginning: true });
    logger.info("Event service consumer subscribed to topic: order-created.");

    await consumer.subscribe({
      topic: "get-event-details",
      fromBeginning: true,
    });
    logger.info(
      "Event service consumer subscribed to get event details topic."
    );

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const data = JSON.parse(message.value.toString());
          logger.info("Event service consumer received message.");

          if (topic === "order-created") {
            logger.info("Event service consumer received message for topic.");

            await eventRepository.decreaseSeats(data.eventId, data.seats);
            logger.info("Seats decreased.");

            await produceMessage("reduced-seats", {
              bookingId: data.bookingId,
              eventId: data.eventId,
              userId: data.userId,
            });
            logger.info("Produced reduced-seats message.");
          }

          if (topic === "get-event-details") {
            logger.info("Event service consumer received message for topic.");
            const eventData = await eventRepository.getEventById(data.eventId);
            logger.info("Event data fetched.");

            await produceMessage("event-details", {
              orderId: data.orderId,
              eventId: data.eventId,
              location: eventData.location,
              image: eventData.image,
              title: eventData.title,
            });
          }
        } catch (innerError) {
          logger.error("Error processing message:", innerError);
        }
      },
    });
  } catch (error) {
    logger.error("Error connecting or running consumer:", error);
  }
};

consumeMessage();
