var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { mockStartGame } from "@/model/interface";
import prisma from "@/utils/prisma";
import { calculateStats, responseHandler } from "@/utils/utils";
export const getGames = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const games = yield prisma.game.findMany();
        responseHandler(res, true, "Successful", { games });
    }
    catch (e) {
        responseHandler(res, false, "", undefined, e);
    }
});
export const startGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const game = yield prisma.game.findFirst({
            where: { id: req.body.id },
            include: { GameQuestion: { include: { question: true } } },
        });
        const user = yield prisma.player.findFirst({
            where: { id: (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.id },
        });
        if (!game)
            responseHandler(res, false, "Game ID not found");
        else if (!user)
            responseHandler(res, false, "User ID not found");
        else {
            const attempt = yield prisma.attempt.create({
                data: {
                    gameId: game.id,
                    playerId: user.id,
                },
            });
            const attemptDetails = yield prisma.attemptDetails.create({
                data: {
                    attemptId: attempt.id,
                    StartTime: new Date(),
                },
            });
            const stats = yield calculateStats(user.id, attempt.id);
            const nextQuestion = yield mockStartGame(attempt.id, game.giveQuestions, game.GameQuestion.map((q) => q.question), user.education, stats);
            responseHandler(res, true, "Successful", {
                attempt,
                attemptDetails,
                nextQuestion,
            });
        }
    }
    catch (e) {
        responseHandler(res, false, "", undefined, e);
    }
});
export const nextQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const attempt = yield prisma.attempt.findFirst({
            where: { id: req.body.id },
            include: {
                game: { include: { GameQuestion: { include: { question: true } } } },
            },
        });
        const user = yield prisma.player.findFirst({
            where: { id: (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.id },
        });
        if (!attempt)
            responseHandler(res, false, "Attempt ID not found");
        else if (!user)
            responseHandler(res, false, "User ID not found");
        else {
        }
    }
    catch (e) {
        responseHandler(res, false, "", undefined, e);
    }
});
//# sourceMappingURL=game.js.map