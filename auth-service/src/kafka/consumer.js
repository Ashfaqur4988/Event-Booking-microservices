import { Kafka, logLevel } from "kafkajs";
import authService from "../service/auth.service.js";
import { produceMessage } from "./producer.js";
import logger from "../config/logger.js";

const kafka = new Kafka({
  clientId: "auth-service",
  brokers: ["192.168.56.165:9092"],
  logLevel: logLevel.INFO,
});

const consumer = kafka.consumer({ groupId: "auth-group" });

const consumeMessages = async () => {
  await consumer.connect();
  logger.info("Auth service consumer connected.");

  await consumer.subscribe({ topic: "get-user-details", fromBeginning: true });
  logger.info("Auth service consumer subscribed to topic.");

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      try {
        const data = JSON.parse(message.value.toString());
        logger.info("Auth service consumer received message.");

        if (topic === "get-user-details") {
          logger.info(
            "Auth service consumer received message for topic get-user-details."
          );
          const userData = await authService.getUserById(data.userId);

          await produceMessage("user-details", {
            orderId: data.orderId,
            userId: data.userId,
            name: userData.name,
            email: userData.email,
          });
        }
      } catch (error) {
        logger.info(`Error in auth service consumer: ${error}`);
      }
    },
  });
};

consumeMessages();
