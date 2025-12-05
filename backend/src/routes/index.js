const express = require('express');
const rfpRoutes = require('./rfpRoutes');
const vendorRoutes = require('./vendorRoutes');
const proposalRoutes = require('./proposalRoutes');
const emailRoutes = require('./emailRoutes');

const router = express.Router();

// API Routes
router.use('/rfps', rfpRoutes);
router.use('/vendors', vendorRoutes);
router.use('/proposals', proposalRoutes);
router.use('/email', emailRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

module.exports = router;