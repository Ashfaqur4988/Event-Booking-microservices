import dotenv from "dotenv";

dotenv.config();

const config = {
  PORT: process.env.PORT,
  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL,
  EVENT_SERVICE_URL: process.env.EVENT_SERVICE_URL,
  BOOKING_SERVICE_URL: process.env.BOOKING_SERVICE_URL,
  KAFKA_BROKER_URL: process.env.KAFKA_BROKER_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
};

export default config;
