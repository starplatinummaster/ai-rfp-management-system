import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { rfpAPI, vendorAPI } from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRFPs: 0,
    totalVendors: 0,
    sentRFPs: 0,
    draftRFPs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [rfpsRes, vendorsRes] = await Promise.all([
        rfpAPI.getAll(),
        vendorAPI.getAll(),
      ]);

      const rfps = rfpsRes.data;
      setStats({
        totalRFPs: rfps.length,
        totalVendors: vendorsRes.data.length,
        sentRFPs: rfps.filter(r => r.status === 'sent').length,
        draftRFPs: rfps.filter(r => r.status === 'draft').length,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">Dashboard</h1>
        <p className="text-lg text-gray-600">Welcome to AI-Powered RFP Management System</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="text-4xl mb-2">📝</div>
          <div className="text-3xl font-bold">{stats.totalRFPs}</div>
          <div className="text-blue-100">Total RFPs</div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="text-4xl mb-2">👥</div>
          <div className="text-3xl font-bold">{stats.totalVendors}</div>
          <div className="text-green-100">Total Vendors</div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="text-4xl mb-2">📧</div>
          <div className="text-3xl font-bold">{stats.sentRFPs}</div>
          <div className="text-purple-100">Sent RFPs</div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="text-4xl mb-2">📄</div>
          <div className="text-3xl font-bold">{stats.draftRFPs}</div>
          <div className="text-orange-100">Draft RFPs</div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button onClick={() => navigate('/rfps')} className="w-full py-3">
            Create New RFP
          </Button>
          <Button onClick={() => navigate('/vendors')} variant="success" className="w-full py-3">
            Add Vendor
          </Button>
          <Button onClick={() => navigate('/compare')} variant="secondary" className="w-full py-3">
            Compare Proposals
          </Button>
        </div>
      </Card>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-xl transition duration-300">
          <div className="text-4xl mb-4">🤖</div>
          <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
          <p className="text-gray-600">Generate structured RFPs from natural language using AI</p>
        </Card>

        <Card className="hover:shadow-xl transition duration-300">
          <div className="text-4xl mb-4">📧</div>
          <h3 className="text-xl font-semibold mb-2">Email Automation</h3>
          <p className="text-gray-600">Automatically send RFPs and receive vendor responses</p>
        </Card>

        <Card className="hover:shadow-xl transition duration-300">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-xl font-semibold mb-2">Smart Comparison</h3>
          <p className="text-gray-600">AI-powered proposal comparison and recommendations</p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
