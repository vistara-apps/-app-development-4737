import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';

/**
 * MultiStepForm component for breaking down complex forms into steps
 * 
 * @param {Object} props - Component props
 * @param {Array} props.steps - Array of step objects with title, description, and component
 * @param {Function} props.onComplete - Function to call when form is completed
 * @param {Function} [props.onCancel] - Function to call when form is cancelled
 * @param {boolean} [props.showProgress=true] - Whether to show progress indicators
 * @returns {JSX.Element} - Rendered component
 */
const MultiStepForm = ({ 
  steps, 
  onComplete, 
  onCancel,
  showProgress = true
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [visited, setVisited] = useState([0]);

  // Mark current step as visited
  useEffect(() => {
    if (!visited.includes(currentStep)) {
      setVisited([...visited, currentStep]);
    }
  }, [currentStep, visited]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (index) => {
    // Only allow clicking on visited steps or the next step
    if (visited.includes(index) || index === Math.max(...visited) + 1) {
      setCurrentStep(index);
    }
  };

  const updateFormData = (stepData) => {
    setFormData({ ...formData, ...stepData });
  };

  const updateStepValidity = (isStepValid) => {
    setIsValid(isStepValid);
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="w-full">
      {/* Progress indicators */}
      {showProgress && (
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                {/* Step indicator */}
                <div 
                  className={`flex items-center justify-center w-8 h-8 rounded-full cursor-pointer transition-colors ${
                    visited.includes(index) && index !== currentStep
                      ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
                      : index === currentStep
                        ? 'bg-accent text-white'
                        : 'bg-gray-200 text-gray-400 dark:bg-gray-700'
                  }`}
                  onClick={() => handleStepClick(index)}
                  aria-current={index === currentStep ? 'step' : undefined}
                >
                  {visited.includes(index) && index !== currentStep ? (
                    <Check size={16} aria-hidden="true" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div 
                    className={`w-12 h-1 mx-1 ${
                      visited.includes(index + 1)
                        ? 'bg-accent'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                    aria-hidden="true"
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
          
          {/* Step title */}
          <div className="mt-4 text-center">
            <h3 className="text-lg font-medium text-primary dark:text-primary-dark">
              {steps[currentStep].title}
            </h3>
            {steps[currentStep].description && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {steps[currentStep].description}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Step content */}
      <div className="mb-8">
        <CurrentStepComponent 
          formData={formData} 
          updateFormData={updateFormData}
          updateValidity={updateStepValidity}
        />
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={currentStep === 0 ? onCancel : handlePrevious}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          {currentStep === 0 ? 'Cancel' : (
            <span className="flex items-center">
              <ChevronLeft size={16} className="mr-1" aria-hidden="true" />
              Back
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!isValid}
          className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent ${
            isValid
              ? 'bg-accent hover:bg-accent/90'
              : 'bg-gray-300 cursor-not-allowed dark:bg-gray-600'
          }`}
        >
          <span className="flex items-center">
            {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
            {currentStep < steps.length - 1 && (
              <ChevronRight size={16} className="ml-1" aria-hidden="true" />
            )}
          </span>
        </button>
      </div>
    </div>
  );
};

export default MultiStepForm;

