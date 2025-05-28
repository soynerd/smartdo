import axios from "axios";
export default async function saveTask(tasks) {
    try {        
        await axios.post("http://localhost:3000/data/updateTask", 
          {taskData : tasks},
          {withCredentials: true,});

          return true;
      }catch(err){
        console.log("api :: saveTask :: db :: ", err);
        return false;
      }
}