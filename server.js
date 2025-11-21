const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Proxy endpoint
app.post('/proxy', async (req, res) => {
    const { url, data } = req.body;

    console.log('Incoming Request:', JSON.stringify({ url, data }, null, 4));

    if (!url) {
        return res.status(400).send({ error: 'URL is required' });
    }

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const responseBody = await response.text();

        console.log("Response from target API:", responseBody);

        res.send(responseBody);

    } catch (error) {
        console.error("Proxy Error:", error);
        res.status(500).send({ error: error.toString() });
    }
});

app.listen(PORT, () => {
    console.log(`CORS Proxy running on port ${PORT}`);
});

