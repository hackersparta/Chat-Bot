import { IncomingMessage, OutgoingMessage, RuleResult } from '../types';
import { DatabaseService } from './DatabaseService';
import { ReportService } from './ReportService';

export class RuleEngine {
    private rules: Map<RegExp, (msg: IncomingMessage) => Promise<OutgoingMessage | OutgoingMessage[]>> = new Map();
    private db: DatabaseService;
    private reportService: ReportService;

    constructor() {
        this.db = new DatabaseService();
        this.reportService = new ReportService();
        this.initializeRules();
    }

    private initializeRules() {
        // 1. Catalogue Request (Already handled by Router flow mostly, but kept for direct access)
        this.rules.set(/(catalogue|catalog|brochure)/i, async (msg) => ({
            to: msg.from,
            type: 'text',
            text: "Sure! Are you looking for *Iron* cookware or *Soapstone* cookware?"
        }));

        // 2. Iron Catalogue
        this.rules.set(/^iron$/i, async (msg) => ({
            to: msg.from,
            type: 'document',
            url: 'https://example.com/iron_catalogue.pdf', // Placeholder
            caption: "Here is our Iron Cookware Catalogue 🍳"
        }));

        // 3. Soapstone Catalogue
        this.rules.set(/^soapstone$/i, async (msg) => ({
            to: msg.from,
            type: 'document',
            url: 'https://example.com/soapstone_catalogue.pdf', // Placeholder
            caption: "Here is our Soapstone Cookware Catalogue 🥘"
        }));

        // 4. Curd Pot (Updated with Link)
        this.rules.set(/(curd pot|curd)/i, async (msg) => ([
            {
                to: msg.from,
                type: 'image',
                url: 'https://placehold.co/600x400?text=Curd+Pot',
                caption: "Traditional Soapstone Curd Pot"
            },
            {
                to: msg.from,
                type: 'text',
                text: "Buy here: https://ethnicpotsandpans.com/product/curd-pot"
            }
        ]));

        // 5. Maintenance (Dosa Tawa)
        this.rules.set(/(maintain|seasoning|season).*(tawa|dosa)/i, async (msg) => ({
            to: msg.from,
            type: 'text',
            text: "🧽 **How to maintain Dosa Tawa:**\n1. Apply oil after every use.\n2. Do not use harsh soap.\n3. Heat slightly before storing."
        }));

        // 6. Paniyaaram Pan (Video)
        this.rules.set(/(paniyaaram|paniyaram)/i, async (msg) => ({
            to: msg.from,
            type: 'video',
            url: 'http://localhost:9851/paniyaaram.mp4', // Local video
            caption: "Check out our Paniyaaram Pan in action! 🎥"
        }));

        // 7. Order Status
        this.rules.set(/status\s+(\w+)/i, async (msg) => {
            const match = msg.text.match(/status\s+(\w+)/i);
            const orderId = match ? match[1] : '';
            let reply = "Could not find that order.";
            const status = await this.db.getOrderStatus(orderId);
            if (status) reply = status;
            return {
                to: msg.from,
                type: 'text',
                text: reply
            };
        });

        // 8. Greeting (Restored)
        this.rules.set(/^(hi|hello|hey)$/i, async (msg) => ({
            to: msg.from,
            type: 'text',
            text: "Hello! Welcome to Ethnic Pots & Pans. 👋\nYou can ask for *Iron*, *Soapstone*, *Curd Pot*, or *Paniyaaram Pan*."
        }));
    }

    public async process(message: IncomingMessage): Promise<RuleResult> {
        for (const [regex, handler] of this.rules) {
            if (regex.test(message.text)) {
                return {
                    matched: true,
                    response: await handler(message)
                };
            }
        }
        return { matched: false };
    }
}
