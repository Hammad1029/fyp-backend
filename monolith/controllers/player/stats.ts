import { responseHandler } from "@/utils/utils";
import { PrismaClient } from "@prisma/client";
import { Request, RequestHandler, Response } from "express";

const prisma = new PrismaClient();

interface OverviewStats {
  totalGames: number;
  totalScore: number;
  accuracy: number;
  averageSessionDuration: number;
  overallPerformanceRating: number;
}

interface SkillLevels {
  auditory: {
    level: number;
    experiencePoints: number;
    progressToNext: number;
  };
  visual: {
    level: number;
    experiencePoints: number;
    progressToNext: number;
  };
  textual: {
    level: number;
    experiencePoints: number;
    progressToNext: number;
  };
}

interface CategoryPerformance {
  difficulty: {
    easy: { averageScore: number; accuracy: number; timeTaken: number };
    medium: { averageScore: number; accuracy: number; timeTaken: number };
    hard: { averageScore: number; accuracy: number; timeTaken: number };
    advanced: { averageScore: number; accuracy: number; timeTaken: number };
    exceptional: { averageScore: number; accuracy: number; timeTaken: number };
  };
  questionType: {
    textual: { averageScore: number; accuracy: number; timeTaken: number };
    image: { averageScore: number; accuracy: number; timeTaken: number };
    auditory: { averageScore: number; accuracy: number; timeTaken: number };
  };
}

interface ProgressionStats {
  timeframe: "daily" | "weekly" | "monthly";
  improvementTrend: number;
  activityFrequency: number;
  performanceDeltas: {
    accuracy: number;
    speed: number;
    consistency: number;
  };
}

interface RecentActivity {
  activities: {
    id: number;
    type: "game_played" | "achievement_earned";
    description: string;
    timestamp: Date;
    gameId?: number;
    score?: number;
  }[];
}

export const getOverviewStats: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const playerId = req.user?.data?.id;

    const attempts = await prisma.attempt.findMany({
      where: { playerId },
      include: {
        AttemptDetails: true,
      },
    });

    if (attempts.length === 0)
      return responseHandler(res, true, "Successful", {
        totalGames: 0,
        totalScore: 0,
        accuracy: 0,
        averageSessionDuration: 0,
        overallPerformanceRating: 0,
      });

    const totalGames = attempts.length;

    let totalCorrect = 0;
    let totalQuestions = 0;
    let totalDuration = 0;

    attempts.forEach((attempt) => {
      totalDuration += attempt.timeTaken;

      attempt.AttemptDetails.forEach((detail) => {
        totalCorrect +=
          detail.easyCorrect +
          detail.midCorrect +
          detail.mediumCorrect +
          detail.hardCorrect +
          detail.advancedCorrect +
          detail.exceptionalCorrect +
          detail.textualCorrect +
          detail.imageCorrect +
          detail.auditoryCorrect;

        totalQuestions +=
          detail.easyTotal +
          detail.midTotal +
          detail.mediumTotal +
          detail.hardTotal +
          detail.advancedTotal +
          detail.exceptionalTotal +
          detail.textualTotal +
          detail.imageTotal +
          detail.auditoryTotal;
      });
    });

    const accuracy =
      totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
    const averageSessionDuration = totalDuration / totalGames;
    const overallPerformanceRating = Math.min(
      100,
      accuracy * 0.7 + (averageSessionDuration > 0 ? 30 : 0)
    );

    const stats: OverviewStats = {
      totalGames,
      totalScore: totalCorrect,
      accuracy: Math.round(accuracy * 100) / 100,
      averageSessionDuration: Math.round(averageSessionDuration),
      overallPerformanceRating:
        Math.round(overallPerformanceRating * 100) / 100,
    };

    responseHandler(res, true, "Successful", stats);
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

