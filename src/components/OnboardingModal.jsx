import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Wallet, Target, Users, BarChart3 } from 'lucide-react';

/**
 * OnboardingModal component for guiding new users
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to call when modal is closed
 * @param {boolean} [props.isFirstVisit=true] - Whether this is the user's first visit
 * @returns {JSX.Element|null} - Rendered component or null if closed
 */
const OnboardingModal = ({ isOpen, onClose, isFirstVisit = true }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setShowModal(false);
    setTimeout(() => {
      onClose();
      setCurrentStep(0);
    }, 300);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    {
      title: 'Welcome to Influent AI',
      description: 'Your AI-powered platform for micro-influencer marketing campaigns.',
      icon: <Target size={40} className="text-accent" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Influent AI helps you connect with the perfect micro-influencers for your brand, 
            verify their authenticity, and manage your campaigns all in one place.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Let's get you started with a quick tour of the platform.
          </p>
        </div>
      )
    },
    {
      title: 'Connect Your Wallet',
      description: 'First, connect your wallet to access all features.',
      icon: <Wallet size={40} className="text-accent" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Click the "Connect Wallet" button in the top right corner to link your wallet.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            This allows you to securely manage payments and transactions within the platform.
          </p>
        </div>
      )
    },
    {
      title: 'Create Your First Campaign',
      description: 'Set up your influencer marketing campaign in minutes.',
      icon: <Target size={40} className="text-accent" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Navigate to the Campaigns page and click "Create Campaign" to get started.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Define your campaign goals, target audience, and budget, and our AI will help match you with the right influencers.
          </p>
        </div>
      )
    },
    {
      title: 'Discover Influencers',
      description: 'Browse and connect with verified micro-influencers.',
      icon: <Users size={40} className="text-accent" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Visit the Influencers page to browse our network of pre-vetted micro-influencers.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Filter by niche, platform, follower count, and more to find the perfect match for your brand.
          </p>
        </div>
      )
    },
    {
      title: 'Track Performance',
      description: 'Monitor your campaign metrics and ROI in real-time.',
      icon: <BarChart3 size={40} className="text-accent" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            The Analytics dashboard gives you real-time insights into your campaign performance.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Track engagement, reach, conversions, and ROI to optimize your influencer marketing strategy.
          </p>
        </div>
      )
    }
  ];

  if (!showModal) return null;

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="onboarding-modal" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75" 
          aria-hidden="true"
          onClick={handleClose}
        ></div>

        {/* Modal panel */}
        <div 
          className={`inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-surface dark:bg-surface-dark rounded-lg shadow-xl ${
            showModal ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="Close"
          >
            <X size={20} aria-hidden="true" />
          </button>

          {/* Step indicator */}
          <div className="flex justify-center mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 mx-1 rounded-full ${
                  index === currentStep ? 'bg-accent' : 'bg-gray-300 dark:bg-gray-600'
                }`}
                aria-hidden="true"
              ></div>
            ))}
          </div>

          {/* Step content */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              {currentStepData.icon}
            </div>
            <h3 className="text-xl font-semibold text-primary dark:text-primary-dark mb-2">
              {currentStepData.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {currentStepData.description}
            </p>
          </div>

          <div className="mt-4">
            {currentStepData.content}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary-dark'
              }`}
            >
              <ChevronLeft size={16} className="mr-1" aria-hidden="true" />
              Back
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-accent rounded-md hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
            >
              {currentStep < steps.length - 1 ? (
                <>
                  Next
                  <ChevronRight size={16} className="ml-1" aria-hidden="true" />
                </>
              ) : (
                'Get Started'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;

