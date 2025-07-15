import axios, { AxiosHeaders } from "axios";
import auth from "../config/config";

const generateTaskRespose = async (prompt) => {
  const providers = [gemini25Preview, gemma327b];
  for (const provider of providers) {
    try {
      const taskData = await provider(prompt);
      if (taskData) return taskData;
    } catch (error) {
      console.error("Google Providers :: Text Completions :: ", error);
    }
  }
  throw new error("Quota Full for Text Completion");
};

const gemma327b = async (prompt) => {
  try {
    const getTask = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemma-3-27b-it:generateContent",
      {
        contents: [
          {
            parts: [
              {
                text: `System: You are SmartDo, an intelligent assistant that transforms user prompts into clear, actionable to-do lists. 
                    Format all output in Markdown, starting with a main heading that summarizes the topic. 
                    The main heading must be bolded using double asterisks (e.g., **Heading**), not markdown header symbols like # or ##.
                    Break the list into logical sections using bold subheadings, and use checkbox-style bullet points (- [ ]) for each individual task. 
                    Do not include explanations or extra commentary—only provide the structured task list. 
                    Give atleat 4 heading if possible and feaseable. User: ${prompt} `,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": auth.google.aistudio_api_key,
        },
      }
    );
    return getTask.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Google Gemini Api :: Token Generation :: ", error);
    if (error?.response?.status !== 404) {
      return;
    }
  }
};

const gemini25Preview = async (prompt) => {
  try {
    const getTask = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite-preview-06-17:generateContent",
      {
        contents: [
          {
            parts: [
              {
                text: `System: You are SmartDo, an intelligent assistant that transforms user prompts into clear, actionable to-do lists. 
                Format all output in Markdown, starting with a main heading that summarizes the topic. 
                The main heading must be bolded using double asterisks (e.g., **Heading**), not markdown header symbols like # or ##.
                Break the list into logical sections using bold subheadings, and use checkbox-style bullet points (- [ ]) for each individual task. 
                Do not include explanations or extra commentary—only provide the structured task list. 
                ve atleat 4 heading if possible and feaseable. User: ${prompt} `,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": auth.google.aistudio_api_key,
        },
      }
    );
    console.log(getTask);
    return getTask.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Google Gemini Api :: Token Generation :: ", error);
    if (error?.response?.status !== 404) {
      return;
    }
  }
};

export default generateTaskRespose;
