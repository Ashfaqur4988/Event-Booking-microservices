import { Kafka } from "kafkajs";
import bookingService from "../service/booking.service.js";

const kafka = new Kafka({
  clientId: "booking service",
  brokers: ["192.168.56.165:9092"],
});

const consumer = kafka.consumer({
  groupId: "booking-service-group",
});

const consumeMessage = async () => {
  await consumer.connect();
  console.log("booking service consumer connected");

  await consumer.subscribe({ topic: "reduced-seats", fromBeginning: true });
  console.log("booking service consumer subscribed to topic");

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const data = JSON.parse(message.value.toString());
      console.log(
        "-----------booking service consumer received message ",
        data
      );

      if (topic === "reduced-seats") {
        await bookingService.updateBookingStatus(data.bookingId, "CONFIRMED");
        console.log("-------booking service consumer updated booking status");
      }
    },
  });
};

export { consumeMessage };
