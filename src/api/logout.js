import axios from "axios";

export default async function logout(){
    try{
        await axios.post("http://localhost:3000/auth/logout", 
          {},
          {withCredentials: true,});
        localStorage.clear();
        return true;
    }catch(err){
        console.log("api :: logout :: db :: ", err);
        return false;
    }
}