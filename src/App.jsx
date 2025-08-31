import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { Suspense, lazy } from 'react';
import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import ToastContainer from './components/ToastContainer';
import LandingPage from './pages/LandingPage';

// Lazy load pages for better performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Campaigns = lazy(() => import('./pages/Campaigns'));
const Influencers = lazy(() => import('./pages/Influencers'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Settings = lazy(() => import('./pages/Settings'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <LoadingSpinner size="large" />
  </div>
);

function App() {
  const { isConnected } = useAccount();

  return (
    <Router>
      <div className="min-h-screen bg-bg">
        <ErrorBoundary fallbackMessage="Something went wrong with the application. Please refresh the page.">
          <Header />
          <main className="container mx-auto max-w-5xl px-4 py-8">
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={isConnected ? <Dashboard /> : <LandingPage />} />
                  <Route path="/campaigns" element={<Campaigns />} />
                  <Route path="/influencers" element={<Influencers />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </main>
          <ToastContainer />
        </ErrorBoundary>
      </div>
    </Router>
  );
}

export default App;
