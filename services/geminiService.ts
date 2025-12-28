
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getMangoAssistantResponse = async (userMessage: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: `You are the "Chaunsa Gold AI Assistant". You are an expert on the Chaunsa variety of mango, often called the "King of Mangoes". 
        
        Your Core Duties:
        1. Provide specific, mouth-watering recipes using Chaunsa mangoes.
        2. Explain why Chaunsa is the world's best variety (sweetness, honey-like aroma, fiber-less texture).
        3. When a user asks for a "recipe" or uses the search bar for ingredients:
           - Structure the response with: [Dish Name], [Prep Time], [Ingredients], and [Clear Steps].
           - Mention how the specific sweetness of Chaunsa enhances that specific dish.
        4. Keep your tone sophisticated, warm, and helpful. 
        5. If asked about other mangoes, politely pivot back to why Chaunsa is superior.
        6. Always focus on culinary creativity and premium quality.`,
        temperature: 0.7,
      },
    });

    return response.text || "I'm sorry, I couldn't process that request. How can I help you with our Chaunsa mangoes today?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I am currently having some trouble connecting to my mango knowledge base. Please try again in a moment!";
  }
};
