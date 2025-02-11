import { Kafka } from "kafkajs";
import { produceMessage } from "./producer.js";
import notificationService from "../service/notification.service.js";
import logger from "../config/logger.js";

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
      logger.info("Notification service consumer received message.");

      if (topic === "booking-confirmed") {
        logger.info("Notification service consumer received message.");

        // Store initial order data
        dataStore.set(data.id, { order: data, user: null, event: null });

        // Request user & event details
        logger.info("Requesting user & event details");

        await produceMessage("get-user-details", {
          orderId: data.id,
          userId: data.userId,
        });
        await produceMessage("get-event-details", {
          orderId: data.id,
          eventId: data.eventId,
        });
      } else if (topic === "user-details") {
        logger.info(
          "Notification service consumer received user-details message."
        );
        const { orderId, userId, name, email } = data;
        if (dataStore.has(orderId)) {
          dataStore.get(orderId).user = { userId, name, email };
          triggerNotificationIfComplete(orderId);
        }
      } else if (topic === "event-details") {
        logger.info(
          "Notification service consumer received event-details message."
        );

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
    logger.info("All details received, sending email notification.");

    await notificationService.sendEmailToUser(eventOrderData);

    // Remove from store after processing
    dataStore.delete(orderId);
  }
};

consumeMessages();
