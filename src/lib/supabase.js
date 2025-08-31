import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase URL or Anon Key. Make sure to set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database schema:
// - users: Stores user information
// - campaigns: Stores campaign information
// - influencers: Stores influencer profiles
// - campaign_influencers: Junction table for campaigns and influencers
// - analytics: Stores analytics data

// Auth functions
export const auth = {
  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    return { data, error };
  },
};

// User profile functions
export const userProfiles = {
  getProfile: async (userId) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    return { data, error };
  },

  updateProfile: async (userId, updates) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', userId);
    return { data, error };
  },

  createProfile: async (profile) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([profile]);
    return { data, error };
  },
};

// Campaign functions
export const campaigns = {
  getCampaigns: async (userId) => {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', userId);
    return { data, error };
  },

  getCampaign: async (campaignId) => {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('campaign_id', campaignId)
      .single();
    return { data, error };
  },

  createCampaign: async (campaign) => {
    const { data, error } = await supabase
      .from('campaigns')
      .insert([campaign]);
    return { data, error };
  },

  updateCampaign: async (campaignId, updates) => {
    const { data, error } = await supabase
      .from('campaigns')
      .update(updates)
      .eq('campaign_id', campaignId);
    return { data, error };
  },

  deleteCampaign: async (campaignId) => {
    const { data, error } = await supabase
      .from('campaigns')
      .delete()
      .eq('campaign_id', campaignId);
    return { data, error };
  },
};

// Influencer functions
export const influencers = {
  getInfluencers: async (filters = {}) => {
    let query = supabase.from('influencers').select('*');
    
    // Apply filters if provided
    if (filters.niche) {
      query = query.eq('niche', filters.niche);
    }
    if (filters.platform) {
      query = query.eq('platform', filters.platform);
    }
    if (filters.minFollowers) {
      query = query.gte('followers', filters.minFollowers);
    }
    if (filters.maxFollowers) {
      query = query.lte('followers', filters.maxFollowers);
    }
    if (filters.minEngagementRate) {
      query = query.gte('engagement_rate', filters.minEngagementRate);
    }
    if (filters.verified !== undefined) {
      query = query.eq('verified', filters.verified);
    }
    
    const { data, error } = await query;
    return { data, error };
  },

  getInfluencer: async (influencerId) => {
    const { data, error } = await supabase
      .from('influencers')
      .select('*')
      .eq('influencer_id', influencerId)
      .single();
    return { data, error };
  },

  createInfluencer: async (influencer) => {
    const { data, error } = await supabase
      .from('influencers')
      .insert([influencer]);
    return { data, error };
  },

  updateInfluencer: async (influencerId, updates) => {
    const { data, error } = await supabase
      .from('influencers')
      .update(updates)
      .eq('influencer_id', influencerId);
    return { data, error };
  },

  deleteInfluencer: async (influencerId) => {
    const { data, error } = await supabase
      .from('influencers')
      .delete()
      .eq('influencer_id', influencerId);
    return { data, error };
  },
};

// Campaign-Influencer relationship functions
export const campaignInfluencers = {
  assignInfluencerToCampaign: async (campaignId, influencerId, status = 'pending') => {
    const { data, error } = await supabase
      .from('campaign_influencers')
      .insert([{
        campaign_id: campaignId,
        influencer_id: influencerId,
        status,
      }]);
    return { data, error };
  },

  updateInfluencerStatus: async (campaignId, influencerId, status) => {
    const { data, error } = await supabase
      .from('campaign_influencers')
      .update({ status })
      .eq('campaign_id', campaignId)
      .eq('influencer_id', influencerId);
    return { data, error };
  },

  removeInfluencerFromCampaign: async (campaignId, influencerId) => {
    const { data, error } = await supabase
      .from('campaign_influencers')
      .delete()
      .eq('campaign_id', campaignId)
      .eq('influencer_id', influencerId);
    return { data, error };
  },

  getCampaignInfluencers: async (campaignId) => {
    const { data, error } = await supabase
      .from('campaign_influencers')
      .select(`
        *,
        influencers:influencer_id(*)
      `)
      .eq('campaign_id', campaignId);
    return { data, error };
  },

  getInfluencerCampaigns: async (influencerId) => {
    const { data, error } = await supabase
      .from('campaign_influencers')
      .select(`
        *,
        campaigns:campaign_id(*)
      `)
      .eq('influencer_id', influencerId);
    return { data, error };
  },
};

// Analytics functions
export const analytics = {
  getCampaignAnalytics: async (campaignId) => {
    const { data, error } = await supabase
      .from('campaign_analytics')
      .select('*')
      .eq('campaign_id', campaignId);
    return { data, error };
  },

  getInfluencerAnalytics: async (influencerId) => {
    const { data, error } = await supabase
      .from('influencer_analytics')
      .select('*')
      .eq('influencer_id', influencerId);
    return { data, error };
  },

  getOverallAnalytics: async (userId) => {
    const { data, error } = await supabase
      .from('overall_analytics')
      .select('*')
      .eq('user_id', userId)
      .single();
    return { data, error };
  },

  updateCampaignAnalytics: async (campaignId, metrics) => {
    const { data, error } = await supabase
      .from('campaign_analytics')
      .upsert([{
        campaign_id: campaignId,
        ...metrics,
      }]);
    return { data, error };
  },
};

