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
        model: "provider-4/gpt-4o", // Or another supported chat model
        messages: [
          {
            role: "system",
            content:
              "You are SmartDo, an intelligent assistant that converts user prompts into practical to-do lists. Format your output using markdown with bold section headings and bullet points. Do not include explanations, , just the list.",
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