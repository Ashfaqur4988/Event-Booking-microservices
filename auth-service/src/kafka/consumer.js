import { Kafka } from "kafkajs";
import authService from "../service/auth.service.js";
import { produceMessage } from "./producer.js";

const kafka = new Kafka({
  clientId: "auth-service",
  brokers: ["192.168.56.165:9092"],
});

const consumer = kafka.consumer({ groupId: "auth-group" });

const consumeMessages = async () => {
  await consumer.connect();
  console.log("Auth service consumer connected.");
  await consumer.subscribe({ topic: "get-user-details", fromBeginning: true });
  console.log("Auth service consumer subscribed to topic.");

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const data = JSON.parse(message.value.toString());
      console.log(`---------------Received message, data :`, data);

      if (topic === "get-user-details") {
        const userData = await authService.getUserById(data.userId);

        await produceMessage("user-details", {
          orderId: data.orderId,
          userId: data.userId,
          name: userData.name,
          email: userData.email,
        });
      }
    },
  });
};

export { consumeMessages };
