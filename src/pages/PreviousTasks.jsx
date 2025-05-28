import React, { useState, useMemo, useEffect } from "react";
import { ArrowUpRight, Trash2 } from "lucide-react";
import auth from "../config/config";
import { useNavigate } from "react-router-dom";
import fetchData from "../api/fetchUserTasks";
export default function TaskList() {
  const [tasks, setTasks] = useState(JSON.parse(localStorage.getItem(auth.local_Storage.userTasksStorageKey)) || []);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function fetch() {
      const temp = await fetchData()
      setTasks(temp);
    }
    fetch();
    
  }, [navigate]);

  console.log(tasks)
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) =>
        task.task_heading.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort(
        (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
  }, [searchTerm, tasks]);

  const openTask = (id)=>{
    const task = tasks.find((task) => task.id === id);
    localStorage.setItem(auth.local_Storage.currentStorageKey, JSON.stringify(task));
    navigate('/current');
  }

  const deleteTaskfromDb= (id)=>{
    console.log("delete button")
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4 space-y-4">
      
      <input
        type="text"
        placeholder="Search tasks..."
        className="w-full mb-6 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredTasks.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
          <p className="text-xl font-medium">No Tasks</p>
          <p className="text-md">Create one to get started!</p>
        </div>
      ) : (
        filteredTasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 mb-3 hover:shadow-lg transition-all hover:scale-105 "
            
          >
            <h2 
              className="text-md sm:text-lg font-semibold text-gray-900 dark:text-white cursor-pointer" 
              onClick={()=>openTask(task.id)}
            >
              {task.task_heading}
            </h2>
            <div className="flex flex-row gap-4 justify-center items-center ml-4">
              <ArrowUpRight className="text-green-500 w-8 h-8" onClick={()=>openTask(task.id)} />
              <Trash2 className="text-red-500"  onClick={()=>deleteTaskfromDb(task.id)} />
            </div>
            
          </div>
        ))
      )}
    </div>
  );
}
