import { TrendingUp, Users, Target, DollarSign } from 'lucide-react';
import useStore from '../store/useStore';
import AnalyticsChart from '../components/AnalyticsChart';

const Analytics = () => {
  const { analytics } = useStore();

  const kpis = [
    {
      title: 'Total ROI',
      value: `${analytics.roi}%`,
      change: '+23%',
      changeType: 'positive',
      icon: DollarSign,
      description: 'Return on investment across all campaigns'
    },
    {
      title: 'Avg. Engagement',
      value: `${analytics.avgEngagementRate}%`,
      change: '+0.3%',
      changeType: 'positive',
      icon: TrendingUp,
      description: 'Average engagement rate across influencers'
    },
    {
      title: 'Total Reach',
      value: `${(analytics.totalReach / 1000000).toFixed(1)}M`,
      change: '+450K',
      changeType: 'positive',
      icon: Users,
      description: 'Total audience reached this month'
    },
    {
      title: 'Active Campaigns',
      value: analytics.activeCampaigns,
      change: '+2',
      changeType: 'positive',
      icon: Target,
      description: 'Currently running campaigns'
    }
  ];

  const engagementData = analytics.monthlyMetrics.map(metric => ({
    month: metric.month,
    engagement: metric.engagement,
    reach: metric.reach / 1000000 // Convert to millions
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Analytics</h1>
        <p className="text-gray-600">Track your campaign performance and ROI insights</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="bg-surface p-6 rounded-lg shadow-card">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-accent/10 p-3 rounded-lg">
                  <Icon className="text-accent" size={20} />
                </div>
                <span className={`text-sm font-medium ${
                  kpi.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {kpi.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-primary mb-1">{kpi.value}</div>
              <div className="text-sm font-medium text-gray-700 mb-1">{kpi.title}</div>
              <div className="text-xs text-gray-500">{kpi.description}</div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Performance Chart */}
        <div className="bg-surface p-6 rounded-lg shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-primary">Campaign Performance</h3>
            <select className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent">
              <option>Last 6 months</option>
              <option>Last 3 months</option>
              <option>Last month</option>
            </select>
          </div>
          <AnalyticsChart data={analytics.monthlyMetrics} />
        </div>

        {/* Engagement vs Reach */}
        <div className="bg-surface p-6 rounded-lg shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-primary">Engagement vs Reach</h3>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
                <span>Engagement</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span>Reach</span>
              </div>
            </div>
          </div>
          <AnalyticsChart data={engagementData} type="dual" />
        </div>
      </div>

      {/* Detailed Performance Table */}
      <div className="bg-surface rounded-lg shadow-card overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-primary">Monthly Performance Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaigns</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reach</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics.monthlyMetrics.map((metric, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {metric.month}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {metric.campaigns}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(metric.reach / 1000000).toFixed(1)}M
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {metric.engagement}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-accent h-2 rounded-full" 
                          style={{width: `${(metric.engagement / 6) * 100}%`}}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {metric.engagement > 5 ? 'Excellent' : metric.engagement > 3 ? 'Good' : 'Average'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;