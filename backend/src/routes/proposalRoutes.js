const express = require('express');
const proposalController = require('../controllers/proposalController');

const router = express.Router();

// Proposal operations
router.post('/', proposalController.createProposal);
router.get('/rfp/:rfpId', proposalController.getProposals);
router.get('/:id', proposalController.getProposalById);
router.delete('/:id', proposalController.deleteProposal);

// AI Processing operations
router.post('/:id/process', proposalController.processProposal);
router.post('/:id/reprocess', proposalController.reprocessProposal);
router.post('/process-pending', proposalController.processPendingProposals);

module.exports = router;