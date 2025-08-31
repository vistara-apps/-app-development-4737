import { create } from 'zustand';
import { 
  auth, 
  userProfiles, 
  campaigns as campaignsApi, 
  influencers as influencersApi,
  campaignInfluencers,
  analytics as analyticsApi
} from '../lib/supabase';

const useStore = create((set, get) => ({
  // Auth state
  user: null,
  userProfile: null,
  userRole: 'business', // 'business' or 'influencer'
  isLoading: false,
  error: null,
  
  // Data state
  campaigns: [],
  influencers: [],
  analytics: {
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalInfluencers: 0,
    totalReach: 0,
    avgEngagementRate: 0,
    roi: 0,
    monthlyMetrics: []
  },
  
  // Auth actions
  setUser: (user) => set({ user }),
  setUserRole: (role) => set({ userRole: role }),
  
  signUp: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await auth.signUp(email, password);
      if (error) throw error;
      set({ user: data.user });
      return data;
    } catch (error) {
      set({ error: error.message });
      return { error };
    } finally {
      set({ isLoading: false });
    }
  },
  
  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await auth.signIn(email, password);
      if (error) throw error;
      set({ user: data.user });
      
      // Fetch user profile
      const { data: profile } = await userProfiles.getProfile(data.user.id);
      if (profile) {
        set({ 
          userProfile: profile,
          userRole: profile.role || 'business'
        });
      }
      
      return data;
    } catch (error) {
      set({ error: error.message });
      return { error };
    } finally {
      set({ isLoading: false });
    }
  },
  
  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await auth.signOut();
      if (error) throw error;
      set({ 
        user: null, 
        userProfile: null,
        campaigns: [],
        influencers: [],
        analytics: {
          totalCampaigns: 0,
          activeCampaigns: 0,
          totalInfluencers: 0,
          totalReach: 0,
          avgEngagementRate: 0,
          roi: 0,
          monthlyMetrics: []
        }
      });
    } catch (error) {
      set({ error: error.message });
      return { error };
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Initialize user session
  initializeSession: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await auth.getCurrentUser();
      if (error) throw error;
      
      if (data.user) {
        set({ user: data.user });
        
        // Fetch user profile
        const { data: profile } = await userProfiles.getProfile(data.user.id);
        if (profile) {
          set({ 
            userProfile: profile,
            userRole: profile.role || 'business'
          });
        }
        
        // Load user data
        await get().fetchUserData();
      }
    } catch (error) {
      console.error('Session initialization error:', error);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  
  // User profile actions
  updateProfile: async (updates) => {
    const { user } = get();
    if (!user) return { error: 'Not authenticated' };
    
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await userProfiles.updateProfile(user.id, updates);
      if (error) throw error;
      
      set({ userProfile: { ...get().userProfile, ...updates } });
      if (updates.role) {
        set({ userRole: updates.role });
      }
      
      return { data };
    } catch (error) {
      set({ error: error.message });
      return { error };
    } finally {
      set({ isLoading: false });
    }
  },
  
  createProfile: async (profile) => {
    const { user } = get();
    if (!user) return { error: 'Not authenticated' };
    
    set({ isLoading: true, error: null });
    try {
      const profileData = {
        ...profile,
        user_id: user.id
      };
      
      const { data, error } = await userProfiles.createProfile(profileData);
      if (error) throw error;
      
      set({ 
        userProfile: data[0],
        userRole: data[0].role || 'business'
      });
      
      return { data: data[0] };
    } catch (error) {
      set({ error: error.message });
      return { error };
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Fetch all user data
  fetchUserData: async () => {
    const { user, userRole } = get();
    if (!user) return;
    
    set({ isLoading: true });
    
    // Fetch campaigns
    await get().fetchCampaigns();
    
    // Fetch influencers (with different logic based on user role)
    await get().fetchInfluencers();
    
    // Fetch analytics
    await get().fetchAnalytics();
    
    set({ isLoading: false });
  },
  
  // Campaign actions
  fetchCampaigns: async () => {
    const { user } = get();
    if (!user) return { error: 'Not authenticated' };
    
    try {
      const { data, error } = await campaignsApi.getCampaigns(user.id);
      if (error) throw error;
      
      set({ campaigns: data || [] });
      return { data };
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      return { error };
    }
  },
  
  addCampaign: async (campaign) => {
    const { user } = get();
    if (!user) return { error: 'Not authenticated' };
    
    set({ isLoading: true, error: null });
    try {
      const campaignData = {
        ...campaign,
        user_id: user.id,
        campaign_id: `camp_${Date.now()}`,
      };
      
      const { data, error } = await campaignsApi.createCampaign(campaignData);
      if (error) throw error;
      
      set({ campaigns: [...get().campaigns, data[0]] });
      return { data: data[0] };
    } catch (error) {
      set({ error: error.message });
      return { error };
    } finally {
      set({ isLoading: false });
    }
  },
  
  updateCampaign: async (campaignId, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await campaignsApi.updateCampaign(campaignId, updates);
      if (error) throw error;
      
      set({
        campaigns: get().campaigns.map(campaign =>
          campaign.campaign_id === campaignId ? { ...campaign, ...updates } : campaign
        )
      });
      
      return { data };
    } catch (error) {
      set({ error: error.message });
      return { error };
    } finally {
      set({ isLoading: false });
    }
  },
  
  deleteCampaign: async (campaignId) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await campaignsApi.deleteCampaign(campaignId);
      if (error) throw error;
      
      set({
        campaigns: get().campaigns.filter(campaign => campaign.campaign_id !== campaignId)
      });
      
      return { success: true };
    } catch (error) {
      set({ error: error.message });
      return { error };
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Influencer actions
  fetchInfluencers: async (filters = {}) => {
    const { user, userRole } = get();
    
    try {
      // If user is an influencer, only fetch their own profile
      if (userRole === 'influencer') {
        const { data, error } = await influencersApi.getInfluencers({ user_id: user.id });
        if (error) throw error;
        
        set({ influencers: data || [] });
        return { data };
      } else {
        // For business users, fetch all influencers with optional filters
        const { data, error } = await influencersApi.getInfluencers(filters);
        if (error) throw error;
        
        set({ influencers: data || [] });
        return { data };
      }
    } catch (error) {
      console.error('Error fetching influencers:', error);
      return { error };
    }
  },
  
  addInfluencer: async (influencer) => {
    const { user } = get();
    if (!user) return { error: 'Not authenticated' };
    
    set({ isLoading: true, error: null });
    try {
      const influencerData = {
        ...influencer,
        user_id: user.id,
        influencer_id: `inf_${Date.now()}`,
      };
      
      const { data, error } = await influencersApi.createInfluencer(influencerData);
      if (error) throw error;
      
      set({ influencers: [...get().influencers, data[0]] });
      return { data: data[0] };
    } catch (error) {
      set({ error: error.message });
      return { error };
    } finally {
      set({ isLoading: false });
    }
  },
  
  updateInfluencer: async (influencerId, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await influencersApi.updateInfluencer(influencerId, updates);
      if (error) throw error;
      
      set({
        influencers: get().influencers.map(influencer =>
          influencer.influencer_id === influencerId ? { ...influencer, ...updates } : influencer
        )
      });
      
      return { data };
    } catch (error) {
      set({ error: error.message });
      return { error };
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Campaign-Influencer relationship actions
  assignInfluencerToCampaign: async (campaignId, influencerId, status = 'pending') => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await campaignInfluencers.assignInfluencerToCampaign(
        campaignId, 
        influencerId, 
        status
      );
      if (error) throw error;
      
      return { data };
    } catch (error) {
      set({ error: error.message });
      return { error };
    } finally {
      set({ isLoading: false });
    }
  },
  
  updateInfluencerStatus: async (campaignId, influencerId, status) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await campaignInfluencers.updateInfluencerStatus(
        campaignId, 
        influencerId, 
        status
      );
      if (error) throw error;
      
      return { data };
    } catch (error) {
      set({ error: error.message });
      return { error };
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Analytics actions
  fetchAnalytics: async () => {
    const { user } = get();
    if (!user) return { error: 'Not authenticated' };
    
    try {
      const { data, error } = await analyticsApi.getOverallAnalytics(user.id);
      if (error && error.code !== 'PGRST116') { // Ignore "no rows returned" error
        throw error;
      }
      
      // If we have analytics data, use it
      if (data) {
        // Fetch monthly metrics for charts
        const monthlyMetricsResponse = await supabase
          .from('monthly_metrics')
          .select('*')
          .eq('user_id', user.id)
          .order('year', { ascending: true })
          .order('month', { ascending: true });
          
        const monthlyMetrics = monthlyMetricsResponse.data || [];
        
        set({ 
          analytics: {
            totalCampaigns: data.total_campaigns || 0,
            activeCampaigns: data.active_campaigns || 0,
            totalInfluencers: data.total_influencers || 0,
            totalReach: data.total_reach || 0,
            avgEngagementRate: data.avg_engagement_rate || 0,
            roi: data.total_roi || 0,
            monthlyMetrics: monthlyMetrics.map(m => ({
              month: m.month,
              campaigns: m.campaigns,
              reach: m.reach,
              engagement: m.engagement
            }))
          }
        });
      } else {
        // If no analytics data exists yet, calculate from campaigns and influencers
        const { campaigns, influencers } = get();
        
        const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
        
        set({
          analytics: {
            totalCampaigns: campaigns.length,
            activeCampaigns,
            totalInfluencers: influencers.length,
            totalReach: 0, // Would need to calculate based on influencer data
            avgEngagementRate: 0, // Would need to calculate based on campaign performance
            roi: 0, // Would need real data
            monthlyMetrics: [] // Would need real data
          }
        });
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return { error };
    }
  },
}));

export default useStore;

