import axios from "axios";
import auth from "../config/config";
export default async function logout(){
    try{
        await axios.post(auth.backend.api_url + "/auth/logout", 
          {},
          {withCredentials: true,});
        localStorage.clear();
        return true;
    }catch(err){
        console.log("api :: logout :: db :: ", err);
        return false;
    }
}