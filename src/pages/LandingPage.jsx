import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Target, Users, TrendingUp, Shield } from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: Target,
      title: 'AI-Powered Matching',
      description: 'Our AI automatically matches your campaigns with the perfect micro-influencers based on audience and performance data.'
    },
    {
      icon: Shield,
      title: 'Authenticity Verification',
      description: 'Advanced analytics to verify genuine followers and engagement, protecting your investment from fake accounts.'
    },
    {
      icon: Users,
      title: 'Campaign Management',
      description: 'Streamlined workflow for briefing, content approval, and payment processing all in one platform.'
    },
    {
      icon: TrendingUp,
      title: 'Performance Analytics',
      description: 'Real-time campaign tracking with detailed ROI insights and performance metrics.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto text-center">
      {/* Hero Section */}
      <div className="mb-16">
        <h1 className="text-5xl font-bold text-primary mb-6">
          AI-Powered Micro-Influencer
          <span className="text-accent block">Campaign Management</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Connect with pre-vetted micro-influencers and manage campaigns with AI-driven insights. 
          Perfect for businesses looking to maximize their influencer marketing ROI.
        </p>
        <div className="mb-8">
          <ConnectButton />
        </div>
        <p className="text-sm text-gray-500">
          Connect your wallet to get started with our platform
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="bg-surface p-6 rounded-lg shadow-card">
              <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Icon className="text-accent" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          );
        })}
      </div>

      {/* Pricing Section */}
      <div className="bg-surface p-8 rounded-lg shadow-card">
        <h2 className="text-2xl font-bold text-primary mb-6">Simple Pricing</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Basic</h3>
            <div className="text-3xl font-bold text-primary mb-4">$49<span className="text-sm text-gray-500">/month</span></div>
            <ul className="text-left space-y-2 text-gray-600">
              <li>• Up to 5 active campaigns</li>
              <li>• Basic AI matching</li>
              <li>• Standard analytics</li>
              <li>• Email support</li>
            </ul>
          </div>
          <div className="border-2 border-accent rounded-lg p-6 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent text-white px-3 py-1 rounded-full text-sm">
              Popular
            </div>
            <h3 className="text-lg font-semibold mb-2">Pro</h3>
            <div className="text-3xl font-bold text-primary mb-4">$99<span className="text-sm text-gray-500">/month</span></div>
            <ul className="text-left space-y-2 text-gray-600">
              <li>• Unlimited campaigns</li>
              <li>• Advanced AI matching</li>
              <li>• Full analytics suite</li>
              <li>• Priority support</li>
              <li>• Custom integrations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;