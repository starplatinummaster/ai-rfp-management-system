import { useState, useEffect } from 'react';
import { vendorAPI } from '../services/api';
import VendorForm from '../components/vendor/VendorForm';
import VendorList from '../components/vendor/VendorList';

const VendorManagement = () => {
  const [vendors, setVendors] = useState([]);
  const [editingVendor, setEditingVendor] = useState(null);

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

  const handleVendorUpdated = (updatedVendor) => {
    setVendors(vendors.map(v => v.id === updatedVendor.id ? updatedVendor : v));
    setEditingVendor(null);
  };

  const handleEdit = (vendor) => {
    setEditingVendor(vendor);
  };

  const handleDelete = async (vendor) => {
    if (!window.confirm(`Are you sure you want to delete "${vendor.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await vendorAPI.delete(vendor.id);
      setVendors(vendors.filter(v => v.id !== vendor.id));
      alert('Vendor deleted successfully!');
    } catch (error) {
      alert('Failed to delete vendor: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Vendor Management</h1>
        <p className="text-gray-600">Add and manage your vendors</p>
      </div>

      {/* Add/Edit Vendor Form */}
      <VendorForm 
        onVendorCreated={handleVendorCreated} 
        onVendorUpdated={handleVendorUpdated}
        editingVendor={editingVendor}
        onCancelEdit={() => setEditingVendor(null)}
      />

      {/* Vendor List */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Your Vendors ({vendors.length})
        </h2>
        <VendorList 
          vendors={vendors} 
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default VendorManagement;
