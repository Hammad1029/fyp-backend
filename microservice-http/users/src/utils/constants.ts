export const env = {
  jwtSecret: process.env.JWT_SECRET || "oooo",
  port: process.env.PORT || 3002,
};

export const defaultPassword = process.env.DEFAULT_PASSWORD || "hello123";
export const bcryptRounds = 10;

export const services = {
  institutions: process.env.INSTITUTION_SERVICE,
  users: process.env.USER_SERVICE,
  games: process.env.GAME_SERVICE,
  attempts: process.env.ATTEMPT_SERVICE,
};

export const nodemailer = {
  email: process.env.NODEMAILER_EMAIL,
  password: process.env.NODEMAILER_PASSWORD,
}