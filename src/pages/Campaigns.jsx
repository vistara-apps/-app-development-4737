import { useState } from 'react';
import { Plus, Search, Filter, Calendar, DollarSign } from 'lucide-react';
import useStore from '../store/useStore';
import CampaignBriefForm from '../components/CampaignBriefForm';

const Campaigns = () => {
  const { campaigns, addCampaign, updateCampaign } = useStore();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateCampaign = (campaignData) => {
    addCampaign({
      ...campaignData,
      status: 'draft',
      influencerCount: 0
    });
    setShowCreateForm(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (showCreateForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary">Create New Campaign</h1>
          <button
            onClick={() => setShowCreateForm(false)}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
        <CampaignBriefForm onSubmit={handleCreateCampaign} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Campaigns</h1>
          <p className="text-gray-600">Manage your influencer marketing campaigns</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors duration-200"
        >
          <Plus size={16} />
          <span>Create Campaign</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-surface p-4 rounded-lg shadow-card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
            </select>
          </div>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCampaigns.map((campaign) => (
          <div key={campaign.campaignId} className="bg-surface p-6 rounded-lg shadow-card hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary line-clamp-2">{campaign.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                {campaign.status}
              </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{campaign.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Target Audience:</span>
                <span className="text-gray-700">{campaign.targetAudience}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Influencers:</span>
                <span className="text-gray-700">{campaign.influencerCount}</span>
              </div>
              {campaign.budget && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Budget:</span>
                  <span className="text-gray-700">${campaign.budget.toLocaleString()}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
              <div className="flex items-center space-x-1">
                <Calendar size={12} />
                <span>{new Date(campaign.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar size={12} />
                <span>{new Date(campaign.endDate).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button className="flex-1 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                View Details
              </button>
              {campaign.status === 'draft' && (
                <button
                  onClick={() => updateCampaign(campaign.campaignId, { status: 'active' })}
                  className="flex-1 px-3 py-2 text-sm bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors duration-200"
                >
                  Launch
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredCampaigns.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Target size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria.' 
              : 'Get started by creating your first campaign.'}
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors duration-200"
            >
              Create Your First Campaign
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Campaigns;