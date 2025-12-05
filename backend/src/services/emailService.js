const nodemailer = require('nodemailer');
const Imap = require('node-imap');
const { simpleParser } = require('mailparser');
const RFPVendor = require('../models/RFPVendor');
const proposalService = require('./proposalService');

class EmailService {
  constructor() {
    this.smtpTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    this.imapConfig = {
      user: process.env.IMAP_USER,
      password: process.env.IMAP_PASS,
      host: process.env.IMAP_HOST,
      port: process.env.IMAP_PORT,
      tls: true,
      tlsOptions: { rejectUnauthorized: false }
    };
  }

  async sendRFPEmail(vendor, rfp, messageId) {
    const emailContent = this.generateRFPEmailContent(rfp, vendor);
    
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: vendor.email,
      subject: `RFP: ${rfp.title}`,
      html: emailContent,
      headers: {
        'Message-ID': messageId,
        'X-RFP-ID': rfp.id,
        'X-Vendor-ID': vendor.id
      }
    };

    try {
      const result = await this.smtpTransporter.sendMail(mailOptions);
      console.log(`RFP sent to ${vendor.email}:`, result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error(`Failed to send RFP to ${vendor.email}:`, error);
      return { success: false, error: error.message };
    }
  }

  generateRFPEmailContent(rfp, vendor) {
    const requirements = JSON.parse(rfp.structured_requirements);
    
    return `
      <h2>Request for Proposal: ${rfp.title}</h2>
      <p>Dear ${vendor.name},</p>
      
      <p>We are requesting a proposal for the following requirements:</p>
      
      <h3>Description:</h3>
      <p>${rfp.description}</p>
      
      <h3>Requirements:</h3>
      <ul>
        ${requirements.items?.map(item => 
          `<li><strong>${item.name}</strong> (Qty: ${item.quantity})<br>
           Specifications: ${item.specifications}</li>`
        ).join('') || ''}
      </ul>
      
      <h3>Budget:</h3>
      <p>Maximum Budget: ${requirements.budget?.currency || 'USD'} ${requirements.budget?.max?.toLocaleString() || 'TBD'}</p>
      
      <h3>Timeline:</h3>
      <p>Deadline: ${requirements.timeline?.deadline || 'TBD'}</p>
      
      <h3>Terms:</h3>
      <ul>
        <li>Payment: ${requirements.terms?.payment || 'To be negotiated'}</li>
        <li>Warranty: ${requirements.terms?.warranty || 'Standard'}</li>
        <li>Support: ${requirements.terms?.support || 'As per agreement'}</li>
      </ul>
      
      <p>Please reply to this email with your detailed proposal including pricing, delivery timeline, and terms.</p>
      
      <p>Best regards,<br>
      RFP Management System</p>
      
      <hr>
      <small>RFP ID: ${rfp.id} | Vendor ID: ${vendor.id}</small>
    `;
  }

  startEmailMonitoring() {
    const imap = new Imap(this.imapConfig);
    
    imap.once('ready', () => {
      console.log('IMAP connection ready');
      this.monitorInbox(imap);
    });

    imap.once('error', (err) => {
      console.error('IMAP connection error:', err);
      setTimeout(() => this.startEmailMonitoring(), 30000); // Retry after 30s
    });

    imap.once('end', () => {
      console.log('IMAP connection ended');
      setTimeout(() => this.startEmailMonitoring(), 10000); // Reconnect after 10s
    });

    imap.connect();
  }

  monitorInbox(imap) {
    imap.openBox('INBOX', false, (err, box) => {
      if (err) {
        console.error('Error opening inbox:', err);
        return;
      }

      console.log('Monitoring inbox for new emails...');
      
      // Check for new emails every 30 seconds
      setInterval(() => {
        this.checkNewEmails(imap);
      }, 30000);

      // Also check immediately
      this.checkNewEmails(imap);
    });
  }

