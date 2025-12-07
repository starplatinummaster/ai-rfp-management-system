import { useState, useEffect } from 'react';
import { rfpAPI } from '../services/api';
import axios from 'axios';
import ComparisonTable from '../components/proposal/ComparisonTable';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const ProposalComparison = () => {
  const [rfps, setRfps] = useState([]);
  const [selectedRFP, setSelectedRFP] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [archivedProposals, setArchivedProposals] = useState([]);
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
      const [proposalsRes, archivedRes, comparisonRes] = await Promise.all([
        rfpAPI.getProposals(rfpId),
        rfpAPI.getArchivedProposals(rfpId).catch(() => ({ data: [] })),
        rfpAPI.compare(rfpId).catch(() => ({ data: null })),
      ]);

      console.log('Active proposals from API:', proposalsRes.data.length, proposalsRes.data);
      console.log('Archived proposals from API:', archivedRes.data.length, archivedRes.data);

      setSelectedRFP(rfpId);
      setProposals(proposalsRes.data);
      setArchivedProposals(archivedRes.data);
      setComparison(comparisonRes.data);
    } catch (error) {
      console.error('Failed to load proposals:', error);
      alert('Failed to load proposals');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshScores = async () => {
    if (!selectedRFP) return;
    
    setLoading(true);
    try {
      await axios.post(`http://localhost:5000/api/proposals/rfp/${selectedRFP}/reprocess-all`);
      alert('Scores refreshed! Reloading...');
      // Clear state before reloading
      setProposals([]);
      setArchivedProposals([]);
      setComparison(null);
      await handleSelectRFP(selectedRFP);
    } catch (error) {
      alert('Failed to refresh scores: ' + (error.response?.data?.error || error.message));
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
        <>
          <Card className="bg-yellow-50">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-800">🔄 Refresh AI Scores</h3>
                <p className="text-sm text-gray-600">Reprocess all proposals with latest AI scoring logic</p>
              </div>
              <Button onClick={handleRefreshScores} disabled={loading}>
                {loading ? 'Refreshing...' : 'Refresh Scores'}
              </Button>
            </div>
          </Card>
          <ComparisonTable 
            proposals={proposals} 
            archivedProposals={archivedProposals}
            comparison={comparison} 
          />
        </>
      ) : null}
    </div>
  );
};

export default ProposalComparison;
