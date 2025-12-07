import { useState, useEffect } from 'react';
import { vendorAPI } from '../../services/api';
import Button from '../common/Button';
import Input from '../common/Input';
import Card from '../common/Card';

const VendorForm = ({ onVendorCreated, onVendorUpdated, editingVendor, onCancelEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingVendor) {
      setFormData({
        name: editingVendor.name || '',
        email: editingVendor.email || '',
        phone: editingVendor.phone || '',
        category: editingVendor.category || '',
      });
    }
  }, [editingVendor]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (editingVendor && !window.confirm(`Are you sure you want to update "${editingVendor.name}"?`)) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (editingVendor) {
        const response = await vendorAPI.update(editingVendor.id, formData);
        if (onVendorUpdated) onVendorUpdated(response.data);
        alert('Vendor updated successfully!');
      } else {
        const response = await vendorAPI.create(formData);
        if (onVendorCreated) onVendorCreated(response.data);
        alert('Vendor added successfully!');
      }
      setFormData({ name: '', email: '', phone: '', category: '' });
    } catch (err) {
      setError(err.response?.data?.error || `Failed to ${editingVendor ? 'update' : 'add'} vendor`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {editingVendor ? 'Edit Vendor' : 'Add New Vendor'}
        </h2>
        {editingVendor && onCancelEdit && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setFormData({ name: '', email: '', phone: '', category: '' });
              onCancelEdit();
            }}
          >
            Cancel
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <Input
          label="Vendor Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="TechCorp Solutions"
          required
        />

        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="sales@techcorp.com"
          required
        />

        <Input
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+91-98765-43210"
        />

        <Input
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Technology"
        />

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <Button type="submit" disabled={loading}>
          {loading ? (editingVendor ? 'Updating...' : 'Adding...') : (editingVendor ? 'Update Vendor' : 'Add Vendor')}
        </Button>
      </form>
    </Card>
  );
};

export default VendorForm;
