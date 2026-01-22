
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePetDescription = async (details: {
  type: string;
  breed: string;
  age: string;
  personality?: string;
}) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a friendly, appealing, and concise 2-3 sentence sales description for a ${details.age} old ${details.breed} ${details.type}. Include a mention of its ${details.personality || 'friendly'} personality. Target a loving pet owner.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini description generation failed:", error);
    return null;
  }
};

/**
 * AI Powered Chat with Thinking Mode for complex pet selection/care reasoning.
 */
export const getComplexPetAdvice = async (query: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: query,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        systemInstruction: "You are a senior pet behaviorist and marketplace expert. Use your thinking budget to deeply analyze user requirements (space, time, budget, family) before recommending the perfect pet or care plan."
      },
    });
    return response.text;
  } catch (error) {
    console.error("Complex advice failed:", error);
    return "I'm having trouble thinking through that right now. Could you try a simpler question?";
  }
};

/**
 * Maps Grounding to find nearby pet services.
 */
export const findNearbyPetServices = async (query: string, location?: { latitude: number; longitude: number }) => {
  try {
    const ai = getAI();
    const config: any = {
      tools: [{ googleMaps: {} }],
    };

    if (location) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: location.latitude,
            longitude: location.longitude
          }
        }
      };
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: query,
      config
    });

    const text = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    return { text, sources };
  } catch (error) {
    console.error("Maps grounding failed:", error);
    return { text: "I couldn't find any nearby services at the moment.", sources: [] };
  }
};
