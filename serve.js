const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { Readable } = require('stream');
const app = express();
app.use(cors());
app.use(express.json());

app.post('/v1/chat/completions', async (req, res) => {
    try {
        // Log the original request information
        console.log(`Received POST request: ${req.method} ${req.originalUrl}`);
        console.log('Request headers:', req.headers);
        console.log('Original request body:', JSON.stringify(req.body));

        // Modify the request body
        const modifiedBody = {
            ...req.body,
            model: 'llama3.2-vision'
        };
        
        console.log('Modified request body:', JSON.stringify(modifiedBody));

        // Forward to port 12344
        const response = await axios.post('http://localhost:12344/v1/chat/completions', modifiedBody, {
            headers: {
                'Content-Type': 'application/json'
            },
            responseType: 'stream'
        });

        // Set response headers
        res.setHeader('Content-Type', 'application/json');

        // Create a readable stream
        const stream = new Readable().wrap(response.data);

        // Pipe the stream data back to the client
        stream.pipe(res);
    } catch (error) {
        console.error('Request handling error:', error);
        res.status(500).json({ error: 'Request handling failed', details: error.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(3001, () => {
    console.log('Server is running: http://localhost:3001');
});