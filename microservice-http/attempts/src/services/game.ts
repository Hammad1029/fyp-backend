import * as constants from "@/utils/constants";
import axios from "axios";

const serviceURL = constants.services.games;

class GameService {
  getGame = async (gameId: number): Promise<any | false> => {
    try {
      const game = await axios.post(`${serviceURL}/internal/getGame`, {
        gameId,
      });
      if (!game.data?.status) throw new Error("could not get game");
      return game.data.data;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  getQuestion = async (questionId: number): Promise<any | false> => {
    try {
      const question = await axios.post(`${serviceURL}/internal/getQuestion`, {
        questionId,
      });
      if (!question.data?.status) throw new Error("could not get question");
      return question.data.data;
    } catch (e) {
      console.error(e);
      return false;
    }
  };
}

const gameService = new GameService();

export default gameService;
