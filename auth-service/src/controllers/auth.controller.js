import { StatusCodes } from "http-status-codes";
import authService from "../service/auth.service.js";
import { config } from "../config/index.js";
import logger from "../config/logger.js";

const authController = {
  signup: async (req, res, next) => {
    try {
      const { email, password, name } = req.body;
      logger.info(
        `Signup controller, user details: email: ${email}, name: ${name}`
      );
      const user = await authService.signup(email, password, name);
      const { access_token, refresh_token } = await authService.generateToken(
        user
      );
      res
        .cookie("access_token", access_token, config.cookieOptions)
        .status(StatusCodes.CREATED)
        .json({ id: user.id, email: user.email, name: user.name });
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      logger.info(`Login controller`);
      const { email, password } = req.body;
      const user = await authService.login(email, password);
      const { access_token, refresh_token } = await authService.generateToken(
        user
      );
      logger.info(`Login controller, login successful`);
      res
        .cookie("access_token", access_token, config.cookieOptions)
        .status(StatusCodes.OK)
        .json({ id: user.id, email: user.email, name: user.name });
    } catch (error) {
      next(error);
    }
  },

  getUser: async (req, res, next) => {
    try {
      logger.info(`Get user controller`);
      const user = await authService.getUser(req.user.id);
      res
        .status(StatusCodes.OK)
        .json({ id: user.id, email: user.email, name: user.name });
    } catch (error) {
      next(error);
    }
  },

  logout: async (req, res, next) => {
    try {
      // const access_token = req.cookies.access_token;
      logger.info(`Logout controller`);
      res
        .clearCookie("access_token")
        .status(StatusCodes.OK)
        .json({ message: "Logout successful" });
    } catch (error) {
      next(error);
    }
  },
};

export default authController;
