import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import passport from "passport";
import prisma from "@/utils/prisma";
import * as constants from "@/utils/constants";
import { Admins, Player } from "@prisma/client";

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: constants.env.jwtSecret,
};

passport.use(
  constants.passport.admin,
  new Strategy(opts, async (payload: any, done: VerifiedCallback) => {
    try {
      const user = await prisma.admins.findFirst({
        where: { id: parseInt(payload.sub) },
      });
      if (user)
        return done(null, { type: constants.passport.admin, data: user });
      return done(null, false);
    } catch (error) {
      return done(error);
    }
  })
);

passport.use(
  constants.passport.player,
  new Strategy(opts, async (payload: any, done: VerifiedCallback) => {
    try {
      const user = await prisma.player.findFirst({
        where: { id: parseInt(payload.sub) },
      });
      if (user)
        return done(null, { type: constants.passport.player, data: user });
      return done(null, false);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user: any, done) => {
  done(null, { type: user.type, id: user.data.id });
});

interface UserPayload {
  type: string;
  data: any;
}

interface SerializedUser {
  type: string;
  id: number;
}

passport.deserializeUser(
  async (
    serialized: SerializedUser,
    done: (err: any, user?: UserPayload | false) => void
  ) => {
    try {
      if (serialized.type === constants.passport.admin) {
        const user = await prisma.admins.findFirst({
          where: { id: parseInt(String(serialized.id)) },
        });
        if (user)
          return done(null, { type: constants.passport.admin, data: user });
      } else if (serialized.type === constants.passport.player) {
        const user = await prisma.player.findFirst({
          where: { id: parseInt(String(serialized.id)) },
        });
        if (user)
          return done(null, { type: constants.passport.player, data: user });
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  }
);
