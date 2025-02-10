import express from "express";
import eventController from "../controller/event.controller.js";

const router = express.Router();

router
  .get("/", eventController.getAllEvents)
  .get("/:id", eventController.getEventsById)
  .get("/category/:category", eventController.getEventsByCategory)
  .post("/", eventController.createEvent)
  .put("/:id", eventController.updateEvent);

export default router;
