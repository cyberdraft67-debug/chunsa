import { GoogleGenAI } from "@google/genai";

// ✅ Vite reads env vars from import.meta.env and they must start with VITE_
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

export const getMangoAssistantResponse = async (userMessage: string) => {
  // If no key, don’t crash the app
  if (!apiKey) {
    return "AI is currently disabled because the API key is not set.";
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userMessage,
      config: {
        systemInstruction: `You are the "Chaunsa Gold AI Assistant"...`,
      },
    });

    // @google/genai returns a response object; text is usually here:
    // If this line errors, tell me and I’ll adjust based on the exact SDK response type.
    return (response as any).text ?? "No response received.";
  } catch (err) {
    console.log("Gemini error:", err);
    return "AI is temporarily unavailable. Please try again later.";
  }
};
