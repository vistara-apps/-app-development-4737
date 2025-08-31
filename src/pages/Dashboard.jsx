import { BarChart3, TrendingUp, Users, Target } from 'lucide-react';
import useStore from '../store/useStore';
import AnalyticsChart from '../components/AnalyticsChart';

const Dashboard = () => {
  const { analytics, campaigns, influencers } = useStore();

  const stats = [
    {
      title: 'Total Campaigns',
      value: analytics.totalCampaigns,
      change: '+12%',
      changeType: 'positive',
      icon: Target
    },
    {
      title: 'Active Campaigns',
      value: analytics.activeCampaigns,
      change: '+8%',
      changeType: 'positive',
      icon: BarChart3
    },
    {
      title: 'Total Reach',
      value: `${(analytics.totalReach / 1000000).toFixed(1)}M`,
      change: '+15%',
      changeType: 'positive',
      icon: TrendingUp
    },
    {
      title: 'Avg. Engagement',
      value: `${analytics.avgEngagementRate}%`,
      change: '+3%',
      changeType: 'positive',
      icon: Users
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Dashboard</h1>
        <p className="text-gray-600">Monitor your campaign performance and influencer metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-surface p-6 rounded-lg shadow-card">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-accent/10 p-3 rounded-lg">
                  <Icon className="text-accent" size={20} />
                </div>
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.title}</div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface p-6 rounded-lg shadow-card">
          <h3 className="text-lg font-semibold text-primary mb-4">Campaign Performance</h3>
          <AnalyticsChart data={analytics.monthlyMetrics} />
        </div>
        
        <div className="bg-surface p-6 rounded-lg shadow-card">
          <h3 className="text-lg font-semibold text-primary mb-4">Recent Campaigns</h3>
          <div className="space-y-4">
            {campaigns.slice(0, 3).map((campaign) => (
              <div key={campaign.campaignId} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <div className="font-medium text-primary">{campaign.title}</div>
                  <div className="text-sm text-gray-500">{campaign.influencerCount} influencers</div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  campaign.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {campaign.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Influencers */}
      <div className="bg-surface p-6 rounded-lg shadow-card">
        <h3 className="text-lg font-semibold text-primary mb-4">Top Performing Influencers</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {influencers.slice(0, 3).map((influencer) => (
            <div key={influencer.influencerId} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
              <img
                src={influencer.avatar}
                alt={influencer.username}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="font-medium text-primary">{influencer.username}</div>
                <div className="text-sm text-gray-500">
                  {(influencer.followers / 1000).toFixed(0)}K • {influencer.engagementRate}% engagement
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-accent">Score: {influencer.authenticityScore}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;