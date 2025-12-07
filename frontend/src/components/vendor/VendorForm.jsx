import { useState } from 'react';
import { vendorAPI } from '../../services/api';
import Button from '../common/Button';
import Input from '../common/Input';
import Card from '../common/Card';

const VendorForm = ({ onVendorCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await vendorAPI.create(formData);
      setFormData({ name: '', email: '', phone: '', category: '' });
      if (onVendorCreated) onVendorCreated(response.data);
      alert('Vendor added successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add vendor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Vendor</h2>

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
          {loading ? 'Adding Vendor...' : 'Add Vendor'}
        </Button>
      </form>
    </Card>
  );
};

export default VendorForm;
