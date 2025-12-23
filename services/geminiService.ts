
import { GoogleGenAI } from "@google/genai";
import { RagRequest, RagResponse, Source } from '../types';
import { retrieveRelevantSources } from './ragEngine';

export const queryRagEngine = async (request: RagRequest): Promise<RagResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  // 1. Retrieval Phase
  const sources = retrieveRelevantSources(request);
  
  if (sources.length === 0) {
    return {
      question: request.question,
      answer: "I couldn't find any relevant information based on your current filters. Please try adjusting your search or selecting 'Any' for partner/country.",
      sources: [],
      retrieval_count: 0
    };
  }

  // 2. Synthesis Phase (Prompting Gemini)
  const context = sources.map((s, i) => `[SOURCE_${i + 1}]: ${s.content}`).join('\n\n');
  
  const prompt = `
    You are an assistant for the VINCE project. 
    Use the provided CONTEXT below to answer the USER QUESTION.
    
    IMPORTANT RULES:
    1. Only use the information in the CONTEXT.
    2. Cite your sources using the format [SOURCE_N] immediately after the relevant sentence.
    3. If the answer isn't in the context, say you don't know.
    4. Provide a helpful, clear, and professional response in English.
    
    CONTEXT:
    ${context}
    
    USER QUESTION:
    ${request.question}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        temperature: 0.2,
      },
    });

    const answer = response.text || "I'm sorry, I couldn't generate an answer.";

    // Return the course-compliant schema
    return {
      question: request.question,
      answer,
      sources: sources.map(({ content, ...rest }) => rest), // Remove content from final output
      retrieval_count: sources.length
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      question: request.question,
      answer: "Error communicating with the AI service. Please check your API key.",
      sources: [],
      retrieval_count: 0
    };
  }
};
