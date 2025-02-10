import dotenv from "dotenv";

dotenv.config();

export const config = {
  jwtSecret: process.env.JWT_SECRET,
  // ... other config
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "none", // Prevent CSRF attacks
    // For access token (shorter duration)
    accessToken: {
      maxAge: 60 * 60 * 1000, // 15 minutes
    },
    // For refresh token (longer duration)
    refreshToken: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  },
};
