import { useState, useEffect } from 'react';
import { rfpAPI } from '../../services/api';
import Button from '../common/Button';
import Card from '../common/Card';

const RFPCreator = ({ onRFPCreated, onRFPUpdated, editingRFP, onCancelEdit }) => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingRFP) {
      setDescription(editingRFP.description || '');
    }
  }, [editingRFP]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (editingRFP) {
      const confirmMessage = `⚠️ WARNING: Updating this RFP will:

1. Regenerate the RFP requirements with AI
2. Archive all existing vendor proposals for this RFP
3. Reset the comparison data

You will need to request new proposals from vendors.

Are you sure you want to update "${editingRFP.title}"?`;
      
      if (!window.confirm(confirmMessage)) {
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      if (editingRFP) {
        const response = await rfpAPI.update(editingRFP.id, { description, archive_proposals: true });
        if (onRFPUpdated) onRFPUpdated(response.data);
        alert('✅ RFP updated successfully!\n\n⚠️ Previous proposals have been archived.\n\nYou can now resend the updated RFP to vendors.');
      } else {
        const response = await rfpAPI.create(description);
        if (onRFPCreated) onRFPCreated(response.data);
        alert('RFP created successfully!');
      }
      setDescription('');
    } catch (err) {
      setError(err.response?.data?.error || `Failed to ${editingRFP ? 'update' : 'create'} RFP`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {editingRFP ? 'Edit RFP' : 'Create New RFP'}
        </h2>
        {editingRFP && onCancelEdit && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setDescription('');
              onCancelEdit();
            }}
          >
            Cancel
          </Button>
        )}
      </div>
      <p className="text-gray-600 mb-6">
        {editingRFP 
          ? 'Update the RFP description. AI will regenerate the structured requirements.'
          : 'Describe your procurement needs in natural language. AI will generate a structured RFP.'}
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
          {loading ? (editingRFP ? 'Updating...' : 'Creating...') : (editingRFP ? 'Update RFP' : 'Create RFP with AI')}
        </Button>
      </form>
    </Card>
  );
};

export default RFPCreator;
