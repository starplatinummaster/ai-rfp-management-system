import { useState, useEffect } from 'react';
import { rfpAPI } from '../services/api';
import ComparisonTable from '../components/proposal/ComparisonTable';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const ProposalComparison = () => {
  const [rfps, setRfps] = useState([]);
  const [selectedRFP, setSelectedRFP] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRFPs();
  }, []);

  const loadRFPs = async () => {
    try {
      const response = await rfpAPI.getAll();
      setRfps(response.data.filter(rfp => rfp.status === 'sent'));
    } catch (error) {
      console.error('Failed to load RFPs:', error);
    }
  };

  const handleSelectRFP = async (rfpId) => {
    setLoading(true);
    try {
      const [proposalsRes, comparisonRes] = await Promise.all([
        rfpAPI.getProposals(rfpId),
        rfpAPI.compare(rfpId).catch(() => ({ data: null })),
      ]);

      setSelectedRFP(rfpId);
      setProposals(proposalsRes.data);
      setComparison(comparisonRes.data);
    } catch (error) {
      console.error('Failed to load proposals:', error);
      alert('Failed to load proposals');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Proposal Comparison</h1>
        <p className="text-gray-600">Compare vendor proposals with AI-powered insights</p>
      </div>

      {/* RFP Selection */}
      <Card>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Select RFP to Compare</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rfps.map((rfp) => (
            <Button
              key={rfp.id}
              onClick={() => handleSelectRFP(rfp.id)}
              variant={selectedRFP === rfp.id ? 'primary' : 'secondary'}
              className="w-full text-left"
            >
              <div>
                <div className="font-semibold">{rfp.title}</div>
                <div className="text-xs opacity-75">ID: {rfp.id}</div>
              </div>
            </Button>
          ))}
        </div>
        {rfps.length === 0 && (
          <p className="text-gray-500 text-center py-4">No sent RFPs found. Send an RFP first!</p>
        )}
      </Card>

      {/* Comparison Results */}
      {loading ? (
        <Card>
          <p className="text-center py-8">Loading proposals...</p>
        </Card>
      ) : selectedRFP ? (
        <ComparisonTable proposals={proposals} comparison={comparison} />
      ) : null}
    </div>
  );
};

export default ProposalComparison;
