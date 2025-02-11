import { Kafka, logLevel } from "kafkajs";
import logger from "../config/logger.js";

const kafka = new Kafka({
  clientId: "auth service",
  brokers: ["192.168.56.165:9092"],
  logLevel: logLevel.INFO,
  retry: {
    initialRetryTime: 300,
    retries: 5,
  },
});

const producer = kafka.producer();

const produceMessage = async (topic, message) => {
  await producer.connect();
  logger.info("auth service producer connected");
  logger.info(`Producing message to topic: ${topic}`);

  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
  logger.info("auth service producer message successfully sent");

  await producer.disconnect();
  logger.info("auth service producer disconnected");
};

export { produceMessage };
