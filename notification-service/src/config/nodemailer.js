import nodemailer from "nodemailer";
import config from "../config/index.js";

const transport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "bookevent39@gmail.com",
    pass: config.MAIL_PASSWORD,
  },
});

export default transport;
