-- Create schema for the AI Ad strategist application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  email TEXT,
  full_name TEXT,
  company_name TEXT,
  role TEXT CHECK (role IN ('business', 'influencer', 'admin')),
  avatar_url TEXT,
  website TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  goals TEXT,
  target_audience TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')) DEFAULT 'draft',
  budget DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Influencers table
CREATE TABLE IF NOT EXISTS influencers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  influencer_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  username TEXT NOT NULL,
  platform TEXT CHECK (platform IN ('instagram', 'tiktok', 'youtube', 'twitter', 'facebook', 'linkedin', 'other')),
  followers INTEGER,
  engagement_rate DECIMAL(5, 2),
  niche TEXT,
  authenticity_score INTEGER,
  verified BOOLEAN DEFAULT FALSE,
  avatar TEXT,
  bio TEXT,
  contact_email TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaign-Influencer junction table
CREATE TABLE IF NOT EXISTS campaign_influencers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id TEXT NOT NULL REFERENCES campaigns(campaign_id) ON DELETE CASCADE,
  influencer_id TEXT NOT NULL REFERENCES influencers(influencer_id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')) DEFAULT 'pending',
  rate DECIMAL(10, 2),
  deliverables TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(campaign_id, influencer_id)
);

-- Campaign analytics table
CREATE TABLE IF NOT EXISTS campaign_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id TEXT NOT NULL REFERENCES campaigns(campaign_id) ON DELETE CASCADE,
  impressions INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,
  engagement INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5, 2),
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  roi DECIMAL(10, 2),
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Influencer analytics table
CREATE TABLE IF NOT EXISTS influencer_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  influencer_id TEXT NOT NULL REFERENCES influencers(influencer_id) ON DELETE CASCADE,
  campaign_id TEXT REFERENCES campaigns(campaign_id) ON DELETE SET NULL,
  impressions INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,
  engagement INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5, 2),
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Overall analytics table (for dashboard)
CREATE TABLE IF NOT EXISTS overall_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_campaigns INTEGER DEFAULT 0,
  active_campaigns INTEGER DEFAULT 0,
  total_influencers INTEGER DEFAULT 0,
  total_reach INTEGER DEFAULT 0,
  avg_engagement_rate DECIMAL(5, 2),
  total_roi DECIMAL(10, 2),
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Monthly metrics table (for charts)
CREATE TABLE IF NOT EXISTS monthly_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month TEXT NOT NULL,
  year INTEGER NOT NULL,
  campaigns INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,
  engagement DECIMAL(5, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, month, year)
);

-- Create RLS policies
-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE influencer_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE overall_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_metrics ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Campaigns policies
CREATE POLICY "Users can view their own campaigns"
  ON campaigns FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own campaigns"
  ON campaigns FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own campaigns"
  ON campaigns FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own campaigns"
  ON campaigns FOR DELETE
  USING (auth.uid() = user_id);

-- Influencers policies (more open for discovery)
CREATE POLICY "Anyone can view influencers"
  ON influencers FOR SELECT
  USING (true);

CREATE POLICY "Users can insert influencers linked to their account"
  ON influencers FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own influencer profile"
  ON influencers FOR UPDATE
  USING (auth.uid() = user_id);

-- Campaign-Influencer junction policies
CREATE POLICY "Users can view campaign-influencer relationships for their campaigns"
  ON campaign_influencers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM campaigns c
      WHERE c.campaign_id = campaign_influencers.campaign_id
      AND c.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM influencers i
      WHERE i.influencer_id = campaign_influencers.influencer_id
      AND i.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert campaign-influencer relationships for their campaigns"
  ON campaign_influencers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns c
      WHERE c.campaign_id = campaign_influencers.campaign_id
      AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update campaign-influencer relationships for their campaigns"
  ON campaign_influencers FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM campaigns c
      WHERE c.campaign_id = campaign_influencers.campaign_id
      AND c.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM influencers i
      WHERE i.influencer_id = campaign_influencers.influencer_id
      AND i.user_id = auth.uid()
    )
  );

-- Analytics policies
CREATE POLICY "Users can view analytics for their campaigns"
  ON campaign_analytics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM campaigns c
      WHERE c.campaign_id = campaign_analytics.campaign_id
      AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view analytics for their influencer profile"
  ON influencer_analytics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM influencers i
      WHERE i.influencer_id = influencer_analytics.influencer_id
      AND i.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM campaigns c
      WHERE c.campaign_id = influencer_analytics.campaign_id
      AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their overall analytics"
  ON overall_analytics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their monthly metrics"
  ON monthly_metrics FOR SELECT
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_influencers_user_id ON influencers(user_id);
CREATE INDEX idx_influencers_platform ON influencers(platform);
CREATE INDEX idx_influencers_niche ON influencers(niche);
CREATE INDEX idx_campaign_influencers_campaign_id ON campaign_influencers(campaign_id);
CREATE INDEX idx_campaign_influencers_influencer_id ON campaign_influencers(influencer_id);
CREATE INDEX idx_campaign_analytics_campaign_id ON campaign_analytics(campaign_id);
CREATE INDEX idx_influencer_analytics_influencer_id ON influencer_analytics(influencer_id);
CREATE INDEX idx_overall_analytics_user_id ON overall_analytics(user_id);
CREATE INDEX idx_monthly_metrics_user_id ON monthly_metrics(user_id);

