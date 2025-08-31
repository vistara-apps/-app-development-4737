# Influent AI - AI Ad Strategist

An AI-powered platform that helps businesses connect with pre-vetted micro-influencers and manage campaigns using intuitive tools designed for non-experts.

## Supabase Backend Setup

This project uses Supabase as its backend service. Follow these steps to set up your Supabase backend:

### 1. Create a Supabase Project

1. Sign up or log in to [Supabase](https://supabase.com/)
2. Create a new project
3. Note your project URL and anon key (you'll need these later)

### 2. Set Up Database Schema

You can set up the database schema in two ways:

#### Option 1: Using the SQL Editor

1. Go to the SQL Editor in your Supabase dashboard
2. Copy the contents of `supabase/migrations/20250831_initial_schema.sql`
3. Paste into the SQL Editor and run the script

#### Option 2: Using Supabase CLI (Recommended for Development)

1. Install the Supabase CLI: `npm install -g supabase`
2. Login to Supabase: `supabase login`
3. Link your project: `supabase link --project-ref your-project-ref`
4. Push the migrations: `supabase db push`

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env.local`
2. Update the values with your Supabase project URL and anon key:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 4. Enable Authentication

1. In your Supabase dashboard, go to Authentication > Settings
2. Configure your authentication providers (Email, OAuth, etc.)
3. Set up any email templates if needed

## Database Schema

The application uses the following tables:

- `user_profiles`: Stores user profile information
- `campaigns`: Stores campaign details
- `influencers`: Stores influencer profiles
- `campaign_influencers`: Junction table for campaigns and influencers
- `campaign_analytics`: Stores analytics data for campaigns
- `influencer_analytics`: Stores analytics data for influencers
- `overall_analytics`: Stores aggregated analytics for the dashboard
- `monthly_metrics`: Stores monthly metrics for charts

## Development

1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. Open [http://localhost:5173](http://localhost:5173) in your browser

## Building for Production

1. Build the application: `npm run build`
2. Preview the production build: `npm run preview`

## Features

- Connect businesses with pre-vetted micro-influencers
- AI-powered campaign management tools
- Analytics dashboard
- Influencer discovery and vetting
- Campaign brief creation and management

