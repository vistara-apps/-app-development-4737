import { useState } from 'react';
import { Search, Filter, CheckCircle, AlertCircle, Star } from 'lucide-react';
import useStore from '../store/useStore';
import InfluencerCard from '../components/InfluencerCard';

const Influencers = () => {
  const { influencers } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [nicheFilter, setNicheFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [minFollowers, setMinFollowers] = useState('');

  const filteredInfluencers = influencers.filter(influencer => {
    const matchesSearch = influencer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         influencer.niche.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesNiche = nicheFilter === 'all' || influencer.niche === nicheFilter;
    const matchesPlatform = platformFilter === 'all' || influencer.platform === platformFilter;
    const matchesFollowers = !minFollowers || influencer.followers >= parseInt(minFollowers);
    
    return matchesSearch && matchesNiche && matchesPlatform && matchesFollowers;
  });

  const niches = [...new Set(influencers.map(inf => inf.niche))];
  const platforms = [...new Set(influencers.map(inf => inf.platform))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Influencers</h1>
        <p className="text-gray-600">Discover and connect with pre-vetted micro-influencers</p>
      </div>

      {/* Filters */}
      <div className="bg-surface p-4 rounded-lg shadow-card">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search influencers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
          
          <select
            value={nicheFilter}
            onChange={(e) => setNicheFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
          >
            <option value="all">All Niches</option>
            {niches.map(niche => (
              <option key={niche} value={niche}>{niche.charAt(0).toUpperCase() + niche.slice(1)}</option>
            ))}
          </select>
          
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
          >
            <option value="all">All Platforms</option>
            {platforms.map(platform => (
              <option key={platform} value={platform}>{platform.charAt(0).toUpperCase() + platform.slice(1)}</option>
            ))}
          </select>
          
          <input
            type="number"
            placeholder="Min followers"
            value={minFollowers}
            onChange={(e) => setMinFollowers(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
          />
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {filteredInfluencers.length} of {influencers.length} influencers
        </div>
        <div className="flex items-center space-x-2">
          <Filter size={16} className="text-gray-500" />
          <span className="text-sm text-gray-500">Sort by relevance</span>
        </div>
      </div>

      {/* Influencers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInfluencers.map((influencer) => (
          <InfluencerCard key={influencer.influencerId} influencer={influencer} />
        ))}
      </div>

      {filteredInfluencers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No influencers found</h3>
          <p className="text-gray-500">
            Try adjusting your search criteria or filters to find more influencers.
          </p>
        </div>
      )}
    </div>
  );
};

export default Influencers;