const rfpService = require('../services/rfpService');
const vendorService = require('../services/vendorService');

class RFPController {
  async createRFP(req, res) {
    try {
      const { description } = req.body;
      const userId = req.user?.id || 1; // Default to user 1 for now
      
      if (!description) {
        return res.status(400).json({ error: 'Description is required' });
      }

      const rfp = await rfpService.createRFP(userId, description);
      res.status(201).json(rfp);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getRFPs(req, res) {
    try {
      const userId = req.user?.id || 1;
      const rfps = await rfpService.getRFPs(userId);
      res.json(rfps);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getRFPById(req, res) {
    try {
      const { id } = req.params;
      const rfp = await rfpService.getRFPById(id);
      
      if (!rfp) {
        return res.status(404).json({ error: 'RFP not found' });
      }
      
      res.json(rfp);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateRFP(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const rfp = await rfpService.updateRFP(id, updateData);
      res.json(rfp);
    } catch (error) {
      if (error.message === 'RFP not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async deleteRFP(req, res) {
    try {
      const { id } = req.params;
      await rfpService.deleteRFP(id);
      res.status(204).send();
    } catch (error) {
      if (error.message === 'RFP not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async sendRFP(req, res) {
    try {
      const { rfpId, vendorIds } = req.body;
      
      if (!rfpId || !vendorIds || !Array.isArray(vendorIds)) {
        return res.status(400).json({ error: 'rfpId and vendorIds array are required' });
      }

      // Validate vendor IDs
      await vendorService.validateVendorIds(vendorIds);
      
      const rfpVendors = await rfpService.sendRFPToVendors(rfpId, vendorIds);
      res.json({ message: 'RFP sent successfully', rfpVendors });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getRFPVendors(req, res) {
    try {
      const { id } = req.params;
      const vendors = await rfpService.getRFPVendors(id);
      res.json(vendors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getRFPProposals(req, res) {
    try {
      const { id } = req.params;
      const proposals = await rfpService.getRFPProposals(id);
      res.json(proposals);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async compareProposals(req, res) {
    try {
      const { id } = req.params;
      console.log('Comparing proposals for RFP:', id);
      const comparison = await rfpService.compareProposals(id);
      res.json(comparison);
    } catch (error) {
      console.error('Controller error:', error.message);
      res.status(500).json({ error: error.message, details: error.stack });
    }
  }
}

module.exports = new RFPController();