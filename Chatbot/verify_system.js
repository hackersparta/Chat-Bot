const http = require('http');

console.log("🚀 Starting Full System Verification...");

function sendMsg(label, text, type = 'text', extra = {}, delay = 0) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const messagePayload = {
                from: "919999999999",
                type: type,
                timestamp: Date.now().toString()
            };

            if (type === 'text') {
                messagePayload.text = { body: text };
            } else if (type === 'audio') {
                messagePayload.audio = extra;
            }

            const data = JSON.stringify({
                object: "whatsapp_business_account",
                entry: [{
                    changes: [{
                        value: {
                            messages: [messagePayload]
                        }
                    }]
                }]
            });

            const options = {
                hostname: 'localhost',
                port: 9851,
                path: '/webhook',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length
                }
            };

            const req = http.request(options, (res) => {
                console.log(`[${label}] Request Sent: "${text || '[Audio]'}" -> Status: ${res.statusCode}`);
                resolve();
            });

            req.on('error', (e) => {
                console.error(`[${label}] Failed: ${e.message}`);
                resolve();
            });

            req.write(data);
            req.end();
        }, delay);
    });
}

async function runTests() {
    // 1. Greeting
    await sendMsg("STEP 1: Greeting", "Hi", 'text', {}, 0);

    // 2. Catalogue
    await sendMsg("STEP 2: Catalogue", "Iron", 'text', {}, 1000);

    // 3. Product Search
    await sendMsg("STEP 3: Product Search", "Curd Pot", 'text', {}, 1000);

    // 4. Order Status
    await sendMsg("STEP 4: Order Status", "Status 101", 'text', {}, 1000);

    // 5. Audio Question
    await sendMsg("STEP 5: Voice AI", "", 'audio', { id: "audio_123", mime_type: "audio/ogg" }, 1000);

    // 6. Report Generation
    await sendMsg("STEP 6: Admin Report", "Download Orders", 'text', {}, 1000);

    console.log("\n✅ Verification Requests Sent. Check terminal logs for Bot Responses.");
}

runTests();
