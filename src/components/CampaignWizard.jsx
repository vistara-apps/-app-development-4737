import { useState, useEffect } from 'react';
import { CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import CampaignBriefForm from './CampaignBriefForm';
import CampaignPreview from './CampaignPreview';

const CampaignWizard = ({ onSubmit, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goals: '',
    targetAudience: '',
    startDate: '',
    endDate: '',
    budget: '',
    contentRequirements: '',
    hashtags: '',
    deliverables: []
  });
  const [errors, setErrors] = useState({});
  const [savedState, setSavedState] = useState(null);

  // Load saved form data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('campaignWizardData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setSavedState(parsedData);
      } catch (e) {
        console.error('Error parsing saved campaign data', e);
      }
    }
  }, []);

  // Save form data to localStorage when it changes
  useEffect(() => {
    if (Object.keys(formData).some(key => formData[key])) {
      localStorage.setItem('campaignWizardData', JSON.stringify(formData));
    }
  }, [formData]);

  const handleFormChange = (updatedData) => {
    setFormData(prev => ({ ...prev, ...updatedData }));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      // Validate first step
      const newErrors = {};
      if (!formData.title) newErrors.title = 'Title is required';
      if (!formData.description) newErrors.description = 'Description is required';
      if (!formData.goals) newErrors.goals = 'Goals are required';
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    } else if (currentStep === 2) {
      // Validate second step
      const newErrors = {};
      if (!formData.targetAudience) newErrors.targetAudience = 'Target audience is required';
      if (!formData.startDate) newErrors.startDate = 'Start date is required';
      if (!formData.endDate) newErrors.endDate = 'End date is required';
      if (!formData.budget) newErrors.budget = 'Budget is required';
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }
    
    setErrors({});
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    // Clear saved data
    localStorage.removeItem('campaignWizardData');
    
    // Submit the form
    onSubmit(formData);
  };

  const handleRestore = () => {
    if (savedState) {
      setFormData(savedState);
      setSavedState(null);
    }
  };

  const handleDiscardSaved = () => {
    localStorage.removeItem('campaignWizardData');
    setSavedState(null);
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === step 
                  ? 'bg-accent text-white' 
                  : currentStep > step 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
              }`}
            >
              {currentStep > step ? <CheckCircle size={16} /> : step}
            </div>
            {step < 3 && (
              <div 
                className={`w-16 h-1 ${
                  currentStep > step ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">Campaign Basics</h3>
            <CampaignBriefForm 
              initialData={formData}
              onChange={handleFormChange}
              errors={errors}
              step={1}
            />
          </div>
        );
      case 2:
        return (
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">Target & Timeline</h3>
            <CampaignBriefForm 
              initialData={formData}
              onChange={handleFormChange}
              errors={errors}
              step={2}
            />
          </div>
        );
      case 3:
        return (
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">Review & Submit</h3>
            <CampaignPreview campaign={formData} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-surface p-6 rounded-lg shadow-card">
      {/* Saved state notification */}
      {savedState && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-700 mb-2">You have a saved campaign draft</h4>
          <p className="text-blue-600 text-sm mb-3">
            Would you like to continue where you left off?
          </p>
          <div className="flex space-x-3">
            <button 
              onClick={handleRestore}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
            >
              Restore Draft
            </button>
            <button 
              onClick={handleDiscardSaved}
              className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300"
            >
              Discard
            </button>
          </div>
        </div>
      )}
      
      {renderStepIndicator()}
      {renderStepContent()}
      
      <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
        <div>
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          )}
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          
          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              className="flex items-center space-x-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90"
            >
              <span>Next</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90"
            >
              Create Campaign
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignWizard;

