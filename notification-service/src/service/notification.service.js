import logger from "../config/logger.js";
import transport from "../config/nodemailer.js";

class NotificationService {
  async sendEmailToUser(eventOrderData) {
    logger.info("Notification service - Sending email to user");
    try {
      const {
        bookingId,
        quantity,
        price,
        totalAmount,
        status,
        name,
        email,
        location,
        image,
        title,
      } = eventOrderData;

      const htmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Booking Confirmation</title>
    <style>
      body {
        font-family: sans-serif;
        line-height: 1.6;
        color: #333;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        border: 1px solid #ddd;
        background-color: #f9f9f9;
      }
      .header {
        text-align: center;
        margin-bottom: 20px;
      }
      .ticket {
        border: 1px dashed #ccc;
        padding: 20px;
        margin-bottom: 20px;
      }
      .invoice {
        border: 1px solid #ddd;
        padding: 20px;
      }
      .details {
        margin-bottom: 10px;
      }
      .image-container {
        text-align: center; /* Center the image */
        margin-bottom: 20px;
      }

      .image-container img {
        max-width: 100%; /* Make image responsive */
        height: auto;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Booking Confirmed!</h1>
      </div>

      <div class="image-container">
        <img src="${image}" alt="${title} Poster" />
      </div>

      <div class="ticket">
        <h2>Event Ticket</h2>
        <div class="details"><strong>Event:</strong> ${title}</div>
        <div class="details"><strong>Booking ID:</strong> ${bookingId}</div>
        <div class="details"><strong>Quantity:</strong> ${quantity}</div>
        <div class="details"><strong>Location:</strong> ${location}</div>
      </div>

      <div class="invoice">
        <h2>Invoice</h2>
        <div class="details"><strong>Booking ID:</strong> ${bookingId}</div>
        <div class="details"><strong>Name:</strong> ${name}</div>
        <div class="details"><strong>Email:</strong> ${email}</div>
        <div class="details"><strong>Quantity:</strong> ${quantity}</div>
        <div class="details"><strong>Price per ticket:</strong> ₹${price}</div>
        <div class="details">
          <strong>Total Amount:</strong> ₹${totalAmount}
        </div>
        <div class="details"><strong>Status:</strong> ${status}</div>
      </div>

      <div class="footer">
        <p>Thank you for your booking!</p>
      </div>
    </div>
  </body>
</html>
`;

      const info = await transport.sendMail({
        from: "bookevent39@gmail.com",
        to: email,
        subject: `Hi ${name}, Your booking for ${title} has been confirmed!`,
        html: htmlContent,
      });

      logger.info("Notification service - Email sent to user");
      logger.info("Message sent:", info.messageId);
    } catch (error) {
      logger.error("Notification service - Error while sending email");
      logger.error(error);
    }
  }
}

export default new NotificationService();
