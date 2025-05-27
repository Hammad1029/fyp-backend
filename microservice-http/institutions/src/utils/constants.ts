export const env = {
  jwtSecret: process.env.JWT_SECRET || "oooo",
  port: process.env.PORT || 3001,
};

export const services = {
  institutions: process.env.INSTITUTION_SERVICE,
  users: process.env.USER_SERVICE,
  games: process.env.GAME_SERVICE,
  attempts: process.env.ATTEMPT_SERVICE,
};
