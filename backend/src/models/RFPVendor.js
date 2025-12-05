const pool = require('../database');

class RFPVendor {
  constructor(data = {}) {
    this.id = data.id;
    this.rfp_id = data.rfp_id;
    this.vendor_id = data.vendor_id;
    this.sent_at = data.sent_at;
    this.email_status = data.email_status;
    this.email_message_id = data.email_message_id;
  }

  static async create(rfpVendorData) {
    const { rfp_id, vendor_id, email_status = 'pending', email_message_id } = rfpVendorData;
    const result = await pool.query(
      'INSERT INTO rfp_vendors (rfp_id, vendor_id, sent_at, email_status, email_message_id) VALUES ($1, $2, CURRENT_TIMESTAMP, $3, $4) RETURNING *',
      [rfp_id, vendor_id, email_status, email_message_id]
    );
    return new RFPVendor(result.rows[0]);
  }

  static async findByRfpId(rfpId) {
    const result = await pool.query(`
      SELECT rv.*, v.name as vendor_name, v.email as vendor_email 
      FROM rfp_vendors rv 
      JOIN vendors v ON rv.vendor_id = v.id 
      WHERE rv.rfp_id = $1
    `, [rfpId]);
    return result.rows.map(row => new RFPVendor(row));
  }

  async updateStatus(status, messageId = null) {
    const result = await pool.query(
      'UPDATE rfp_vendors SET email_status = $1, email_message_id = $2 WHERE id = $3 RETURNING *',
      [status, messageId, this.id]
    );
    Object.assign(this, result.rows[0]);
    return this;
  }

  static async findByMessageId(messageId) {
    const result = await pool.query('SELECT * FROM rfp_vendors WHERE email_message_id = $1', [messageId]);
    return result.rows[0] ? new RFPVendor(result.rows[0]) : null;
  }

  static async bulkCreate(rfpId, vendorIds) {
    const values = vendorIds.map((vendorId, index) => `($1, $${index + 2}, CURRENT_TIMESTAMP, 'pending')`).join(', ');
    const params = [rfpId, ...vendorIds];
    
    const result = await pool.query(
      `INSERT INTO rfp_vendors (rfp_id, vendor_id, sent_at, email_status) VALUES ${values} RETURNING *`,
      params
    );
    return result.rows.map(row => new RFPVendor(row));
  }
}

module.exports = RFPVendor;