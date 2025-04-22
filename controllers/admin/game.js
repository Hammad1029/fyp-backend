var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import prisma from "@/utils/prisma";
import { responseHandler } from "@/utils/utils";
export const getGames = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const games = yield prisma.game.findMany({
            include: { GameQuestion: true, institution: true, Attempt: true },
        });
        responseHandler(res, true, "Successful", games);
    }
    catch (e) {
        responseHandler(res, false, "", undefined, e);
    }
});
export const createGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.game.create({
            data: {
                name: req.body.name,
                institutionId: req.body.institutionId,
                tags: req.body.tags,
                time: req.body.time,
                giveQuestions: req.body.giveQuestions,
                GameQuestion: {
                    create: req.body.questions.map((q) => ({
                        questionId: q,
                    })),
                },
            },
        });
        responseHandler(res, true, "Successful");
    }
    catch (e) {
        responseHandler(res, false, "", undefined, e);
    }
});
export const updateGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const game = yield prisma.game.findFirst({
            where: {
                id: req.body.game_id,
            },
        });
        if (!game)
            return responseHandler(res, false, "game not found");
        yield prisma.gameQuestion.deleteMany({
            where: { gameId: game.id },
        });
        yield prisma.game.create({
            data: {
                name: req.body.name || game.name,
                institutionId: req.body.institutionId || game.institutionId,
                tags: req.body.tags || game.tags,
                time: req.body.time || game.time,
                giveQuestions: req.body.giveQuestions || game.giveQuestions,
                GameQuestion: {
                    create: req.body.questions.map((q) => ({
                        questionId: q,
                    })),
                },
            },
        });
        responseHandler(res, true, "Successful");
    }
    catch (e) {
        responseHandler(res, false, "", undefined, e);
    }
});
export const deleteGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const game = yield prisma.question.findFirst({
            where: {
                id: req.body.game_id,
            },
        });
        if (!game)
            return responseHandler(res, false, "game not found");
        yield prisma.game.deleteMany({
            where: { id: game.id },
        });
        responseHandler(res, true, "Successful");
    }
    catch (e) {
        responseHandler(res, false, "", undefined, e);
    }
});
//# sourceMappingURL=game.js.map