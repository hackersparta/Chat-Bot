const http = require('http');

console.log("🚀 Starting Client Demo Verification...");

function sendMsg(label, text, delay = 0) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const data = JSON.stringify({
                object: "whatsapp_business_account",
                entry: [{
                    changes: [{
                        value: {
                            messages: [{
                                from: "919999999999",
                                type: "text",
                                text: { body: text },
                                timestamp: Date.now().toString()
                            }]
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
                console.log(`[${label}] Sent: "${text}" -> Status: ${res.statusCode}`);
                resolve();
            });
            req.write(data);
            req.end();
        }, delay);
    });
}

async function runTests() {
    // 1. Initial Greeting (Should ask for Location)
    await sendMsg("1. Init", "Hi", 0);

    // 2. Provide Location
    await sendMsg("2. Location", "I want delivery in India", 1000);

    // 3. Ask for Iron (Should work now)
    await sendMsg("3. Catalogue", "Iron", 1000);

    // 4. Curd Pot (Should include link)
    await sendMsg("4. Product", "Curd Pot", 1000);

    // 5. Maintenance (Should show text)
    await sendMsg("5. FAQ", "How to maintain dosa tawa", 1000);

    // 6. Paniyaaram (Should show video)
    await sendMsg("6. Video", "Show paniyaaram pan", 1000);

    console.log("\n✅ Requests Sent. Check terminal logs for responses.");
}

runTests();
