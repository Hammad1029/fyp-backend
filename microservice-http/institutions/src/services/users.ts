import * as constants from "@/utils/constants";
import axios from "axios";

const serviceURL = constants.services.users;

class UsersService {
  deleteInstitutionAdmins = async (institutionId: number): Promise<boolean> => {
    try {
      const institutions = await axios.post(
        `${serviceURL}/internal/deleteInstitutionAdmins`,
        { institutionId }
      );
      if (!institutions.data?.status)
        throw new Error("could not delete institutions");
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };
}

const userService = new UsersService();

export default userService;
