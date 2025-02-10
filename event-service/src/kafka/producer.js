import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "booking service",
  brokers: ["192.168.56.165:9092"],
});

const producer = kafka.producer();

const produceMessage = async (topic, message) => {
  console.log("event service producer");
  await producer.connect();
  console.log("event service producer connected");
  console.log("event service producer before sending message");

  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
  console.log("---------event service producer after sending message");

  await producer.disconnect();

  console.log("event service producer disconnected");
};

export { produceMessage };
