require('dotenv').config();
const express = require('express');
const orderRoutes = require('./routes/orders');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString(),
    });
});

app.use('/api/orders', orderRoutes);

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({ error: err.message });
});

const PORT = process.env.PORT || 4000;

if (require.main === module) {
    connectDB(process.env.MONGODB_URI).then(() => {
        app.listen(PORT, () => console.log(`[server] listening on port ${PORT}`));
    });
}

module.exports = app;