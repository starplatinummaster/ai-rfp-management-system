const RFP = require('../models/RFP');
const RFPVendor = require('../models/RFPVendor');
const Vendor = require('../models/Vendor');
const aiService = require('./aiService');
const emailService = require('./emailService');

class RFPService {
  async createRFP(userId, description) {
    // Generate structured requirements using AI
    const structuredRequirements = await aiService.generateRFPStructure(description);
    
    // Extract title from description (first 50 chars)
    const title = description.substring(0, 50).trim() + (description.length > 50 ? '...' : '');
    
    const rfpData = {
      user_id: userId,
      title,
      description,
      structured_requirements: JSON.stringify(structuredRequirements),
      status: 'draft'
    };

    return await RFP.create(rfpData);
  }

  async getRFPs(userId) {
    return await RFP.findByUserId(userId);
  }

  async getRFPById(id) {
    return await RFP.findById(id);
  }

  async updateRFP(id, updateData) {
    const rfp = await RFP.findById(id);
    if (!rfp) throw new Error('RFP not found');
    
    return await rfp.update(updateData);
  }

  async deleteRFP(id) {
    const rfp = await RFP.findById(id);
    if (!rfp) throw new Error('RFP not found');
    
    await rfp.delete();
  }

  async sendRFPToVendors(rfpId, vendorIds) {
    const rfp = await RFP.findById(rfpId);
    if (!rfp) throw new Error('RFP not found');

    // Get vendor details
    const vendors = await Promise.all(
      vendorIds.map(id => Vendor.findById(id))
    );
    
    // Add RFP data to vendors for email generation
    const vendorsWithRFP = vendors.map(vendor => ({ ...vendor, rfp }));

    // Send emails to all vendors
    const emailResults = await emailService.sendBulkRFPs(rfpId, vendorsWithRFP);
    
    // Update RFP status to 'sent'
    await rfp.update({ status: 'sent' });

    return emailResults;
  }

  async getRFPVendors(rfpId) {
    return await RFPVendor.findByRfpId(rfpId);
  }

  async getRFPProposals(rfpId) {
    const rfp = await RFP.findById(rfpId);
    if (!rfp) throw new Error('RFP not found');
    
    return await rfp.getProposals();
  }

  async compareProposals(rfpId) {
    const rfp = await RFP.findById(rfpId);
    if (!rfp) throw new Error('RFP not found');
    
    const proposals = await rfp.getProposals();
    const requirements = JSON.parse(rfp.structured_requirements);
    
    if (proposals.length === 0) {
      throw new Error('No proposals found for comparison');
    }

    const comparison = await aiService.compareProposals(proposals, requirements);
    return comparison;
  }
}

module.exports = new RFPService();