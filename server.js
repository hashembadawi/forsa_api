require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./src/adapters/database/mongoose');
const userRoutes = require('./src/adapters/routes/userRoutes');
const adRoutes = require('./src/adapters/routes/AdRoutes');
const optionsRoutes = require('./src/adapters/routes/optionsRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Database Connection
connectDB();

// Routes
app.use('/api/user', userRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/options', optionsRoutes);

// Server Start
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});