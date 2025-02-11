import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import userRepository from "../repository/auth.repository.js";
import { AppError } from "../middleware/errorHandler.js";
import { config } from "../config/index.js";
import logger from "../config/logger.js";

class AuthService {
  async signup(email, password, name) {
    if (!email || !password || !name) {
      logger.error("Sign up service:Credentials missing");
      throw new AppError(StatusCodes.BAD_REQUEST, "Credentials missing");
    }
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      logger.error("Sign up service: User already exists");
      throw new AppError(StatusCodes.BAD_REQUEST, "User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    return userRepository.createUser({ email, password: hashedPassword, name });
  }

  async login(email, password) {
    if (!email || !password) {
      logger.error("Login service: Missing credentials");
      throw new AppError(StatusCodes.BAD_REQUEST, "Missing credentials");
    }
    const user = await userRepository.findByEmail(email);
    if (!user) {
      logger.error("Login service: Invalid credentials");
      throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.error("Login service: Invalid credentials");
      throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
    }

    return user;
  }

  async getUser(userId) {
    logger.info("auth service - Finding user by id");
    return await userRepository.findById(userId);
  }

  async getUserById(userId) {
    logger.info("auth service - Getting user by id");
    return await userRepository.getUserById(userId);
  }

  async logout() {
    logger.info("auth service - Logging out");
  }

  async generateToken(user) {
    logger.info("auth service - Generating token");
    const access_token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      config.jwtSecret,
      {
        expiresIn: config.cookieOptions.accessToken.maxAge,
      }
    );

    const refresh_token = jwt.sign({ id: user.id }, config.jwtSecret, {
      expiresIn: config.cookieOptions.refreshToken.maxAge,
    });

    return { access_token, refresh_token };
  }
}

export default new AuthService();
