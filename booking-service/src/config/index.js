import dotenv from "dotenv";

dotenv.config();

const config = {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL,
  EVENT_SERVICE_URL: process.env.EVENT_SERVICE_URL,
};

export default config;
