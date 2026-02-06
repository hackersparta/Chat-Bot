const http = require('http');

const data = JSON.stringify({
    object: "whatsapp_business_account",
    entry: [{
        changes: [{
            value: {
                messages: [{
                    from: "919999999999",
                    type: "text",
                    text: { body: "Download Orders" },
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
    console.log(`STATUS: ${res.statusCode}`);
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
});

req.write(data);
req.end();
