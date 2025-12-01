import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getPetAdvice = async (question: string, petContext?: string): Promise<string> => {
  if (!apiKey) {
    return "API Key fehlt. Bitte konfigurieren Sie den API Key.";
  }

  try {
    const model = 'gemini-2.5-flash';
    const systemInstruction = "Du bist ein hilfsbereiter, freundlicher Tierarzt-Assistent für eine App namens 'Pet Care Manager'. Antworte kurz, präzise und auf Deutsch. Gib allgemeine Ratschläge, weise aber bei ernsten Problemen immer darauf hin, einen echten Tierarzt aufzusuchen.";
    
    const prompt = `
      Kontext (Haustiere des Nutzers): ${petContext || 'Keine spezifischen Haustiere ausgewählt.'}
      
      Frage des Nutzers: ${question}
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "Entschuldigung, ich konnte darauf keine Antwort generieren.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Es gab einen Fehler bei der Verbindung zum KI-Assistenten.";
  }
};