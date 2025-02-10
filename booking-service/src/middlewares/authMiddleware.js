import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { AppError } from "./errorHandler.js";
import axios from "axios";
import config from "../config/index.js";

const authMiddleware = {
  protect: async (req, res, next) => {
    try {
      let access_token;
      if (req.cookies.access_token) {
        access_token = req.cookies.access_token;
      }

      if (!access_token) {
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

      next();
    } catch (error) {
      if (error) {
        next(error);
      }
    }
  },
};

export default authMiddleware;
