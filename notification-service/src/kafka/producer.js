import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "notification service",
  brokers: ["192.168.56.165:9092"],
});

const producer = kafka.producer();

const produceMessage = async (topic, message) => {
  console.log("notification service producer");
  await producer.connect();
  console.log("notification service producer connected");
  console.log("notification service producer before sending message");

  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
  console.log("notification service producer after sending message");

  await producer.disconnect();

  console.log("notification service producer disconnected");
};

export { produceMessage };
