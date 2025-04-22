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
export const responseHandler = (res, status, message, data, error) => {
    if (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
    else {
        res.status(200).json({ status, message, data });
    }
};
export const createRandomString = (length) => {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
};
export const calculateStats = (playerId, excludeAttempt) => __awaiter(void 0, void 0, void 0, function* () {
    const sums = yield prisma.attemptDetails.aggregate({
        where: {
            attempt: { playerId },
            attemptId: { not: excludeAttempt },
        },
        _sum: {
            easyTotal: true,
            easyCorrect: true,
            midTotal: true,
            midCorrect: true,
            mediumTotal: true,
            mediumCorrect: true,
            hardTotal: true,
            hardCorrect: true,
            advancedTotal: true,
            advancedCorrect: true,
            exceptionalTotal: true,
            exceptionalCorrect: true,
            textualTotal: true,
            textualCorrect: true,
            imageTotal: true,
            imageCorrect: true,
            auditoryTotal: true,
            auditoryCorrect: true,
        },
    });
    const pct = (correct, total) => (total || 0) > 0 ? (correct || 0) / (total || 0) : 0;
    return {
        easyPerc: pct(sums._sum.easyCorrect, sums._sum.easyTotal),
        midPerc: pct(sums._sum.midCorrect, sums._sum.midTotal),
        mediumPerc: pct(sums._sum.mediumCorrect, sums._sum.mediumTotal),
        hardPerc: pct(sums._sum.hardCorrect, sums._sum.hardTotal),
        advancedPerc: pct(sums._sum.advancedCorrect, sums._sum.advancedTotal),
        exceptionalPerc: pct(sums._sum.exceptionalCorrect, sums._sum.exceptionalTotal),
        textualPerc: pct(sums._sum.textualCorrect, sums._sum.textualTotal),
        imagePerc: pct(sums._sum.imageCorrect, sums._sum.imageTotal),
        auditoryPerc: pct(sums._sum.auditoryCorrect, sums._sum.auditoryTotal),
    };
});
//# sourceMappingURL=utils.js.map