import { useState } from 'react';
import { rfpAPI } from '../../services/api';
import Button from '../common/Button';
import Card from '../common/Card';

const RFPCreator = ({ onRFPCreated }) => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await rfpAPI.create(description);
      setDescription('');
      if (onRFPCreated) onRFPCreated(response.data);
      alert('RFP created successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create RFP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Create New RFP</h2>
      <p className="text-gray-600 mb-6">
        Describe your procurement needs in natural language. AI will generate a structured RFP.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            RFP Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Example: Need 25 laptops: Intel i5+, 16GB RAM, 512GB SSD. Budget Rs 42L, delivery in 30 days."
            required
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <Button type="submit" disabled={loading || !description.trim()}>
          {loading ? 'Creating RFP...' : 'Create RFP with AI'}
        </Button>
      </form>
    </Card>
  );
};

export default RFPCreator;
