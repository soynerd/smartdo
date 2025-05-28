import axios from "axios";

export default async function authStatus(){
      const authResponse = await axios.get("http://localhost:3000/auth/auth-status", {
          withCredentials: true,});
      const status = authResponse.status === 200 ? true : false;
      return status;
    }