  checkNewEmails(imap) {
    imap.search(['UNSEEN'], (err, results) => {
      if (err) {
        console.error('Email search error:', err);
        return;
      }

      if (results.length === 0) return;

      console.log(`Found ${results.length} new emails`);
      
      const fetch = imap.fetch(results, { bodies: '', markSeen: true });
      
      fetch.on('message', (msg) => {
        let emailBuffer = '';
        
        msg.on('body', (stream) => {
          stream.on('data', (chunk) => {
            emailBuffer += chunk.toString('utf8');
          });
        });

        msg.once('end', async () => {
          try {
            const parsed = await simpleParser(emailBuffer);
            await this.processIncomingEmail(parsed);
          } catch (error) {
            console.error('Error processing email:', error);
          }
        });
      });

      fetch.once('error', (err) => {
        console.error('Fetch error:', err);
      });
    });
  }

  async processIncomingEmail(parsedEmail) {
    try {
      // Extract RFP and Vendor IDs from headers or subject
      const rfpId = this.extractRFPId(parsedEmail);
      const vendorId = this.extractVendorId(parsedEmail);
      
      if (!rfpId || !vendorId) {
        console.log('Email not related to RFP system, skipping...');
        return;
      }

      console.log(`Processing proposal email for RFP ${rfpId} from Vendor ${vendorId}`);

      // Create proposal from email
      const proposalData = {
        rfp_id: rfpId,
        vendor_id: vendorId,
        raw_email_content: parsedEmail.text || parsedEmail.html,
        email_subject: parsedEmail.subject,
        processing_status: 'pending'
      };

      const proposal = await proposalService.createProposal(proposalData);
      
      // Auto-process with AI
      await proposalService.processProposal(proposal.id);
      
      console.log(`Proposal ${proposal.id} created and processed successfully`);
      
    } catch (error) {
      console.error('Error processing incoming email:', error);
    }
  }

  extractRFPId(parsedEmail) {
    // Try to extract from headers first
    if (parsedEmail.headers && parsedEmail.headers['x-rfp-id']) {
      return parseInt(parsedEmail.headers['x-rfp-id']);
    }
    
    // Try to extract from subject line
    const subjectMatch = parsedEmail.subject?.match(/RFP.*?(\d+)/i);
    if (subjectMatch) {
      return parseInt(subjectMatch[1]);
    }
    
    // Try to extract from email body
    const bodyMatch = parsedEmail.text?.match(/RFP\s*ID:\s*(\d+)/i);
    if (bodyMatch) {
      return parseInt(bodyMatch[1]);
    }
    
    return null;
  }

  extractVendorId(parsedEmail) {
    // Try to extract from headers first
    if (parsedEmail.headers && parsedEmail.headers['x-vendor-id']) {
      return parseInt(parsedEmail.headers['x-vendor-id']);
    }
    
    // Try to extract from email body
    const bodyMatch = parsedEmail.text?.match(/Vendor\s*ID:\s*(\d+)/i);
    if (bodyMatch) {
      return parseInt(bodyMatch[1]);
    }
    
    // Could also match by email address against vendor database
    // This would require a database lookup
    
    return null;
  }

  async sendBulkRFPs(rfpId, vendors) {
    const results = [];
    
    for (const vendor of vendors) {
      const messageId = `rfp-${rfpId}-vendor-${vendor.id}-${Date.now()}@rfpsystem.com`;
      
      try {
        // Update RFP-Vendor relationship with message ID
        await RFPVendor.create({
          rfp_id: rfpId,
          vendor_id: vendor.id,
          email_message_id: messageId,
          email_status: 'sending'
        });

        const result = await this.sendRFPEmail(vendor, vendor.rfp, messageId);
        
        // Update status based on result
        const status = result.success ? 'sent' : 'failed';
        await RFPVendor.findByMessageId(messageId).then(rv => 
          rv?.updateStatus(status, result.messageId)
        );
        
        results.push({
          vendor_id: vendor.id,
          vendor_email: vendor.email,
          success: result.success,
          message_id: messageId,
          error: result.error
        });
        
      } catch (error) {
        console.error(`Error sending to vendor ${vendor.id}:`, error);
        results.push({
          vendor_id: vendor.id,
          vendor_email: vendor.email,
          success: false,
          error: error.message
        });
      }
    }
    
    return results;
  }

  async testEmailConnection() {
    try {
      await this.smtpTransporter.verify();
      console.log('SMTP connection successful');
      return { smtp: true };
    } catch (error) {
      console.error('SMTP connection failed:', error);
      return { smtp: false, error: error.message };
    }
  }
}

module.exports = new EmailService();