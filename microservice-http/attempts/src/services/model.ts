import * as constants from "@/utils/constants";
import axios from "axios";

const serviceURL = constants.services.games;

interface questionPool {
  id: number;
  modality: string;
  difficulty: string;
}

export interface startGameRequest {
  user_id: string;
  background: string;
  question_pool: questionPool[];
  question_count: number;
  previous_statistics: Record<string, number>;
  calibration_phase: boolean;
}

export interface nextQuestionRequest {
  attemptId: number;
  previousQuestionId: number;
  sessionId: string;
  answerId: number;
  correct: boolean;
  timeTaken: number;
}

class ModelService {
  startGame = async (req: startGameRequest): Promise<any | false> => {
    try {
      //   const res = { data: { status: true, sessionId: "djsaldjlsad" } };
      const res = await axios.post(`${serviceURL}/start_game`, req, {
        validateStatus: () => true,
      });
      if (res.status !== 200) throw new Error("could not start game");
      return res.data;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  nextQuestion = async (req: nextQuestionRequest): Promise<any | false> => {
    try {
      // const res = {
      //   data: {
      //     status: true,
      //     question_id: 4,
      //     modality: "textual",
      //     difficulty: "mid",
      //     index: 1,
      //     total: 10,
      //   },
      // };
      const res = await axios.post(`${serviceURL}/next_question`, req, {
        validateStatus: () => true,
      });
      if (res.status !== 200) throw new Error("could not get next question");
      return res.data;
    } catch (e) {
      console.error(e);
      return false;
    }
  };
}

const modelService = new ModelService();

export default modelService;
