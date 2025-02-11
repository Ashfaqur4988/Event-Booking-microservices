import { Kafka, logLevel } from "kafkajs";
import logger from "../config/logger.js";

const kafka = new Kafka({
  clientId: "booking service",
  brokers: ["192.168.56.165:9092"],
  logLevel: logLevel.INFO,
  retry: {
    initialRetryTime: 300,
    retries: 5,
  },
});

const producer = kafka.producer();

const produceMessage = async (topic, message) => {
  logger.info("booking service producer");
  await producer.connect();
  logger.info("booking service producer connected");

  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
  logger.info("booking service producer after sending message");

  await producer.disconnect();

  logger.info("booking service producer disconnected");
};

export { produceMessage };
