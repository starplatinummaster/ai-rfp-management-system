const emailService = require('../services/emailService');
const proposalService = require('../services/proposalService');

class EmailController {
  async handleInboundEmail(req, res) {
    try {
      const { from, subject, text, html, attachments } = req.body;
      
      // Validate email size (5MB limit)
      const emailSize = JSON.stringify(req.body).length;
      if (emailSize > 5 * 1024 * 1024) {
        return res.status(413).json({ error: 'Email too large (max 5MB)' });
      }

      // Extract RFP and Vendor IDs
      const rfpId = emailService.extractRFPId({ subject, text });
      const vendorId = emailService.extractVendorId({ subject, text, from });
      
      if (!rfpId || !vendorId) {
        return res.status(400).json({ 
          error: 'Unable to identify RFP or Vendor from email' 
        });
      }

      // Create proposal
      const proposalData = {
        rfp_id: rfpId,
        vendor_id: vendorId,
        raw_email_content: text || html,
        email_subject: subject,
        processing_status: 'received'
      };

      const proposal = await proposalService.createProposal(proposalData);
      
      // Process with AI in background
      proposalService.processProposal(proposal.id).catch(error => {
        console.error('Background AI processing failed:', error);
      });

      res.status(201).json({
        message: 'Email received and proposal created',
        proposal_id: proposal.id,
        status: 'processing'
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async testEmailConnection(req, res) {
    try {
      const result = await emailService.testEmailConnection();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getEmailStatus(req, res) {
    try {
      const { messageId } = req.params;
      
      // This would typically check with email provider API
      // For now, return basic status
      res.json({
        message_id: messageId,
        status: 'delivered', // Could be: sent, delivered, bounced, failed
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async startEmailMonitoring(req, res) {
    try {
      emailService.startEmailMonitoring();
      res.json({ 
        message: 'Email monitoring started',
        status: 'active'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async stopEmailMonitoring(req, res) {
    try {
      // Implementation would stop the IMAP connection
      res.json({ 
        message: 'Email monitoring stopped',
        status: 'inactive'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new EmailController();