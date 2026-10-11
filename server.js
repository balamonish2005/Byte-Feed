const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');
require('dotenv').config();

const { sequelize, Donation } = require('./models');
const { sweepExpiredDonations } = require('./utils/timeEngine');
const { initializeRealtime } = require('./utils/realtime');

const authRoutes = require('./routes/authRoutes');
const donationRoutes = require('./routes/donationRoutes');
const ngoRoutes = require('./routes/ngoRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded food images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/ngo', ngoRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// Central error handler (e.g. multer file-size/type errors)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Something went wrong' });
});

const httpServer = http.createServer(app);
initializeRealtime(httpServer);
const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
    // sync({ alter: true }) keeps schema in step with models during development.
    // Swap for migrations before production use.
    await sequelize.sync({ alter: true });
    console.log('Models synced');

    httpServer.listen(PORT, () => console.log(`ByteFeed API running on port ${PORT}`));

    // Time engine: periodically auto-discard donations that have passed their shelf life.
    const SWEEP_INTERVAL_MS = 5 * 60 * 1000;
    setInterval(() => {
      sweepExpiredDonations(Donation).catch((err) => console.error('Expiry sweep failed:', err.message));
    }, SWEEP_INTERVAL_MS);
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
