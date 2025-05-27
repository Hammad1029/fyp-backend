import * as constants from "@/utils/constants";
import axios from "axios";

const serviceURL = constants.services.institutions;

class InstitutionService {
  getInstitutionsByIDs = async (ids: string[]): Promise<any | false> => {
    try {
      const institutions = await axios.post(`${serviceURL}/internal/getByID`, {
        institutionIds: ids,
      });
      return institutions.data.data;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  getInstitutionByType = async (type: string): Promise<any | false> => {
    try {
      const institutions = await axios.post(
        `${serviceURL}/internal/getByType`,
        { institutionType: type }
      );
      return institutions.data.data;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  updatePlayerInstitutions = async (
    playerId: number,
    institutionIds: number[]
  ): Promise<boolean> => {
    try {
      const institutions = await axios.post(
        `${serviceURL}/internal/updatePlayerInstitutions`,
        { playerId, institutionIds }
      );
      if (!institutions.data?.status)
        throw new Error("could not update institutions");
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  getPlayerInstitutions = async (playerId: number): Promise<any | false> => {
    try {
      const institutions = await axios.post(
        `${serviceURL}/internal/getPlayerInstitutions`,
        { playerId }
      );
      if (!institutions.data?.status)
        throw new Error("could not update institutions");
      return institutions.data.data;
    } catch (e) {
      console.error(e);
      return false;
    }
  };
}

const insitutionService = new InstitutionService();

export default insitutionService;
