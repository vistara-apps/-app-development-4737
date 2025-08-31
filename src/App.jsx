import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Campaigns from './pages/Campaigns';
import Influencers from './pages/Influencers';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import LandingPage from './pages/LandingPage';
import useStore from './store/useStore';

function App() {
  const { isConnected } = useAccount();
  const { initializeSession } = useStore();

  // Initialize Supabase session when app loads
  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  return (
    <Router>
      <div className="min-h-screen bg-bg">
        <Header />
        <main className="container mx-auto max-w-5xl px-4 py-8">
          <Routes>
            <Route path="/" element={isConnected ? <Dashboard /> : <LandingPage />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/influencers" element={<Influencers />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

