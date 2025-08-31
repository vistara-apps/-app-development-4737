import { create } from 'zustand';

const useStore = create((set, get) => ({
  // User data
  user: null,
  userRole: 'business', // 'business' or 'influencer'
  
  // Campaigns
  campaigns: [
    {
      campaignId: '1',
      title: 'Summer Fashion Collection',
      description: 'Promote our new summer clothing line to fashion enthusiasts',
      goals: 'Increase brand awareness and drive sales',
      targetAudience: 'Women 18-35, fashion interested',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      status: 'active',
      budget: 5000,
      influencerCount: 12
    },
    {
      campaignId: '2',
      title: 'Tech Product Launch',
      description: 'Launch our new smartwatch to tech-savvy audience',
      goals: 'Generate buzz and pre-orders',
      targetAudience: 'Tech enthusiasts 25-45',
      startDate: '2024-01-20',
      endDate: '2024-03-20',
      status: 'draft',
      budget: 8000,
      influencerCount: 8
    }
  ],
  
  // Influencers
  influencers: [
    {
      influencerId: '1',
      userId: 'user1',
      username: '@fashionista_jane',
      platform: 'instagram',
      followers: 45000,
      engagementRate: 4.2,
      niche: 'fashion',
      authenticityScore: 92,
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b152e0ec?w=100&h=100&fit=crop&crop=face'
    },
    {
      influencerId: '2',
      userId: 'user2',
      username: '@tech_reviewer',
      platform: 'youtube',
      followers: 125000,
      engagementRate: 5.8,
      niche: 'technology',
      authenticityScore: 95,
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      influencerId: '3',
      userId: 'user3',
      username: '@lifestyle_guru',
      platform: 'tiktok',
      followers: 89000,
      engagementRate: 6.1,
      niche: 'lifestyle',
      authenticityScore: 88,
      verified: false,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    }
  ],
  
  // Analytics data
  analytics: {
    totalCampaigns: 15,
    activeCampaigns: 5,
    totalInfluencers: 48,
    totalReach: 2400000,
    avgEngagementRate: 4.8,
    roi: 340,
    monthlyMetrics: [
      { month: 'Jan', campaigns: 12, reach: 1800000, engagement: 4.2 },
      { month: 'Feb', campaigns: 15, reach: 2100000, engagement: 4.5 },
      { month: 'Mar', campaigns: 18, reach: 2400000, engagement: 4.8 },
      { month: 'Apr', campaigns: 22, reach: 2800000, engagement: 5.1 },
      { month: 'May', campaigns: 20, reach: 2600000, engagement: 4.9 },
      { month: 'Jun', campaigns: 25, reach: 3200000, engagement: 5.3 }
    ]
  },
  
  // Actions
  setUser: (user) => set({ user }),
  setUserRole: (role) => set({ userRole: role }),
  
  addCampaign: (campaign) => set((state) => ({
    campaigns: [...state.campaigns, { ...campaign, campaignId: Date.now().toString() }]
  })),
  
  updateCampaign: (campaignId, updates) => set((state) => ({
    campaigns: state.campaigns.map(campaign =>
      campaign.campaignId === campaignId ? { ...campaign, ...updates } : campaign
    )
  })),
  
  addInfluencer: (influencer) => set((state) => ({
    influencers: [...state.influencers, { ...influencer, influencerId: Date.now().toString() }]
  }))
}));

export default useStore;