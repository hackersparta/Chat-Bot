import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { IncomingMessage } from '../types';

dotenv.config();

export class LLMService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY || '';
        if (!apiKey) {
            console.warn('⚠️ GEMINI_API_KEY is missing. LLM Logic will fail.');
        }
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }

    public async generateResponse(message: IncomingMessage): Promise<string> {
        try {
            if (!process.env.GEMINI_API_KEY) return "I'm sorry, my brain is offline (API Key missing).";

            let promptParts: any[] = [];

            const systemPrompt = `
      You are a helpful sales assistant for a Cookware shop.
      We sell Iron and Soapstone cookware.
      User said: "${message.text || '[Audio Message]'}"
      Provide a helpful, short answer (max 3 sentences).
      `;
            promptParts.push(systemPrompt);

            if (message.type === 'audio' && message.audioUrl) {
                // Note: In a real app, we would download the image/audio from message.audioUrl
                // and append it here. For this demo, we will simulate "hearing" the audio
                // by appending a text description if the audioUrl is a placeholder, 
                // OR if we had real audio, we'd do:
                // promptParts.push({ inlineData: { data: base64Audio, mimeType: 'audio/mp3' } });

                promptParts.push("User sent an audio message asking: 'Do you have seasoning instructions for the dosa tawa?'");
            }

            const result = await this.model.generateContent(promptParts);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('LLM Error:', error);
            return "I'm having trouble thinking right now. Please try again later.";
        }
    }
}

