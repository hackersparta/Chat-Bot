import { IncomingMessage, OutgoingMessage } from '../types';
import { RuleEngine } from '../services/RuleEngine';
import { LLMService } from '../services/LLMService';
import { SessionManager } from '../services/SessionManager';

export class MessageRouter {
    private ruleEngine: RuleEngine;
    private llmService: LLMService;
    private sessionManager: SessionManager;

    constructor() {
        this.ruleEngine = new RuleEngine();
        this.llmService = new LLMService();
        this.sessionManager = new SessionManager();
    }

    public async handleMessage(message: IncomingMessage): Promise<OutgoingMessage[]> {
        console.log(`[Router] Processing: ${message.text}`);
        const userId = message.from;
        const session = this.sessionManager.getSession(userId);

        // 0. Global Reset (for demo purposes, let user reset location)
        if (message.text.toLowerCase() === 'reset') {
            this.sessionManager.clear(userId);
            return [{
                to: userId,
                type: 'text',
                text: "Session reset. Please start again."
            }];
        }

        // 1. Location Gatekeeper
        if (!session.location) {
            // Check if user is PROVIDING location
            const lowerText = message.text.toLowerCase().trim();
            if (lowerText.includes('india') || lowerText.includes('uae')) {
                const loc = lowerText.includes('india') ? 'India' : 'UAE';
                this.sessionManager.setLocation(userId, loc);
                return [{
                    to: userId,
                    type: 'text',
                    text: `Sure, are you looking for *Iron* cookware or *Soapstone* cookware?`
                }];
            } else {
                // Ask for location (Strict Gate)
                return [{
                    to: userId,
                    type: 'text',
                    text: "Welcome to Ethnic Pots & Pans! 🌿\nTo help you better, are you looking for delivery in **India** 🇮🇳 or **UAE** 🇦🇪?"
                }];
            }
        }

        // 2. Normal Flow (Location is Known)
        const ruleResult = await this.ruleEngine.process(message);
        if (ruleResult.matched && ruleResult.response) {
            console.log('[Router] Rule matched.');
            return Array.isArray(ruleResult.response) ? ruleResult.response : [ruleResult.response];
        }

        // 3. Fallback (AI Disabled)
        return [{
            to: userId,
            type: 'text',
            text: "I didn't understand that. You can ask for:\n- **Iron** / **Soapstone** (Catalogue)\n- **Curd Pot**\n- **Paniyaaram Pan**"
        }];
    }
}
