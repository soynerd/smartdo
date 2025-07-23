import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LoaderCircle, Lightbulb, Send, CheckSquare } from "lucide-react"; // Added CheckSquare icon
import generateTaskRespose from "../api/googleGeminiAPI";
import auth from "../config/config";
import parseChecklist from "../util/parseAiResopnse";

const placeholders = [
  "Plan a trip to Goa...",
  "Prepare for a hackathon...",
  "Host a weekend dinner party...",
  "Learn how to code in 30 days...",
  "Organize my home office...",
];

const examplePrompts = [
  "Plan a wedding",
  "Beginner gym workout",
  "Learn a new skill",
  "Host a dinner party",
];

const tips = [
  "For a study plan, specify the subject and topics, like: 'Class 12th Maths Study Plan with chapters, each with short description.'",
  "To get a workout schedule, define the goal, like: 'Beginner Gym Workout Plan – weekly schedule with short explanation of each exercise.'",
  "For a guide, state the area of focus, like: 'Personal Finance Starter Guide – steps with brief descriptions for budgeting and saving.'",
];

export default function HomePage({ toggleLoading }) {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState("");
  const [tip, setTip] = useState("");

  const navigate = useNavigate();
  const localStorageKey = auth.local_Storage.currentStorageKey;

  useEffect(() => {
    let placeholderIndex = 0;
    let letterIndex = 0;
    let timeoutId;

    const typePlaceholder = () => {
      const currentText = placeholders[placeholderIndex];
      setCurrentPlaceholder(currentText.substring(0, letterIndex + 1));
      letterIndex++;
      if (letterIndex > currentText.length) {
        letterIndex = 0;
        placeholderIndex = (placeholderIndex + 1) % placeholders.length;
        timeoutId = setTimeout(typePlaceholder, 2000); // Pause before next placeholder
      } else {
        timeoutId = setTimeout(typePlaceholder, 50); // Typing speed
      }
    };

    typePlaceholder();
    return () => clearTimeout(timeoutId); // Cleanup on unmount
  }, []);

  const sendForTextCompletion = async (text) => {
    if (!text || isLoading) return;
    toggleLoading(); // This now controls a global loading state, which is great

    try {
      const response = await generateTaskRespose(text);
      const tasks = parseChecklist(response);
      localStorage.setItem(
        localStorageKey,
        JSON.stringify({ id: null, task_data: tasks })
      );
      navigate("/ai"); // Navigate immediately, the loading state will be handled on the next page
    } catch (error) {
      console.error("Failed to generate task:", error);
      toggleLoading(); // Turn off loading on error
    }
  };

  const handleExampleClick = (example) => {
    setPrompt(example);
  };

  const showTip = () => {
    if (tip) setTip("");
    else setTip(tips[Math.floor(Math.random() * tips.length)]);
  };

  return (
    // --- KEY CHANGE: Improved layout for mobile screens ---
    // min-h-[calc(100vh-4rem)] accounts for the header height (h-16 is 4rem)
    // justify-start on mobile, md:justify-center on larger screens
    <main className="flex flex-col items-center justify-start md:justify-center min-h-[calc(100vh-4rem)] px-4 py-8 sm:py-12 text-center animate-fade-in">
      <div className="w-full max-w-2xl">
        {/* --- UI Improvement: Added a visual anchor icon --- */}
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center rounded-3xl shadow-sm">
          <CheckSquare className="w-10 h-10 text-blue-600 dark:text-blue-400" />
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-800 dark:text-white">
          Turn Any Goal Into a Plan
        </h1>
        <p className="mb-8 text-lg text-gray-500 dark:text-gray-400">
          Describe a task, project, or idea, and let AI create a smart checklist
          for you instantly.
        </p>

        <div className="flex flex-col gap-4 w-full">
          <div className="relative w-full">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={currentPlaceholder}
              className="w-full p-4 pr-28 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm outline-none dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
              onKeyDown={(e) =>
                e.key === "Enter" && sendForTextCompletion(prompt)
              }
              disabled={isLoading}
            />
            {/* --- UI Improvement: Enhanced button style --- */}
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-br from-blue-600 to-blue-700 text-white px-5 py-2 rounded-lg shadow-md hover:shadow-lg transition-all disabled:from-blue-400 disabled:to-blue-500 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
              onClick={() => sendForTextCompletion(prompt)}
              disabled={isLoading || !prompt}
            >
              {isLoading ? (
                <LoaderCircle size={20} className="animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Or get started with an example:
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {examplePrompts.map((ex) => (
              <button
                key={ex}
                onClick={() => handleExampleClick(ex)}
                disabled={isLoading}
                // --- UI Improvement: More interactive hover effect ---
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* --- UI Improvement: More inviting 'Tips' section --- */}
        <div className="mt-12 w-full flex justify-center">
          <div
            onClick={showTip}
            className="group flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <Lightbulb
              className="text-blue-500 dark:text-blue-400 transition-transform group-hover:scale-110"
              size={18}
            />
            <span className="text-sm text-blue-600 dark:text-blue-400 font-medium group-hover:underline">
              How to write better prompts
            </span>
          </div>
        </div>

        {tip && (
          <div className="relative mt-4 p-4 bg-blue-50 dark:bg-gray-800 border border-blue-200 dark:border-gray-600 rounded-lg text-left text-sm text-blue-800 dark:text-blue-200 animate-fade-in-down">
            <button
              onClick={() => setTip("")}
              className="absolute top-1 right-2 text-blue-400 hover:text-blue-600 font-bold"
            >
              ×
            </button>
            <p>{tip}</p>
          </div>
        )}
      </div>
    </main>
  );
}
