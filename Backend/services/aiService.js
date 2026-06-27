import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeIssueWithAI = async (title, description) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash" 
    });

    const prompt = `Analyze this civic issue: Title: ${title}, Description: ${description}. 
    Return ONLY JSON: {"category": "...", "priority": "..."}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    const jsonString = text.replace(/```json\s?|```/g, "").trim();
    return JSON.parse(jsonString);
    
  } catch (error) {
    console.error("AI Bypass Mode Active - AI Error:", error.message);
    return { category: "Other", priority: "Low" };
  }
};