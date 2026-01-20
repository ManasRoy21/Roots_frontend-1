import React from 'react';
import './StepIndicator.scss';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps, className = '' }) => {
  return (
    <div className={`step-indicator ${className}`} role="status" aria-live="polite">
      <span className="step-indicator-text">
        STEP {currentStep} OF {totalSteps}
      </span>
    </div>
  );
};

export default StepIndicator;