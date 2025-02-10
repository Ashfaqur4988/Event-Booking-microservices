import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "auth service",
  brokers: ["192.168.56.165:9092"],
});

const producer = kafka.producer();

const produceMessage = async (topic, message) => {
  console.log("auth service producer");
  await producer.connect();
  console.log("auth service producer connected");
  console.log("auth service producer before sending message");

  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
  console.log("----------------auth service producer after sending message");

  await producer.disconnect();

  console.log("auth service producer disconnected");
};

export { produceMessage };
