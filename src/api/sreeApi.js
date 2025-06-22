import auth from "../config/config";
import axios from "axios";

const aiGeneratedTask = async (prompt) => {
  try {
    const response = await axios({
      method: "POST",
      url: "https://api.a4f.co/v1/chat/completions",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth.sree.api_key}`,
      },
      data: {
        model: "provider-5/gpt-4o", // Or another supported chat model
        messages: [
          {
            role: "system",
            content:
              "You are SmartDo, an intelligent assistant that transforms user prompts into clear, actionable to-do lists. Format all output in Markdown, starting with a main heading that summarizes the topic. Break the list into logical sections using bold subheadings, and use checkbox-style bullet points (- [ ]) for each individual task. Do not include explanations or extra commentary—only provide the structured task list.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      },
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("sree api :: List generation error ::", error);
    return null;
  }
};

export default aiGeneratedTask;