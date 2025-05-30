import axios from "axios";
import auth from "../config/config";
export default async function saveTask(tasks) {
    try {        
        await axios.post(auth.backend.api_url + "/data/updateTask", 
          {taskData : tasks},
          {withCredentials: true,});

          return true;
      }catch(err){
        console.log("api :: saveTask :: db :: ", err);
        return false;
      }
}