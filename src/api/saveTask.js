import axios from "axios";
import auth from "../config/config";
export default async function saveTask(tasks) {
  try {
    const res = await axios.post(
      auth.backend.api_url + "/data/updateTask",
      { taskData: tasks },
      { withCredentials: true }
    );

    return { status: true, message: res.data.message, statusCode: res.status };
  } catch (err) {
    console.log("api :: saveTask :: db :: ", err);
    return false;
  }
}
