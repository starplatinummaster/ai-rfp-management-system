import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import RFPManagement from './pages/RFPManagement';
import VendorManagement from './pages/VendorManagement';
import ProposalComparison from './pages/ProposalComparison';
import VendorSimulator from './pages/VendorSimulator';

function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700">
              🤖 AI-Powered RFP System
            </Link>
            <nav className="flex gap-2 sm:gap-4">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  location.pathname === '/'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/rfps"
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  location.pathname === '/rfps'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                RFPs
              </Link>
              <Link
                to="/vendors"
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  location.pathname === '/vendors'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Vendors
              </Link>
              <Link
                to="/compare"
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  location.pathname === '/compare'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Compare
              </Link>
              <Link
                to="/simulator"
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  location.pathname === '/simulator'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                🎭 Simulator
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/rfps" element={<RFPManagement />} />
          <Route path="/vendors" element={<VendorManagement />} />
          <Route path="/compare" element={<ProposalComparison />} />
          <Route path="/simulator" element={<VendorSimulator />} />
        </Routes>
      </main>

      <footer className="bg-white mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>AI-Powered RFP Management System | Built with React + Node.js + PostgreSQL + Groq AI</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
