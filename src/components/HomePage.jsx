import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import generateTaskRespose from "../api/googleGeminiAPI";
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
  "Hosting a dinner party – what do I need?",
  "Preparing for a job interview – checklist?",
  "First day at college – what to bring?",
  "Starting a vegetable garden – where to begin?",
  "Going on a long train journey – what to pack?",
  "Setting up a home office – what do I need?",
  "Attending a wedding – prep list?",
  "Moving abroad for studies – what should I do?",
  "Planning a surprise proposal – ideas and checklist?",
  "Getting a new pet – what should I buy?",
  "How to plan a weekend road trip with friends?",
  "Packing for a rainy season vacation",
  "Starting a fitness routine – what to prepare?",
  "Preparing for a music concert – what to carry?",
  "Throwing a baby shower – what needs to be done?",
  "Planning a beach picnic – what to take?",
  "How to get ready for a public speaking event?",
  "Back-to-school checklist for kids",
  "Preparing for a coding bootcamp – what to study?",
  "Organizing a housewarming party – what to buy?",
];
const tips = [
  "Class 12th Maths Study Plan with chapters, each with short description.",
  "Beginner Gym Workout Plan – weekly schedule with short explanation of each exercise.",
  "Personal Finance Starter Guide – steps with brief descriptions for budgeting, saving, and investing.",
  "30-Day Digital Detox Plan – day-wise tasks with short purposes explained.",
  "Beginner Photography Learning Path – topics to cover with simple descriptions.",
  "New Dog Owner Checklist – essential tasks and short reasons why they matter.",
  "Daily Self-Care Routine Plan – morning, afternoon, evening tasks with short descriptions.",
  "Wedding Planning Checklist – phase-wise steps with brief explanations.",
  "First-Time Home Buying Process – step-by-step breakdown with short details.",
  "Startup Launch Plan – phases from idea to launch with short descriptions.",
  "Basic Cooking Skills Learning Plan – key techniques or dishes with what each teaches you.",
];

export default function Home({ toggleLoading }) {
  const [prompt, setPrompt] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [tip, setTip] = useState("");

  const navigate = useNavigate();
  const localStorageKey = auth.local_Storage.currentStorageKey;

  useEffect(() => {
    const random = Math.floor(Math.random() * placeholders.length);
    setPlaceholder(placeholders[random]);
  }, []);

  const sendForTextCompletion = async (prompt) => {
    if (prompt) {
      toggleLoading();
      await generateTaskRespose(prompt).then((response) => {
        const tasks = parseChecklist(response);
        localStorage.setItem(
          localStorageKey,
          JSON.stringify({ id: null, task_data: tasks })
        );
        navigate("/current");
        //toggleLoading()
      });
      setPrompt("");
    }
  };

  const showTip = () => {
    if (tip) setTip("");
    else setTip(tips[Math.floor(Math.random() * tips.length)]);
  };

  return (
    <main className="flex flex-col items-center justify-center px-4 py-20 text-center mt-20">
      <h1 className="text-3xl md:text-5xl font-bold mb-6">
        Welcome to SmartDo 👋
      </h1>
      <p className="mb-2 text-gray-500 dark:text-gray-300">
        What you want to do! <br />
        Describe what would you like help with today? And we'll generate a smart
        to-do list for you.
      </p>
      <p className="mb-8 text-gray-500 dark:text-gray-400 ">
        <button className="hover:cursor-pointer" onClick={showTip}>
          Tip for better response
        </button>
        <br />
        <p className="text-gray-600 dark:text-gray-300 text-lg">{tip}</p>
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
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          onClick={() => sendForTextCompletion(prompt)}
        >
          Send
        </button>
      </div>
    </main>
  );
}
