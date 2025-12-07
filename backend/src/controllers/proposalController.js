const proposalService = require('../services/proposalService');

class ProposalController {
  async createProposal(req, res) {
    try {
      const { rfp_id, vendor_id, raw_email_content, email_subject } = req.body;
      
      if (!rfp_id || !vendor_id || !raw_email_content) {
        return res.status(400).json({ 
          error: 'rfp_id, vendor_id, and raw_email_content are required' 
        });
      }

      const proposalData = { rfp_id, vendor_id, raw_email_content, email_subject };
      const proposal = await proposalService.createProposal(proposalData);
      
      // Auto-process with AI in background
      proposalService.processProposal(proposal.id).catch(error => {
        console.error('Background AI processing failed:', error);
      });
      
      res.status(201).json(proposal);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProposals(req, res) {
    try {
      const { rfpId } = req.params;
      const proposals = await proposalService.getProposals(rfpId);
      res.json(proposals);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProposalById(req, res) {
    try {
      const { id } = req.params;
      const proposal = await proposalService.getProposalById(id);
      
      if (!proposal) {
        return res.status(404).json({ error: 'Proposal not found' });
      }
      
      res.json(proposal);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async processProposal(req, res) {
    try {
      const { id } = req.params;
      const proposal = await proposalService.processProposal(id);
      res.json(proposal);
    } catch (error) {
      if (error.message === 'Proposal not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async processPendingProposals(req, res) {
    try {
      const results = await proposalService.processPendingProposals();
      res.json({ 
        message: 'Processing completed',
        results: results.map(r => ({ 
          status: r.status, 
          value: r.status === 'fulfilled' ? r.value?.id : null,
          error: r.status === 'rejected' ? r.reason?.message : null
        }))
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteProposal(req, res) {
    try {
      const { id } = req.params;
      await proposalService.deleteProposal(id);
      res.status(204).send();
    } catch (error) {
      if (error.message === 'Proposal not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async reprocessProposal(req, res) {
    try {
      const { id } = req.params;
      const proposal = await proposalService.reprocessProposal(id);
      res.json(proposal);
    } catch (error) {
      if (error.message === 'Proposal not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ProposalController();