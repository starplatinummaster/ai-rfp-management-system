const Vendor = require('../models/Vendor');

class VendorService {
  async createVendor(vendorData) {
    return await Vendor.create(vendorData);
  }

  async getVendors(userId) {
    return await Vendor.findByUserId(userId);
  }

  async getVendorById(id) {
    return await Vendor.findById(id);
  }

  async updateVendor(id, updateData) {
    const vendor = await Vendor.findById(id);
    if (!vendor) throw new Error('Vendor not found');
    
    return await vendor.update(updateData);
  }

  async deleteVendor(id) {
    const vendor = await Vendor.findById(id);
    if (!vendor) throw new Error('Vendor not found');
    
    await vendor.delete();
  }

  async getVendorsByCategory(userId, category) {
    return await Vendor.findByCategory(userId, category);
  }

  async validateVendorIds(vendorIds) {
    const vendors = await Promise.all(
      vendorIds.map(id => Vendor.findById(id))
    );
    
    const invalidIds = vendorIds.filter((id, index) => !vendors[index]);
    if (invalidIds.length > 0) {
      throw new Error(`Invalid vendor IDs: ${invalidIds.join(', ')}`);
    }
    
    return vendors;
  }
}

module.exports = new VendorService();