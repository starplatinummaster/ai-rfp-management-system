import { useState, useEffect } from 'react';
import { rfpAPI, vendorAPI } from '../services/api';
import axios from 'axios';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const VendorSimulator = () => {
  const [rfps, setRfps] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedRFP, setSelectedRFP] = useState('');
  const [selectedVendor, setSelectedVendor] = useState('');
  const [proposalText, setProposalText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [rfpsRes, vendorsRes] = await Promise.all([
        rfpAPI.getAll(),
        vendorAPI.getAll()
      ]);
      setRfps(rfpsRes.data.filter(r => r.status === 'sent'));
      setVendors(vendorsRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRFP || !selectedVendor || !proposalText) {
      alert('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const vendor = vendors.find(v => v.id === parseInt(selectedVendor));
      await axios.post('http://localhost:5000/api/email/inbound', {
        from: vendor.email,
        subject: `Re: RFP ${selectedRFP} - Proposal from ${vendor.name}`,
        text: `RFP ID: ${selectedRFP}, Vendor ID: ${selectedVendor}\n\n${proposalText}`,
        html: null,
        attachments: []
      });
      
      alert('Proposal submitted successfully!');
      setProposalText('');
      setSelectedRFP('');
      setSelectedVendor('');
    } catch (error) {
      alert('Failed to submit proposal: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const fillSampleProposal = () => {
    setProposalText(`We can provide the requested items with the following terms:

Pricing: Total cost $45,000 ($1,800 per unit for 25 laptops)
Delivery: 21 days from order confirmation
Payment Terms: Net 30 days
Warranty: 3-year comprehensive warranty
Specifications: All items meet or exceed your requirements

Please let us know if you need any clarification.`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🎭 Vendor Simulator</h1>
        <p className="text-gray-600">Simulate vendor proposal submissions for testing</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select RFP
            </label>
            <select
              value={selectedRFP}
              onChange={(e) => setSelectedRFP(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">-- Choose RFP --</option>
              {rfps.map(rfp => (
                <option key={rfp.id} value={rfp.id}>
                  RFP #{rfp.id} - {rfp.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Vendor (Simulate as)
            </label>
            <select
              value={selectedVendor}
              onChange={(e) => setSelectedVendor(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">-- Choose Vendor --</option>
              {vendors.map(vendor => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name} ({vendor.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                Proposal Content
              </label>
              <button
                type="button"
                onClick={fillSampleProposal}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                Fill Sample
              </button>
            </div>
            <textarea
              value={proposalText}
              onChange={(e) => setProposalText(e.target.value)}
              rows={10}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter vendor proposal details (pricing, timeline, terms, etc.)"
              required
            />
            <p className="text-xs text-gray-500 mt-2">
              Tip: Include pricing, delivery timeline, payment terms, and warranty information
            </p>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Proposal'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setSelectedRFP('');
                setSelectedVendor('');
                setProposalText('');
              }}
            >
              Clear
            </Button>
          </div>
        </form>
      </Card>

      <Card className="bg-yellow-50">
        <h3 className="text-lg font-bold text-gray-800 mb-2">ℹ️ How to Use</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Select an RFP that has been sent to vendors (status: SENT)</li>
          <li>Choose which vendor you want to simulate</li>
          <li>Write or use sample proposal content</li>
          <li>Submit - the system will process it as if the vendor sent an email</li>
          <li>Go to "Compare" page to see AI-processed proposals</li>
        </ol>
      </Card>
    </div>
  );
};

export default VendorSimulator;
