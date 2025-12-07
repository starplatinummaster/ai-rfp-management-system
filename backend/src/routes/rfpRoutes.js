const express = require('express');
const rfpController = require('../controllers/rfpController');

const router = express.Router();

// RFP CRUD operations
router.post('/', rfpController.createRFP);
router.get('/', rfpController.getRFPs);
router.get('/:id', rfpController.getRFPById);
router.put('/:id', rfpController.updateRFP);
router.delete('/:id', rfpController.deleteRFP);

// RFP specific actions
router.post('/send', rfpController.sendRFP);
router.get('/:id/vendors', rfpController.getRFPVendors);
router.get('/:id/proposals', rfpController.getRFPProposals);
router.get('/:id/proposals/archived', rfpController.getArchivedProposals);
router.get('/:id/compare', rfpController.compareProposals);

module.exports = router;