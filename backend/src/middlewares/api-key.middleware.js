module.exports = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        return res.status(401).json({ error: 'API Key is missing' });
    }

    if (apiKey !== process.env.N8N_API_KEY) {
        return res.status(403).json({ error: 'Invalid API Key' });
    }

    next();
};
