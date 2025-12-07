const Proposal = require('../models/Proposal');
const RFP = require('../models/RFP');
const aiService = require('./aiService');

class ProposalService {
  async createProposal(proposalData) {
    return await Proposal.create(proposalData);
  }

  async getProposals(rfpId) {
    return await Proposal.findByRfpId(rfpId);
  }

  async getProposalById(id) {
    return await Proposal.findById(id);
  }

  async processProposal(proposalId) {
    const proposal = await Proposal.findById(proposalId);
    if (!proposal) throw new Error('Proposal not found');

    const rfp = await RFP.findById(proposal.rfp_id);
    if (!rfp) throw new Error('RFP not found');

    try {
      // Parse requirements safely
      let requirements;
      if (typeof rfp.structured_requirements === 'string') {
        requirements = JSON.parse(rfp.structured_requirements);
      } else if (typeof rfp.structured_requirements === 'object') {
        requirements = rfp.structured_requirements;
      } else {
        requirements = {};
      }

      // Parse proposal using AI
      const structuredProposal = await aiService.parseProposal(
        proposal.raw_email_content, 
        requirements
      );

      // Score the proposal
      const aiScores = await aiService.scoreProposal(structuredProposal, requirements);
      
      console.log('=== AI SCORING RESULT ===');
      console.log('Proposal ID:', proposalId);
      console.log('Structured Proposal:', JSON.stringify(structuredProposal, null, 2));
      console.log('RFP Requirements:', JSON.stringify(requirements, null, 2));
      console.log('AI Scores:', JSON.stringify(aiScores, null, 2));
      console.log('========================');

      // Update proposal with parsed data
      await proposal.update({
        structured_proposal: JSON.stringify(structuredProposal),
        ai_scores: JSON.stringify(aiScores),
        processing_status: 'completed'
      });

      return proposal;
    } catch (error) {
      console.error('Error processing proposal:', error);
      await proposal.update({ processing_status: 'failed' });
      throw error;
    }
  }

  async processPendingProposals() {
    const pendingProposals = await Proposal.findByStatus('pending');
    
    const results = await Promise.allSettled(
      pendingProposals.map(proposal => this.processProposal(proposal.id))
    );

    return results;
  }

  async deleteProposal(id) {
    const proposal = await Proposal.findById(id);
    if (!proposal) throw new Error('Proposal not found');
    
    await proposal.delete();
  }

  async reprocessProposal(id) {
    try {
      const proposal = await Proposal.findById(id);
      if (!proposal) throw new Error('Proposal not found');

      // Don't update status, just reprocess directly
      return await this.processProposal(id);
    } catch (error) {
      console.error('Reprocess error for proposal', id, ':', error.message);
      console.error('Full error:', error);
      throw error;
    }
  }

  async reprocessAllForRFP(rfpId) {
    console.log('Fetching proposals for RFP:', rfpId);
    const proposals = await Proposal.findByRfpId(rfpId);
    console.log('Found proposals:', proposals.length);
    
    const results = await Promise.allSettled(
      proposals.map(proposal => {
        console.log('Reprocessing proposal:', proposal.id);
        return this.reprocessProposal(proposal.id);
      })
    );

    return {
      total: proposals.length,
      successful: results.filter(r => r.status === 'fulfilled').length,
      failed: results.filter(r => r.status === 'rejected').length,
      results
    };
  }
}

module.exports = new ProposalService();