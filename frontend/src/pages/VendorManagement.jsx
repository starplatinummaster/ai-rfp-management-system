import { useState, useEffect } from 'react';
import { vendorAPI } from '../services/api';
import VendorForm from '../components/vendor/VendorForm';
import VendorList from '../components/vendor/VendorList';

const VendorManagement = () => {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      const response = await vendorAPI.getAll();
      setVendors(response.data);
    } catch (error) {
      console.error('Failed to load vendors:', error);
    }
  };

  const handleVendorCreated = (newVendor) => {
    setVendors([newVendor, ...vendors]);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Vendor Management</h1>
        <p className="text-gray-600">Add and manage your vendors</p>
      </div>

      {/* Add Vendor Form */}
      <VendorForm onVendorCreated={handleVendorCreated} />

      {/* Vendor List */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Your Vendors ({vendors.length})
        </h2>
        <VendorList vendors={vendors} />
      </div>
    </div>
  );
};

export default VendorManagement;
