import { createLogger, transports, format } from "winston";

const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} ${label} [${level}]: ${message}`;
});

const logger = () => {
  return createLogger({
    level: "info",
    format: combine(
      label({ label: "prod" }),
      timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      myFormat
    ),
    transports: [
      new transports.File({ filename: "src/logs/error.log", level: "error" }),
      new transports.File({ filename: "src/logs/combined.log" }),
      new transports.Console(),
    ],
  });
};

export default logger();
