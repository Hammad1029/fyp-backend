import { Question } from "@prisma/client";

class nextQReturn {
  next?: Question;
  score: number = 0;
  stats?: string;
  end: boolean = false;
}

export const mockStartGame = async (
  attemptId: number,
  giveQuestions: number,
  questionList: Question[],
  education: string,
  stats: Record<string, number>
): Promise<nextQReturn> => {
  return new nextQReturn();
};

export const mockNextQuestion = async (
  attemptId: number
): Promise<nextQReturn> => {
  return new nextQReturn();
};
