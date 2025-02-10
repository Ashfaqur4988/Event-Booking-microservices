import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { AppError } from "./errorHandler.js";
import userRepository from "../repository/auth.repository.js";
import { config } from "../config/index.js";

const authMiddleware = {
  protect: async (req, res, next) => {
    try {
      console.log(req.cookies.access_token);
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
      const currentUser = await userRepository.findById(decode.id);

      if (!currentUser) {
        return next(new AppError(StatusCodes.UNAUTHORIZED, "User not found!"));
      }

      req.user = {
        id: currentUser.id,
        email: currentUser.email,
        name: currentUser.name,
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
