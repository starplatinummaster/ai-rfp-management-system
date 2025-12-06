const vendorService = require('../services/vendorService');

class VendorController {
  async createVendor(req, res) {
    try {
      const { name, email, phone, category } = req.body;
      const userId = req.user?.id || 1; // Default to user 1 for now
      
      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
      }

      const vendorData = { user_id: userId, name, email, phone, category };
      const vendor = await vendorService.createVendor(vendorData);
      res.status(201).json(vendor);
    } catch (error) {
      if (error.message.includes('already exists')) {
        return res.status(409).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async getVendors(req, res) {
    try {
      const userId = req.user?.id || 1;
      const { category } = req.query;
      
      let vendors;
      if (category) {
        vendors = await vendorService.getVendorsByCategory(userId, category);
      } else {
        vendors = await vendorService.getVendors(userId);
      }
      
      res.json(vendors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getVendorById(req, res) {
    try {
      const { id } = req.params;
      const vendor = await vendorService.getVendorById(id);
      
      if (!vendor) {
        return res.status(404).json({ error: 'Vendor not found' });
      }
      
      res.json(vendor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateVendor(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const vendor = await vendorService.updateVendor(id, updateData);
      res.json(vendor);
    } catch (error) {
      if (error.message === 'Vendor not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async deleteVendor(req, res) {
    try {
      const { id } = req.params;
      await vendorService.deleteVendor(id);
      res.status(204).send();
    } catch (error) {
      if (error.message === 'Vendor not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new VendorController();