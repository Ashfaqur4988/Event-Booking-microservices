import { Kafka } from "kafkajs";
import eventRepository from "../repository/event.repository.js";
import { produceMessage } from "./producer.js"; // Make sure producer.js has proper error handling

const kafka = new Kafka({
  clientId: "booking-service", // More descriptive client ID
  brokers: ["192.168.56.165:9092"], // Use environment variable
});

const consumer = kafka.consumer({ groupId: "event-service-group" });

const consumeMessage = async () => {
  try {
    console.log("Event service consumer connecting...");
    await consumer.connect();
    console.log("Event service consumer connected.");

    await consumer.subscribe({ topic: "order-created", fromBeginning: true });
    console.log("Event service consumer subscribed to topic.");

    await consumer.subscribe({
      topic: "get-event-details",
      fromBeginning: true,
    });
    console.log(
      "--------Event service consumer subscribed to get user detail topic. "
    );

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const data = JSON.parse(message.value.toString());
          console.log("--------Received message:", data);

          if (topic === "order-created") {
            console.log("Decreasing seats...");
            await eventRepository.decreaseSeats(data.eventId, data.seats);
            console.log("Seats decreased.");

            await produceMessage("reduced-seats", {
              bookingId: data.bookingId,
              eventId: data.eventId,
              userId: data.userId,
            });
            console.log("Produced reduced-seats message.");
          }

          if (topic === "get-event-details") {
            console.log("Getting event details...");
            const eventData = await eventRepository.getEventById(data.eventId);

            await produceMessage("event-details", {
              orderId: data.orderId,
              eventId: data.eventId,
              location: eventData.location,
              image: eventData.image,
              title: eventData.title,
            });
          }
        } catch (innerError) {
          console.log("Error processing message:", innerError);
          // Important: Decide on a strategy here:
          // 1. Retry the message (with backoff)
          // 2. Dead-letter queue (DLQ) - Produce the message to a separate "dead-letter" topic for later analysis.
          // 3. Skip the message (least recommended)
        }
      },
    });
  } catch (error) {
    console.error("Error connecting or running consumer:", error);
  }
};

export { consumeMessage };