export const getSkillLevels = async (req: Request, res: Response) => {
  try {
    const playerId = req.user?.data?.id;

    const attempts = await prisma.attempt.findMany({
      where: { playerId },
      include: {
        AttemptDetails: true,
      },
    });

    let auditoryCorrect = 0,
      auditoryTotal = 0;
    let imageCorrect = 0,
      imageTotal = 0;
    let textualCorrect = 0,
      textualTotal = 0;

    attempts.forEach((attempt) => {
      attempt.AttemptDetails.forEach((detail) => {
        auditoryCorrect += detail.auditoryCorrect;
        auditoryTotal += detail.auditoryTotal;
        imageCorrect += detail.imageCorrect;
        imageTotal += detail.imageTotal;
        textualCorrect += detail.textualCorrect;
        textualTotal += detail.textualTotal;
      });
    });

    const calculateLevel = (correct: number, total: number) => {
      const accuracy = total > 0 ? (correct / total) * 100 : 0;
      const level = Math.floor(accuracy / 10) + 1;
      const experiencePoints = correct;
      const progressToNext = Math.max(
        0,
        Math.ceil(total * 0.1 * (level + 1)) - correct
      );

      return {
        level: Math.min(10, level),
        experiencePoints,
        progressToNext,
      };
    };

    const skillLevels: SkillLevels = {
      auditory: calculateLevel(auditoryCorrect, auditoryTotal),
      visual: calculateLevel(imageCorrect, imageTotal),
      textual: calculateLevel(textualCorrect, textualTotal),
    };

    responseHandler(res, true, "Successful", skillLevels);
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

export const getCategoryPerformance = async (req: Request, res: Response) => {
  try {
    const playerId = req.user?.data?.id;

    const attempts = await prisma.attempt.findMany({
      where: { playerId },
      include: {
        AttemptDetails: true,
      },
    });

    const calculateCategoryStats = (
      correct: number,
      total: number,
      totalTime: number
    ) => ({
      averageScore:
        total > 0 ? Math.round((correct / total) * 100 * 100) / 100 : 0,
      accuracy: total > 0 ? Math.round((correct / total) * 100 * 100) / 100 : 0,
      timeTaken: Math.round(totalTime / Math.max(1, attempts.length)),
    });

    const stats = {
      easy: { correct: 0, total: 0 },
      medium: { correct: 0, total: 0 },
      hard: { correct: 0, total: 0 },
      advanced: { correct: 0, total: 0 },
      exceptional: { correct: 0, total: 0 },
      textual: { correct: 0, total: 0 },
      image: { correct: 0, total: 0 },
      auditory: { correct: 0, total: 0 },
    };

    let totalTime = 0;

    attempts.forEach((attempt) => {
      totalTime += attempt.timeTaken;

      attempt.AttemptDetails.forEach((detail) => {
        stats.easy.correct += detail.easyCorrect;
        stats.easy.total += detail.easyTotal;
        stats.medium.correct += detail.mediumCorrect;
        stats.medium.total += detail.mediumTotal;
        stats.hard.correct += detail.hardCorrect;
        stats.hard.total += detail.hardTotal;
        stats.advanced.correct += detail.advancedCorrect;
        stats.advanced.total += detail.advancedTotal;
        stats.exceptional.correct += detail.exceptionalCorrect;
        stats.exceptional.total += detail.exceptionalTotal;
        stats.textual.correct += detail.textualCorrect;
        stats.textual.total += detail.textualTotal;
        stats.image.correct += detail.imageCorrect;
        stats.image.total += detail.imageTotal;
        stats.auditory.correct += detail.auditoryCorrect;
        stats.auditory.total += detail.auditoryTotal;
      });
    });

    const categoryPerformance: CategoryPerformance = {
      difficulty: {
        easy: calculateCategoryStats(
          stats.easy.correct,
          stats.easy.total,
          totalTime
        ),
        medium: calculateCategoryStats(
          stats.medium.correct,
          stats.medium.total,
          totalTime
        ),
        hard: calculateCategoryStats(
          stats.hard.correct,
          stats.hard.total,
          totalTime
        ),
        advanced: calculateCategoryStats(
          stats.advanced.correct,
          stats.advanced.total,
          totalTime
        ),
        exceptional: calculateCategoryStats(
          stats.exceptional.correct,
          stats.exceptional.total,
          totalTime
        ),
      },
      questionType: {
        textual: calculateCategoryStats(
          stats.textual.correct,
          stats.textual.total,
          totalTime
        ),
        image: calculateCategoryStats(
          stats.image.correct,
          stats.image.total,
          totalTime
        ),
        auditory: calculateCategoryStats(
          stats.auditory.correct,
          stats.auditory.total,
          totalTime
        ),
      },
    };

    responseHandler(res, true, "Successful", categoryPerformance);
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

export const getProgressionStats = async (req: Request, res: Response) => {
  try {
    const playerId = req.user?.data?.id;

    const timeframe =
      (req.query.timeframe as "daily" | "weekly" | "monthly") || "weekly";

    const now = new Date();
    let startDate: Date;

    switch (timeframe) {
      case "daily":
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "weekly":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "monthly":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
    }

    const recentAttempts = await prisma.attempt.findMany({
      where: {
        playerId,
        createdAt: {
          gte: startDate,
        },
      },
      include: {
        AttemptDetails: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const allAttempts = await prisma.attempt.findMany({
      where: { playerId },
      include: {
        AttemptDetails: true,
      },
    });

    const calculateAccuracy = (attempts: any[]) => {
      let totalCorrect = 0;
      let totalQuestions = 0;

      attempts.forEach((attempt) => {
        attempt.AttemptDetails.forEach((detail: any) => {
          totalCorrect +=
            detail.easyCorrect +
            detail.midCorrect +
            detail.mediumCorrect +
            detail.hardCorrect +
            detail.advancedCorrect +
            detail.exceptionalCorrect +
            detail.textualCorrect +
            detail.imageCorrect +
            detail.auditoryCorrect;

          totalQuestions +=
            detail.easyTotal +
            detail.midTotal +
            detail.mediumTotal +
            detail.hardTotal +
            detail.advancedTotal +
            detail.exceptionalTotal +
            detail.textualTotal +
            detail.imageTotal +
            detail.auditoryTotal;
        });
      });

      return totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
    };

    const recentAccuracy = calculateAccuracy(recentAttempts);
    const overallAccuracy = calculateAccuracy(allAttempts);

    const progressionStats: ProgressionStats = {
      timeframe,
      improvementTrend: recentAccuracy - overallAccuracy,
      activityFrequency: recentAttempts.length,
      performanceDeltas: {
        accuracy: recentAccuracy - overallAccuracy,
        speed:
          recentAttempts.length > 0
            ? recentAttempts.reduce((sum, a) => sum + a.timeTaken, 0) /
                recentAttempts.length -
              allAttempts.reduce((sum, a) => sum + a.timeTaken, 0) /
                allAttempts.length
            : 0,
        consistency: Math.abs(recentAccuracy - overallAccuracy) < 5 ? 1 : -1,
      },
    };

    responseHandler(res, true, "Successful", progressionStats);
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};

export const getRecentActivity = async (req: Request, res: Response) => {
  try {
    const playerId = req.user?.data?.id;

    const limit = parseInt(req.query.limit as string) || 10;

    const recentAttempts = await prisma.attempt.findMany({
      where: { playerId },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      include: {
        AttemptDetails: true,
      },
    });

    const activities = recentAttempts.map((attempt) => {
      let totalCorrect = 0;
      attempt.AttemptDetails.forEach((detail) => {
        totalCorrect +=
          detail.easyCorrect +
          detail.midCorrect +
          detail.mediumCorrect +
          detail.hardCorrect +
          detail.advancedCorrect +
          detail.exceptionalCorrect +
          detail.textualCorrect +
          detail.imageCorrect +
          detail.auditoryCorrect;
      });

      return {
        id: attempt.id,
        type: "game_played" as const,
        description: `Completed game with ${totalCorrect} correct answers`,
        timestamp: attempt.createdAt,
        gameId: attempt.gameId,
        score: totalCorrect,
      };
    });

    const recentActivity: RecentActivity = {
      activities,
    };

    responseHandler(res, true, "Successful", recentActivity);
  } catch (e) {
    responseHandler(res, false, "", undefined, e);
  }
};
