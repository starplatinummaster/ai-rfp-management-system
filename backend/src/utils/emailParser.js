const { simpleParser } = require('mailparser');

class EmailParser {
  static async parseEmail(rawEmail) {
    try {
      const parsed = await simpleParser(rawEmail);
      
      return {
        from: parsed.from?.text || '',
        to: parsed.to?.text || '',
        subject: parsed.subject || '',
        text: parsed.text || '',
        html: parsed.html || '',
        date: parsed.date || new Date(),
        messageId: parsed.messageId || '',
        attachments: parsed.attachments || []
      };
    } catch (error) {
      throw new Error(`Email parsing failed: ${error.message}`);
    }
  }

  static extractProposalData(emailText) {
    const data = {};
    
    // Extract pricing information
    const priceMatches = emailText.match(/\$[\d,]+(?:\.\d{2})?/g);
    if (priceMatches) {
      data.pricing = priceMatches.map(price => 
        parseFloat(price.replace(/[$,]/g, ''))
      );
    }

    // Extract delivery/timeline information
    const deliveryMatch = emailText.match(/(\d+)\s*(?:days?|weeks?|months?)/i);
    if (deliveryMatch) {
      data.delivery_time = deliveryMatch[0];
    }

    // Extract quantities
    const qtyMatch = emailText.match(/(\d+)\s*(?:units?|pieces?|items?)/i);
    if (qtyMatch) {
      data.quantity = parseInt(qtyMatch[1]);
    }

    return data;
  }

  static validateEmailSize(emailData, maxSizeMB = 5) {
    const emailSize = JSON.stringify(emailData).length;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    
    if (emailSize > maxSizeBytes) {
      throw new Error(`Email size ${(emailSize / 1024 / 1024).toFixed(2)}MB exceeds limit of ${maxSizeMB}MB`);
    }
    
    return true;
  }

  static sanitizeEmailContent(content) {
    if (typeof content !== 'string') return '';
    
    // Remove potentially dangerous content
    return content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .trim();
  }
}

module.exports = EmailParser;