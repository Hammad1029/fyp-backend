var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ExtractJwt, Strategy } from "passport-jwt";
import passport from "passport";
import prisma from "@/utils/prisma";
import * as constants from "@/utils/constants";
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: constants.env.jwtSecret,
};
passport.use(constants.passport.admin, new Strategy(opts, (payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.admins.findFirst({
            where: { id: parseInt(payload.sub) },
        });
        if (user)
            return done(null, { type: constants.passport.admin, data: user });
        return done(null, false);
    }
    catch (error) {
        return done(error);
    }
})));
passport.use(constants.passport.player, new Strategy(opts, (payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.player.findFirst({
            where: { id: payload.sub },
        });
        if (user)
            return done(null, { type: constants.passport.player, data: user });
        return done(null, false);
    }
    catch (error) {
        return done(error);
    }
})));
passport.serializeUser((user, done) => {
    done(null, { type: user.type, id: user.data.id });
});
//# sourceMappingURL=passport.js.map