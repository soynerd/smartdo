import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LoaderCircle, Lightbulb, Send } from "lucide-react"; // Added icons
import generateTaskRespose from "../api/googleGeminiAPI";
import auth from "../config/config";
import parseChecklist from "../util/parseAiResopnse";

// A shorter, punchier list for the animated placeholder
const placeholders = [
  "Plan a trip to Goa...",
  "Prepare for a hackathon...",
  "Host a weekend dinner party...",
  "Learn how to code in 30 days...",
  "Organize my home office...",
  "How to prepare for a hackathon?",
  "Weekend party – grocery checklist",
  "I'm moving to a new flat",
  "What to take on a bike road trip?",
  "How to prepare for semester exams?",
  "Planning a camping trip",
  "What to pack for a winter vacation?",
];

// Great examples to showcase power
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
  const [isLoading, setIsLoading] = useState(false); // --- UX Improvement: Local loading state
  const [currentPlaceholder, setCurrentPlaceholder] = useState("");
  const [tip, setTip] = useState("");

  const navigate = useNavigate();
  const localStorageKey = auth.local_Storage.currentStorageKey;

  // --- UX Improvement: Animated typing placeholder effect ---
  useEffect(() => {
    let placeholderIndex = 0;
    let letterIndex = 0;
    let timeoutId;

    const typePlaceholder = () => {
      const currentText = placeholders[placeholderIndex];
      setCurrentPlaceholder(currentText.substring(0, letterIndex + 1));
      letterIndex++;
      if (letterIndex > currentText.length) {
        // Pause at the end before switching to next placeholder
        letterIndex = 0;
        placeholderIndex = (placeholderIndex + 1) % placeholders.length;
        timeoutId = setTimeout(typePlaceholder, 2000);
      } else {
        timeoutId = setTimeout(typePlaceholder, 50); // Typing speed
      }
    };

    typePlaceholder();
    return () => clearTimeout(timeoutId); // Cleanup on unmount
  }, []);

  const sendForTextCompletion = async (text) => {
    if (!text || isLoading) return;

    setIsLoading(true); // 1. Set local loading state immediately

    try {
      const response = await generateTaskRespose(text);
      const tasks = parseChecklist(response);
      localStorage.setItem(
        localStorageKey,
        JSON.stringify({ id: null, task_data: tasks })
      );

      toggleLoading(); // 2. Trigger the full-screen loader *just before* navigating
      setTimeout(() => navigate("/ai"), 100); // Give it a moment for the screen to transition
    } catch (error) {
      console.error("Failed to generate task:", error);
      setIsLoading(false); // Make sure to turn off loading on error
    }
  };

  const handleExampleClick = (example) => {
    setPrompt(example);
    // You could optionally auto-send when an example is clicked
    // sendForTextCompletion(example);
  };

  const showTip = () => {
    if (tip) setTip("");
    else setTip(tips[Math.floor(Math.random() * tips.length)]);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-10 text-center animate-fade-in">
      <div className="w-full max-w-2xl">
        {/* --- UX Improvement: Clear, benefit-oriented copywriting --- */}
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
              className="w-full p-4 pr-24 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm outline-none dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
              onKeyDown={(e) =>
                e.key === "Enter" && sendForTextCompletion(prompt)
              }
              disabled={isLoading}
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

        {/* --- UX Improvement: Clickable examples --- */}
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
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* --- UX Improvement: Tip presented in a dismissible callout box --- */}
        <div className="mt-12 w-full">
          <button
            onClick={showTip}
            className="flex items-center gap-2 mx-auto text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline"
          >
            <Lightbulb size={16} /> How to write better prompts
          </button>
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
      </div>
    </main>
  );
}
