const pool = require('../database');

class RFP {
  constructor(data = {}) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.title = data.title;
    this.description = data.description;
    this.structured_requirements = data.structured_requirements;
    this.status = data.status;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM rfps WHERE id = $1', [id]);
    return result.rows[0] ? new RFP(result.rows[0]) : null;
  }

  static async findByUserId(userId) {
    const result = await pool.query('SELECT * FROM rfps WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return result.rows.map(row => new RFP(row));
  }

  static async create(rfpData) {
    const { user_id, title, description, structured_requirements, status = 'draft' } = rfpData;
    const result = await pool.query(
      'INSERT INTO rfps (user_id, title, description, structured_requirements, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, title, description, structured_requirements, status]
    );
    return new RFP(result.rows[0]);
  }

  async update(rfpData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (rfpData.title !== undefined) {
      fields.push(`title = $${paramCount++}`);
      values.push(rfpData.title);
    }
    if (rfpData.description !== undefined) {
      fields.push(`description = $${paramCount++}`);
      values.push(rfpData.description);
    }
    if (rfpData.structured_requirements !== undefined) {
      fields.push(`structured_requirements = $${paramCount++}`);
      values.push(rfpData.structured_requirements);
    }
    if (rfpData.status !== undefined) {
      fields.push(`status = $${paramCount++}`);
      values.push(rfpData.status);
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(this.id);

    const result = await pool.query(
      `UPDATE rfps SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    Object.assign(this, result.rows[0]);
    return this;
  }

  async delete() {
    await pool.query('DELETE FROM rfps WHERE id = $1', [this.id]);
  }

  static async findByStatus(userId, status) {
    const result = await pool.query('SELECT * FROM rfps WHERE user_id = $1 AND status = $2', [userId, status]);
    return result.rows.map(row => new RFP(row));
  }

  async getVendors() {
    const result = await pool.query(`
      SELECT v.*, rv.sent_at, rv.email_status, rv.email_message_id 
      FROM vendors v 
      JOIN rfp_vendors rv ON v.id = rv.vendor_id 
      WHERE rv.rfp_id = $1
    `, [this.id]);
    return result.rows;
  }

  async getProposals() {
    const result = await pool.query('SELECT * FROM proposals WHERE rfp_id = $1', [this.id]);
    return result.rows;
  }
}

module.exports = RFP;