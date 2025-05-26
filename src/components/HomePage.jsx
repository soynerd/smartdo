import React, { useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom'
import sreeApi from "../api/sreeApi";
import auth from "../config/config";
import parseChecklist from "../util/parseAiResopnse";
const placeholders = [
  "Trip to Goa, what should I pack?",
  "Subjects: Math, Physics – what to study?",
  "How to prepare for a hackathon?",
  "Weekend party – grocery checklist",
  "I'm moving to a new flat",
  "What to take on a bike road trip?",
  "How to prepare for semester exams?",
  "Planning a camping trip",
  "What to pack for a winter vacation?",
  "Organizing a birthday party",
];

export default function Home({toggleLoading}) {
  const [prompt, setPrompt] = useState("");
  const [placeholder, setPlaceholder] = useState("");

  const navigate = useNavigate();
  const localStorageKey = auth.local_Storage.currentStorageKey;

  useEffect(() => {
    // random placeholder
    const random = Math.floor(Math.random() * placeholders.length);
    setPlaceholder(placeholders[random]);
  }, []);

  const sendForTextCompletion =async (prompt) => {
    if (prompt) {
    toggleLoading()
      await sreeApi(prompt).then((response) => {
        
        const tasks = parseChecklist(response)
        
        localStorage.setItem(localStorageKey, JSON.stringify(tasks));
        navigate('/current');
        //toggleLoading()



      });

      setPrompt(response);
    
    }
  }

  return (
    <main className="flex flex-col items-center justify-center px-4 py-20 text-center mt-20">
      <h1 className="text-3xl md:text-5xl font-bold mb-6">
        Welcome to SmartDo 👋
      </h1>
      <p className="mb-8 text-gray-600 dark:text-gray-300">
        What you want to do, and we'll generate a smart to-do list for you.
        Describe what would you like help with today? Enter a task prompt, and
        we’ll generate a to-do list just for you.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xl">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={placeholder}
          className="flex-1 p-4 border border-gray-300 dark:border-gray-700 rounded-lg outline-none dark:bg-gray-800 dark:text-white text-black"
          onKeyDown={(e) => e.key === "Enter" && sendForTextCompletion(prompt)}
        />
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition" onClick={() => sendForTextCompletion(prompt)}>
          Send
        </button>
      </div>
    </main>
  );
}
