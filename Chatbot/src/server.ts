import Fastify, { FastifyInstance } from 'fastify';
import dotenv from 'dotenv';
import { MessageRouter } from './router/messageRouter';
import { IncomingMessage } from './types';

dotenv.config();

const server: FastifyInstance = Fastify({ logger: true });
const PORT = process.env.PORT || 9851;
const router = new MessageRouter();

// Register Static Files for Simulator
server.register(require('@fastify/static'), {
    root: require('path').join(__dirname, '../public'),
    prefix: '/',
});

// Simulator Endpoint (Returns bot response directly to UI)
server.post('/simulate', async (request, reply) => {
    const body = request.body as any;
    const text = body.text;

    // Create dummy message
    const incoming: IncomingMessage = {
        from: 'SIMULATOR',
        text: text,
        type: 'text',
        timestamp: Date.now().toString()
    };

    const responses = await router.handleMessage(incoming);
    return { messages: responses };
});

// Root route
server.get('/health', async () => {
    return { status: 'ok', message: 'Chatbot Hybrid Server is Running 🚀' };
});

// WhatsApp Webhook Verification
server.get('/webhook', async (request, reply) => {
    const query = request.query as any;
    const mode = query['hub.mode'];
    const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];

    if (mode === 'subscribe' && token === process.env.WA_VERIFY_TOKEN) {
        console.log('WEBHOOK_VERIFIED');
        return reply.status(200).send(challenge);
    } else {
        return reply.status(403).send('Forbidden');
    }
});

// WhatsApp Message Receiver
server.post('/webhook', async (request, reply) => {
    try {
        const body = request.body as any;

        // Log incoming webhook for debugging
        // console.log(JSON.stringify(body, null, 2));

        if (body.object) {
            if (
                body.entry &&
                body.entry[0].changes &&
                body.entry[0].changes[0].value.messages &&
                body.entry[0].changes[0].value.messages[0]
            ) {
                const msg = body.entry[0].changes[0].value.messages[0];
                const from = msg.from;
                let text = '';
                let type: IncomingMessage['type'] = 'unknown';

                if (msg.type === 'text') {
                    text = msg.text.body;
                    type = 'text';
                } else if (msg.type === 'audio') {
                    type = 'audio';
                    text = '[AUDIO_MESSAGE]'; // Placeholder for Phase 3
                }

                const incoming: IncomingMessage = {
                    from,
                    text,
                    type,
                    timestamp: msg.timestamp
                };

                const responses = await router.handleMessage(incoming);

                // TODO: In Phase 2, we just log the response. In Phase 3, we send it via Axios to WhatsApp.
                console.log('🤖 BOT RESPONSE:', JSON.stringify(responses, null, 2));
            }
            return reply.status(200).send('EVENT_RECEIVED');
        } else {
            return reply.status(404).send('Not Found');
        }
    } catch (error) {
        server.log.error(error);
        return reply.status(500).send('Internal Server Error');
    }
});

const start = async () => {
    try {
        await server.listen({ port: Number(PORT), host: '0.0.0.0' });
        console.log(`Server running on port ${PORT}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
