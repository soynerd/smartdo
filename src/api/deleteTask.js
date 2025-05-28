import axios from "axios";

export default async function  deleteTask(id) {
    try{
        await axios.post("http://localhost:3000/data/deleteTask", 
          {id : id},
          {withCredentials: true,});
        return true;
    }catch(err){
        console.log("api:: deleteTask :: db :: ", err);
        return false;
    }
}