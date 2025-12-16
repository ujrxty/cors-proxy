const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Proxy endpoint
app.post('/proxy', async (req, res) => {
    const { url, data, method } = req.body;
    console.log("📥 Incoming proxy request");
    console.log("➡️ Target URL:", url);
    console.log("➡️ Method:", method);

    if (data) {
        console.log("📦 Payload:");
        console.log(JSON.stringify(data, null, 2));
    }
    if (!url) return res.status(400).json({ error: "URL required" });

    const startTime = Date.now();

    try {
        const response = await fetch(url, {
            method: method || "POST",
            headers: { "Content-Type": "application/json" },
            body: method === "GET" ? undefined : JSON.stringify(data || {})
        });

        const rawBody = await response.text();
        const responseTime = Date.now() - startTime;

        let parsedBody = null;
        try {
            parsedBody = rawBody ? JSON.parse(rawBody) : null;
        } catch {
            parsedBody = rawBody;
        }

        res.json({
            http_status: response.status,
            content_type: response.headers.get("content-type"),
            response_time_ms: responseTime,
            body: parsedBody
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});



app.listen(PORT, () => {
    console.log(`CORS Proxy running on port ${PORT}`);
});
