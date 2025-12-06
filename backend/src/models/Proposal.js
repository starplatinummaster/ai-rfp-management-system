const pool = require('../database');

class Proposal {
  constructor(data = {}) {
    this.id = data.id;
    this.rfp_id = data.rfp_id;
    this.vendor_id = data.vendor_id;
    this.raw_email_content = data.raw_email_content;
    this.email_subject = data.email_subject;
    this.structured_proposal = data.structured_proposal;
    this.ai_scores = data.ai_scores;
    this.processing_status = data.processing_status;
    this.received_at = data.received_at;
    this.processed_at = data.processed_at;
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM proposals WHERE id = $1', [id]);
    return result.rows[0] ? new Proposal(result.rows[0]) : null;
  }

  static async findByRfpId(rfpId) {
    const result = await pool.query(`
      SELECT p.*, v.name as vendor_name, v.email as vendor_email 
      FROM proposals p 
      JOIN vendors v ON p.vendor_id = v.id 
      WHERE p.rfp_id = $1 
      ORDER BY p.received_at DESC
    `, [rfpId]);
    return result.rows.map(row => new Proposal(row));
  }

  static async create(proposalData) {
    const { rfp_id, vendor_id, raw_email_content, email_subject, processing_status = 'received' } = proposalData;
    const result = await pool.query(
      'INSERT INTO proposals (rfp_id, vendor_id, raw_email_content, email_subject, processing_status, received_at) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) RETURNING *',
      [rfp_id, vendor_id, raw_email_content, email_subject, processing_status]
    );
    return new Proposal(result.rows[0]);
  }

  async update(proposalData) {
    const { structured_proposal, ai_scores, processing_status } = proposalData;
    const result = await pool.query(
      'UPDATE proposals SET structured_proposal = $1, ai_scores = $2, processing_status = $3, processed_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [structured_proposal, ai_scores, processing_status, this.id]
    );
    Object.assign(this, result.rows[0]);
    return this;
  }

  async delete() {
    await pool.query('DELETE FROM proposals WHERE id = $1', [this.id]);
  }

  static async findByStatus(status) {
    const result = await pool.query('SELECT * FROM proposals WHERE processing_status = $1', [status]);
    return result.rows.map(row => new Proposal(row));
  }

  static async findByVendorId(vendorId) {
    const result = await pool.query('SELECT * FROM proposals WHERE vendor_id = $1', [vendorId]);
    return result.rows.map(row => new Proposal(row));
  }
}

module.exports = Proposal;