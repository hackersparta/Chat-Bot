const http = require('http');

const data = JSON.stringify({
    object: "whatsapp_business_account",
    entry: [{
        changes: [{
            value: {
                messages: [{
                    from: "919999999999",
                    type: "audio",
                    audio: { id: "12345", mime_type: "audio/ogg" },
                    // In real WhatsApp, 'text' field is missing for audio, 
                    // but our server.ts logic adds a placeholder [AUDIO_MESSAGE]
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
