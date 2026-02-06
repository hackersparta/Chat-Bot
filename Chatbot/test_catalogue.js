const http = require('http');

function sendMsg(text, delay) {
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
            console.log(`[${text}] STATUS: ${res.statusCode}`);
        });

        req.write(data);
        req.end();
    }, delay);
}

// 1. Ask for Catalogue
sendMsg("Catalogue", 0);

// 2. Ask for Iron (PDF)
sendMsg("Iron", 2000);

// 3. Ask for Curd Pot (Dynamic DB)
sendMsg("Curd Pot", 4000);
