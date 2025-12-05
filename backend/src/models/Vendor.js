const pool = require('../database');

class Vendor {
  constructor(data = {}) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.name = data.name;
    this.email = data.email;
    this.phone = data.phone;
    this.category = data.category;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM vendors WHERE id = $1', [id]);
    return result.rows[0] ? new Vendor(result.rows[0]) : null;
  }

  static async findByUserId(userId) {
    const result = await pool.query('SELECT * FROM vendors WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return result.rows.map(row => new Vendor(row));
  }

  static async create(vendorData) {
    const { user_id, name, email, phone, category } = vendorData;
    const result = await pool.query(
      'INSERT INTO vendors (user_id, name, email, phone, category) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, name, email, phone, category]
    );
    return new Vendor(result.rows[0]);
  }

  async update(vendorData) {
    const { name, email, phone, category } = vendorData;
    const result = await pool.query(
      'UPDATE vendors SET name = $1, email = $2, phone = $3, category = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
      [name, email, phone, category, this.id]
    );
    Object.assign(this, result.rows[0]);
    return this;
  }

  async delete() {
    await pool.query('DELETE FROM vendors WHERE id = $1', [this.id]);
  }

  static async findByCategory(userId, category) {
    const result = await pool.query('SELECT * FROM vendors WHERE user_id = $1 AND category = $2', [userId, category]);
    return result.rows.map(row => new Vendor(row));
  }
}

module.exports = Vendor;