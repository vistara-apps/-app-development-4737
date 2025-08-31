import { useState } from 'react';
import { Calendar, DollarSign, Target, Users } from 'lucide-react';

const CampaignBriefForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    goals: initialData.goals || '',
    targetAudience: initialData.targetAudience || '',
    startDate: initialData.startDate || '',
    endDate: initialData.endDate || '',
    budget: initialData.budget || '',
    contentRequirements: initialData.contentRequirements || '',
    hashtags: initialData.hashtags || '',
    deliverables: initialData.deliverables || []
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDeliverablesChange = (e) => {
    const value = e.target.value;
    const deliverables = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({
      ...prev,
      deliverables
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Campaign title is required';
    if (!formData.description.trim()) newErrors.description = 'Campaign description is required';
    if (!formData.goals.trim()) newErrors.goals = 'Campaign goals are required';
    if (!formData.targetAudience.trim()) newErrors.targetAudience = 'Target audience is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.budget) newErrors.budget = 'Budget is required';
    
    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        budget: parseFloat(formData.budget)
      });
    }
  };

  return (
    <div className="bg-surface p-6 rounded-lg shadow-card">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary flex items-center space-x-2">
            <Target size={20} />
            <span>Campaign Details</span>
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Campaign Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter a compelling campaign title"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Campaign Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe your campaign objectives and brand message"
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Campaign Goals *
            </label>
            <input
              type="text"
              name="goals"
              value={formData.goals}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent ${
                errors.goals ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Increase brand awareness, Drive website traffic"
            />
            {errors.goals && <p className="text-red-500 text-xs mt-1">{errors.goals}</p>}
          </div>
        </div>

        {/* Audience & Targeting */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary flex items-center space-x-2">
            <Users size={20} />
            <span>Target Audience</span>
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Audience Description *
            </label>
            <input
              type="text"
              name="targetAudience"
              value={formData.targetAudience}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent ${
                errors.targetAudience ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Women 25-35, interested in fitness and wellness"
            />
            {errors.targetAudience && <p className="text-red-500 text-xs mt-1">{errors.targetAudience}</p>}
          </div>
        </div>

        {/* Timeline & Budget */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary flex items-center space-x-2">
            <Calendar size={20} />
            <span>Timeline & Budget</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent ${
                  errors.startDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date *
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent ${
                  errors.endDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Budget (USD) *
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent ${
                  errors.budget ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="5000"
                min="0"
                step="100"
              />
            </div>
            {errors.budget && <p className="text-red-500 text-xs mt-1">{errors.budget}</p>}
          </div>
        </div>

        {/* Content Requirements */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary">Content Requirements</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content Requirements
            </label>
            <textarea
              name="contentRequirements"
              value={formData.contentRequirements}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="Specify content format, style, brand guidelines, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Required Hashtags
            </label>
            <input
              type="text"
              name="hashtags"
              value={formData.hashtags}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="#yourbrand #campaign #sponsored"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deliverables (comma-separated)
            </label>
            <input
              type="text"
              value={formData.deliverables.join(', ')}
              onChange={handleDeliverablesChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="1 Instagram post, 3 Stories, 1 Reel"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex space-x-3">
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors duration-200 font-medium"
          >
            Create Campaign
          </button>
          <button
            type="button"
            className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Save as Draft
          </button>
        </div>
      </form>
    </div>
  );
};

export default CampaignBriefForm;