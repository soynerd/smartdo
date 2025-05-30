import axios from "axios";
import auth from "../config/config";

const fetchData = async () => {
      try {
        const taskResponse = await axios.get(auth.backend.api_url + "/data/taskData", {
            withCredentials: true,
          });
          console.log("taskResponse", taskResponse.data);
          const taskData = taskResponse.data.taskData;
          if(taskData.length > 0) localStorage.setItem(auth.local_Storage.userTasksStorageKey, JSON.stringify(taskData));
          return taskData;
      } catch (error) {
        console.error("api :: fetchUserTasks :: db :: ", error);
      }
    };

export default fetchData;