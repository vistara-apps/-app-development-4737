import { CheckCircle, AlertCircle, Star, Instagram, Youtube, TikTok } from 'lucide-react';

const InfluencerCard = ({ influencer, variant = 'basic' }) => {
  const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return Instagram;
      case 'youtube': return Youtube;
      case 'tiktok': return TikTok;
      default: return Star;
    }
  };

  const getAuthenticityColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAuthenticityBg = (score) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 75) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getEngagementQuality = (rate) => {
    if (rate > 5) return { text: 'Excellent', color: 'bg-green-500' };
    if (rate > 3) return { text: 'Good', color: 'bg-yellow-500' };
    return { text: 'Average', color: 'bg-red-500' };
  };

  const PlatformIcon = getPlatformIcon(influencer.platform);
  const engagementQuality = getEngagementQuality(influencer.engagementRate);

  return (
    <div className="bg-surface p-4 md:p-6 rounded-lg shadow-card hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="flex flex-wrap sm:flex-nowrap items-start justify-between mb-4">
        <div className="flex items-center space-x-3 mb-2 sm:mb-0 w-full sm:w-auto">
          <img
            src={influencer.avatar}
            alt={influencer.username}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full flex-shrink-0"
            loading="lazy"
          />
          <div className="min-w-0">
            <div className="font-semibold text-primary flex items-center space-x-2">
              <span className="truncate">{influencer.username}</span>
              {influencer.verified && (
                <CheckCircle size={16} className="text-blue-500 flex-shrink-0" aria-label="Verified account" />
              )}
            </div>
            <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-500">
              <PlatformIcon size={14} aria-hidden="true" />
              <span className="capitalize">{influencer.platform}</span>
              <span aria-hidden="true">•</span>
              <span className="capitalize">{influencer.niche}</span>
            </div>
          </div>
        </div>
        
        <div className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getAuthenticityBg(influencer.authenticityScore)} ${getAuthenticityColor(influencer.authenticityScore)}`}>
          {influencer.authenticityScore}% authentic
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <div className="text-base md:text-lg font-bold text-primary">
            {influencer.followers >= 1000000 
              ? `${(influencer.followers / 1000000).toFixed(1)}M`
              : `${(influencer.followers / 1000).toFixed(0)}K`}
          </div>
          <div className="text-xs text-gray-500">Followers</div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <div className="text-base md:text-lg font-bold text-primary">{influencer.engagementRate}%</div>
          <div className="text-xs text-gray-500">Engagement</div>
        </div>
      </div>

      {/* Engagement Rate Indicator */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>Engagement Quality</span>
          <span>{engagementQuality.text}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2" role="progressbar" aria-valuenow={influencer.engagementRate * 10} aria-valuemin="0" aria-valuemax="100">
          <div 
            className={`h-2 rounded-full ${engagementQuality.color}`}
            style={{width: `${Math.min(influencer.engagementRate * 10, 100)}%`}}
          ></div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button 
          className="w-full px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50"
          aria-label={`View ${influencer.username}'s profile`}
        >
          View Profile
        </button>
        <button 
          className="w-full px-3 py-2 text-sm bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50"
          aria-label={`Invite ${influencer.username} to campaign`}
        >
          Invite
        </button>
      </div>

      {variant === 'detailed' && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            <div className="mb-2">
              <span className="font-medium">Recent Performance:</span>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex-1 bg-gray-200 rounded-full h-1" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
                  <div className="bg-accent h-1 rounded-full" style={{width: '75%'}}></div>
                </div>
                <span className="text-xs whitespace-nowrap">75% avg. reach</span>
              </div>
            </div>
            <div>
              <span className="font-medium">Best Content Types:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                <span className="px-2 py-1 bg-gray-100 text-xs rounded">Photo</span>
                <span className="px-2 py-1 bg-gray-100 text-xs rounded">Story</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfluencerCard;
