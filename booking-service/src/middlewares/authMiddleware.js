import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { AppError } from "./errorHandler.js";
import axios from "axios";
import config from "../config/index.js";
import logger from "../config/logger.js";

const authMiddleware = {
  protect: async (req, res, next) => {
    try {
      logger.info("auth middleware - Protect route");
      let access_token;
      if (req.cookies.access_token) {
        access_token = req.cookies.access_token;
      }

      if (!access_token) {
        logger.error("auth middleware - No access token found");
        return next(
          new AppError(StatusCodes.UNAUTHORIZED, "You are not logged in!")
        );
      }

      const decode = jwt.decode(access_token, config.jwtSecret);

      req.user = {
        id: decode.id,
        email: decode.email,
        name: decode.name,
      };

      logger.info("auth middleware - Access token verified");

      next();
    } catch (error) {
      if (error) {
        next(error);
      }
    }
  },
};

export default authMiddleware;
