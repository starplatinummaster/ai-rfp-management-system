const RFP = require('../models/RFP');
const RFPVendor = require('../models/RFPVendor');
const Vendor = require('../models/Vendor');
const aiService = require('./aiService');
const emailService = require('./emailService');

class RFPService {
  async createRFP(userId, description) {
    // Generate structured requirements and title using AI
    const [structuredRequirements, title] = await Promise.all([
      aiService.generateRFPStructure(description),
      aiService.generateRFPTitle(description)
    ]);
    
    const rfpData = {
      user_id: userId,
      title: title.substring(0, 100), // Limit to 100 chars max
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
    
    // If description is updated, regenerate structured requirements
    if (updateData.description && updateData.description !== rfp.description) {
      const structuredRequirements = await aiService.generateRFPStructure(updateData.description);
      updateData.structured_requirements = JSON.stringify(structuredRequirements);
      
      // Archive old proposals if requested
      if (updateData.archive_proposals) {
        await this.archiveProposalsForRFP(id);
      }
    }
    
    // Remove archive_proposals flag before updating RFP
    delete updateData.archive_proposals;
    
    return await rfp.update(updateData);
  }

  async archiveProposalsForRFP(rfpId) {
    const pool = require('../database');
    
    // Add 'archived' column to proposals if it doesn't exist (migration)
    try {
      await pool.query(`
        ALTER TABLE proposals 
        ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT FALSE
      `);
      console.log('Archived column ensured in proposals table');
    } catch (error) {
      console.log('Column archived may already exist:', error.message);
    }
    
    // Mark all proposals for this RFP as archived (including NULL values)
    const result = await pool.query(
      'UPDATE proposals SET archived = TRUE WHERE rfp_id = $1 AND COALESCE(archived, FALSE) = FALSE',
      [rfpId]
    );
    
    console.log(`Archived ${result.rowCount} proposals for RFP ${rfpId}`);
    return result.rowCount;
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
    
    // Parse structured_requirements if it's a string
    const rfpData = {
      ...rfp,
      structured_requirements: typeof rfp.structured_requirements === 'string' 
        ? rfp.structured_requirements 
        : JSON.stringify(rfp.structured_requirements)
    };
    
    // Add RFP data to vendors for email generation
    const vendorsWithRFP = vendors.map(vendor => ({ 
      ...vendor, 
      rfp: rfpData
    }));

    // Send emails to all vendors
    const emailResults = await emailService.sendBulkRFPs(rfpId, vendorsWithRFP);
    
    // Update RFP status to 'sent'
    await rfp.update({ status: 'sent' });

    return emailResults;
  }

  async getRFPVendors(rfpId) {
    return await RFPVendor.findByRfpId(rfpId);
  }

  async getRFPProposals(rfpId, includeArchived = false) {
    const rfp = await RFP.findById(rfpId);
    if (!rfp) throw new Error('RFP not found');
    
    if (includeArchived) {
      const Proposal = require('../models/Proposal');
      const [active, archived] = await Promise.all([
        rfp.getProposals(),
        Proposal.findArchivedByRfpId(rfpId)
      ]);
      return { active, archived };
    }
    
    return await rfp.getProposals();
  }

  async getArchivedProposals(rfpId) {
    const rfp = await RFP.findById(rfpId);
    if (!rfp) throw new Error('RFP not found');
    
    const Proposal = require('../models/Proposal');
    return await Proposal.findArchivedByRfpId(rfpId);
  }

  async compareProposals(rfpId) {
    try {
      const rfp = await RFP.findById(rfpId);
      if (!rfp) throw new Error('RFP not found');
      
      const proposals = await rfp.getProposals();
      console.log('Proposals fetched:', proposals.length);
      
      if (proposals.length === 0) {
        return {
          summary: 'No proposals have been received yet for this RFP.',
          recommendation: null,
          rankings: [],
          proposals: []
        };
      }

      let requirements;
      try {
        requirements = typeof rfp.structured_requirements === 'string' 
          ? JSON.parse(rfp.structured_requirements) 
          : rfp.structured_requirements;
      } catch (e) {
        console.error('Failed to parse requirements:', e);
        requirements = {};
      }

      const comparison = await aiService.compareProposals(proposals, requirements);
      comparison.proposals = proposals;
      return comparison;
    } catch (error) {
      console.error('Error in compareProposals:', error.message);
      console.error('Stack:', error.stack);
      throw error;
    }
  }
}

module.exports = new RFPService();