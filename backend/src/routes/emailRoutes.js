const express = require('express');
const emailController = require('../controllers/emailController');

const router = express.Router();

// Inbound email handling
router.post('/inbound', emailController.handleInboundEmail);

// Email system management
router.get('/test-connection', emailController.testEmailConnection);
router.get('/status/:messageId', emailController.getEmailStatus);
router.post('/monitoring/start', emailController.startEmailMonitoring);
router.post('/monitoring/stop', emailController.stopEmailMonitoring);

module.exports = router;