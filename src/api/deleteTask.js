import axios from "axios";
import auth from "../config/config";
export default async function  deleteTask(id) {
    try{
        await axios.post(auth.backend.api_url + "/data/deleteTask", 
          {id : id},
          {withCredentials: true,});
        return true;
    }catch(err){
        console.log("api:: deleteTask :: db :: ", err);
        return false;
    }
}