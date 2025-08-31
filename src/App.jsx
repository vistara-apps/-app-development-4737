import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { Suspense, lazy } from 'react';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';

// Lazy load pages for better performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Campaigns = lazy(() => import('./pages/Campaigns'));
const Influencers = lazy(() => import('./pages/Influencers'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Settings = lazy(() => import('./pages/Settings'));
const LandingPage = lazy(() => import('./pages/LandingPage'));

function App() {
  const { isConnected } = useAccount();

  // Loading fallback for lazy-loaded components
  const PageLoader = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
      <LoadingSpinner size="lg" />
    </div>
  );

  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <div className="min-h-screen bg-bg transition-colors duration-300">
            <Header />
            <main className="container mx-auto max-w-5xl px-4 py-6 md:py-8">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={isConnected ? <Dashboard /> : <LandingPage />} />
                  <Route path="/campaigns" element={<Campaigns />} />
                  <Route path="/influencers" element={<Influencers />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </Suspense>
            </main>
          </div>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
