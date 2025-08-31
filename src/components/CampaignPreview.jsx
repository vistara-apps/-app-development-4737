import { Calendar, DollarSign, Target, Users, FileText, Hash } from 'lucide-react';

const CampaignPreview = ({ campaign }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const sections = [
    {
      title: 'Campaign Details',
      icon: FileText,
      items: [
        { label: 'Title', value: campaign.title || 'Not specified' },
        { label: 'Description', value: campaign.description || 'Not specified' },
        { label: 'Goals', value: campaign.goals || 'Not specified' }
      ]
    },
    {
      title: 'Target Audience',
      icon: Target,
      items: [
        { label: 'Audience', value: campaign.targetAudience || 'Not specified' }
      ]
    },
    {
      title: 'Timeline & Budget',
      icon: Calendar,
      items: [
        { label: 'Start Date', value: formatDate(campaign.startDate) },
        { label: 'End Date', value: formatDate(campaign.endDate) },
        { label: 'Budget', value: campaign.budget ? `$${parseFloat(campaign.budget).toLocaleString()}` : 'Not specified' }
      ]
    },
    {
      title: 'Content Requirements',
      icon: FileText,
      items: [
        { label: 'Requirements', value: campaign.contentRequirements || 'Not specified' },
        { label: 'Hashtags', value: campaign.hashtags || 'Not specified' },
        { label: 'Deliverables', value: campaign.deliverables && campaign.deliverables.length > 0 
          ? campaign.deliverables.join(', ') 
          : 'Not specified' 
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
        <h2 className="text-xl font-bold text-primary mb-1">{campaign.title || 'Untitled Campaign'}</h2>
        <p className="text-gray-600">{campaign.description || 'No description provided'}</p>
      </div>

      {sections.map((section, index) => {
        const Icon = section.icon;
        return (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center space-x-2 bg-gray-50 px-4 py-3 border-b border-gray-200">
              <Icon size={18} className="text-gray-500" />
              <h3 className="font-medium text-gray-700">{section.title}</h3>
            </div>
            <div className="p-4">
              <dl className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">{item.label}:</dt>
                    <dd className="text-sm text-gray-900 col-span-2">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CampaignPreview;

