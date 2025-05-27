import * as constants from "@/utils/constants";
import axios from "axios";

const serviceURL = constants.services.institutions;

class InstitutionService {
  getInstitutionsByID = async (ids: string[]): Promise<any | false> => {
    try {
      const institutions = await axios.post(`${serviceURL}/internal/getByID`);
      return institutions.data;
    } catch (e) {
      console.error(e);
      return false;
    }
  };
}

const insitutionService = new InstitutionService();

export default insitutionService;