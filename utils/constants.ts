export const passport = {
  admin: "admin-jwt",
  player: "player-jwt",
};

export const env = {
  jwtSecret: process.env.JWT_SECRET || "oooo",
  sessionSecret: process.env.SESSION_SECRET || "oooo",
  port: process.env.PORT || 3000
};

export const defaultPassword = "hello123"
export const bcryptRounds = 10
