import axios from "axios";
import auth from "../config/config";
export default async function authStatus(){
      const authResponse = await axios.get(auth.backend.api_url + "/auth/auth-status", {
          withCredentials: true,});
      const status = authResponse.status === 200 ? true : false;
      return status;
    }

