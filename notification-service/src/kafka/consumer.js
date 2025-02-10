import { Kafka } from "kafkajs";
import { produceMessage } from "./producer.js";
import notificationService from "../service/notification.service.js";

const kafka = new Kafka({
  clientId: "notification-service",
  brokers: ["192.168.56.165:9092"], // Update with your Kafka broker(s)
});

const consumer = kafka.consumer({ groupId: "notification-group" });

const dataStore = new Map(); // Stores { orderId: { order, user, event } }

const consumeMessages = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "booking-confirmed", fromBeginning: true });
  await consumer.subscribe({ topic: "user-details", fromBeginning: true });
  await consumer.subscribe({ topic: "event-details", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const data = JSON.parse(message.value.toString());
      console.log(`Received message on ${topic}:`, data);

      if (topic === "booking-confirmed") {
        console.log("-----------------Received order-confirmed message:", data);

        // Store initial order data
        dataStore.set(data.id, { order: data, user: null, event: null });

        // Request user & event details
        console.log({
          orderId: data.id,
          userId: data.userId,
          eventId: data.eventId,
        });
        await produceMessage("get-user-details", {
          orderId: data.id,
          userId: data.userId,
        });
        await produceMessage("get-event-details", {
          orderId: data.id,
          eventId: data.eventId,
        });
      } else if (topic === "user-details") {
        console.log("-----------------Received user-details message:", data);
        const { orderId, userId, name, email } = data;
        if (dataStore.has(orderId)) {
          dataStore.get(orderId).user = { userId, name, email };
          triggerNotificationIfComplete(orderId);
        }
      } else if (topic === "event-details") {
        console.log("-----------------Received event-details message:", data);

        const { orderId, eventId, location, image, title } = data;
        if (dataStore.has(orderId)) {
          dataStore.get(orderId).event = { eventId, location, image, title };
          triggerNotificationIfComplete(orderId);
        }
      }
    },
  });
};

const triggerNotificationIfComplete = async (orderId) => {
  const orderData = dataStore.get(orderId);
  if (orderData?.user && orderData?.event) {
    const eventOrderData = {
      bookingId: orderData.order.orderId,
      userId: orderData.user.userId,
      eventId: orderData.event.eventId,
      quantity: orderData.order.quantity,
      price: orderData.order.price,
      totalAmount: orderData.order.totalAmount,
      status: orderData.order.status,
      name: orderData.user.name,
      email: orderData.user.email,
      location: orderData.event.location,
      image: orderData.event.image,
      title: orderData.event.title,
    };
    console.log(
      "✅ All data received, sending email notification:",
      eventOrderData
    );

    await notificationService.sendEmailToUser(eventOrderData);

    // Remove from store after processing
    dataStore.delete(orderId);
  }
};

export { consumeMessages };
