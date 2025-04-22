export const passport = {
    admin: "admin-jwt",
    player: "player-jwt",
};
export const env = {
    jwtSecret: process.env.JWT_SECRET || "oooo",
    sessionSecret: process.env.SESSION_SECRET || "oooo",
    port: process.env.PORT || 3001
};
export const defaultPassword = process.env.DEFAULT_PASSWORD || "hello123";
export const bcryptRounds = 10;
//# sourceMappingURL=constants.js.map