import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Target, Info } from 'lucide-react';
import useStore from '../store/useStore';
import AnalyticsChart from '../components/AnalyticsChart';
import LoadingSpinner from '../components/LoadingSpinner';
import OnboardingModal from '../components/OnboardingModal';
import Tooltip from '../components/Tooltip';
import { useToast } from '../contexts/ToastContext';

const Dashboard = () => {
  const { analytics, campaigns, influencers } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const toast = useToast();

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Check if this is the user's first visit
      const hasVisitedBefore = localStorage.getItem('hasVisitedDashboard');
      if (!hasVisitedBefore) {
        setShowOnboarding(true);
        localStorage.setItem('hasVisitedDashboard', 'true');
      }

      // Show welcome toast
      toast.success('Welcome to your dashboard!');
    }, 1000);

    return () => clearTimeout(timer);
  }, [toast]);

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
  };

  const stats = [
    {
      title: 'Total Campaigns',
      value: analytics.totalCampaigns,
      change: '+12%',
      changeType: 'positive',
      icon: Target,
      tooltip: 'Total number of campaigns created'
    },
    {
      title: 'Active Campaigns',
      value: analytics.activeCampaigns,
      change: '+8%',
      changeType: 'positive',
      icon: BarChart3,
      tooltip: 'Campaigns currently running'
    },
    {
      title: 'Total Reach',
      value: `${(analytics.totalReach / 1000000).toFixed(1)}M`,
      change: '+15%',
      changeType: 'positive',
      icon: TrendingUp,
      tooltip: 'Total audience reached across all campaigns'
    },
    {
      title: 'Avg. Engagement',
      value: `${analytics.avgEngagementRate}%`,
      change: '+3%',
      changeType: 'positive',
      icon: Users,
      tooltip: 'Average engagement rate across all influencers'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Onboarding Modal */}
      {showOnboarding && (
        <OnboardingModal isOpen={showOnboarding} onClose={handleCloseOnboarding} />
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary dark:text-primary-dark mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">Monitor your campaign performance and influencer metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-surface dark:bg-surface-dark p-4 md:p-6 rounded-lg shadow-card dark:shadow-card-dark">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="bg-accent/10 dark:bg-accent/20 p-2 md:p-3 rounded-lg">
                  <Icon className="text-accent" size={16} aria-hidden="true" />
                </div>
                <div className="flex items-center">
                  <span className={`text-xs md:text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {stat.change}
                  </span>
                  {stat.tooltip && (
                    <Tooltip content={stat.tooltip} position="top">
                      <button className="ml-1 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400" aria-label={`Info about ${stat.title}`}>
                        <Info size={14} />
                      </button>
                    </Tooltip>
                  )}
                </div>
              </div>
              <div className="text-xl md:text-2xl font-bold text-primary dark:text-primary-dark mb-1">{stat.value}</div>
              <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{stat.title}</div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface dark:bg-surface-dark p-4 md:p-6 rounded-lg shadow-card dark:shadow-card-dark">
          <h3 className="text-base md:text-lg font-semibold text-primary dark:text-primary-dark mb-3 md:mb-4">Campaign Performance</h3>
          <div className="h-64 md:h-auto">
            <AnalyticsChart data={analytics.monthlyMetrics} />
          </div>
        </div>
        
        <div className="bg-surface dark:bg-surface-dark p-4 md:p-6 rounded-lg shadow-card dark:shadow-card-dark">
          <h3 className="text-base md:text-lg font-semibold text-primary dark:text-primary-dark mb-3 md:mb-4">Recent Campaigns</h3>
          <div className="space-y-3 md:space-y-4">
            {campaigns.slice(0, 3).map((campaign) => (
              <div key={campaign.campaignId} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex-1 min-w-0 mr-2">
                  <div className="font-medium text-primary dark:text-primary-dark truncate">{campaign.title}</div>
                  <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{campaign.influencerCount} influencers</div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                  campaign.status === 'active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                }`}>
                  {campaign.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Influencers */}
      <div className="bg-surface dark:bg-surface-dark p-4 md:p-6 rounded-lg shadow-card dark:shadow-card-dark">
        <h3 className="text-base md:text-lg font-semibold text-primary dark:text-primary-dark mb-3 md:mb-4">Top Performing Influencers</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {influencers.slice(0, 3).map((influencer) => (
            <div key={influencer.influencerId} className="flex items-center space-x-2 md:space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
              <img
                src={influencer.avatar}
                alt={influencer.username}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full flex-shrink-0"
                loading="lazy"
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-primary dark:text-primary-dark truncate">{influencer.username}</div>
                <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate">
                  {(influencer.followers / 1000).toFixed(0)}K • {influencer.engagementRate}% engagement
                </div>
              </div>
              <div className="text-right whitespace-nowrap">
                <div className="text-xs md:text-sm font-medium text-accent">Score: {influencer.authenticityScore}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
