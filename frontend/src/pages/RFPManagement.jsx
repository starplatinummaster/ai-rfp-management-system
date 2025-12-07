import { useState, useEffect, useRef } from 'react';
import { rfpAPI, vendorAPI } from '../services/api';
import RFPCreator from '../components/rfp/RFPCreator';
import RFPList from '../components/rfp/RFPList';
import VendorList from '../components/vendor/VendorList';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const RFPManagement = () => {
  const [rfps, setRfps] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedRFP, setSelectedRFP] = useState(null);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const sendSectionRef = useRef(null);

  useEffect(() => {
    loadRFPs();
    loadVendors();
  }, []);

  const loadRFPs = async () => {
    try {
      const response = await rfpAPI.getAll();
      setRfps(response.data);
    } catch (error) {
      console.error('Failed to load RFPs:', error);
    }
  };

  const loadVendors = async () => {
    try {
      const response = await vendorAPI.getAll();
      setVendors(response.data);
    } catch (error) {
      console.error('Failed to load vendors:', error);
    }
  };

  const handleRFPCreated = (newRFP) => {
    setRfps([newRFP, ...rfps]);
  };

  const handleSelectRFP = (rfp) => {
    console.log('handleSelectRFP called with:', rfp);
    setSelectedRFP(rfp);
    setSelectedVendors([]);
    setTimeout(() => {
      sendSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSelectVendor = (vendorId) => {
    setSelectedVendors(prev =>
      prev.includes(vendorId)
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const handleSendRFP = async () => {
    if (!selectedRFP || selectedVendors.length === 0) {
      alert('Please select an RFP and at least one vendor');
      return;
    }

    setLoading(true);
    try {
      await rfpAPI.send(selectedRFP.id, selectedVendors);
      alert(`RFP sent to ${selectedVendors.length} vendor(s) successfully!`);
      setSelectedRFP(null);
      setSelectedVendors([]);
      loadRFPs();
    } catch (error) {
      alert('Failed to send RFP: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">RFP Management</h1>
        <p className="text-gray-600">Create and manage your RFPs</p>
      </div>

      {/* Create RFP */}
      <RFPCreator onRFPCreated={handleRFPCreated} />

      {/* RFP List */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your RFPs</h2>
        <RFPList rfps={rfps} onSelectRFP={handleSelectRFP} />
      </div>

      {/* Send RFP Section */}
      {selectedRFP && (
        <div ref={sendSectionRef}>
        <Card className="bg-blue-50 border-2 border-blue-500">
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-blue-800 mb-2">
              📧 Send RFP: {selectedRFP.title}
            </h3>
            <p className="text-gray-700 font-medium">Select vendors to send this RFP to:</p>
          </div>
          
          <VendorList
            vendors={vendors}
            onSelectVendor={handleSelectVendor}
            selectedVendors={selectedVendors}
          />

          <div className="mt-6 flex gap-4">
            <Button onClick={handleSendRFP} disabled={loading || selectedVendors.length === 0}>
              {loading ? 'Sending...' : `Send to ${selectedVendors.length} Vendor(s)`}
            </Button>
            <Button variant="secondary" onClick={() => setSelectedRFP(null)}>
              Cancel
            </Button>
          </div>
        </Card>
        </div>
      )}
    </div>
  );
};

export default RFPManagement;
