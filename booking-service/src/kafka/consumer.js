import { Kafka } from "kafkajs";
import bookingService from "../service/booking.service.js";
import logger from "../config/logger.js";

const kafka = new Kafka({
  clientId: "booking service",
  brokers: ["192.168.56.165:9092"],
});

const consumer = kafka.consumer({
  groupId: "booking-service-group",
});

const consumeMessage = async () => {
  await consumer.connect();
  logger.info("booking service consumer connected");

  await consumer.subscribe({ topic: "reduced-seats", fromBeginning: true });
  logger.info("booking service consumer subscribed to topic");

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const data = JSON.parse(message.value.toString());
      logger.info("booking service consumer received message ", data);

      if (topic === "reduced-seats") {
        logger.info(
          "booking service consumer received message for topic: reduced-seats"
        );
        await bookingService.updateBookingStatus(data.bookingId, "CONFIRMED");
        logger.info("booking service consumer updated booking status");
      }
    },
  });
};

consumeMessage();
