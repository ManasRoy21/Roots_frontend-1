import React from 'react';
import { FormErrorProps } from '../types/components';
import './FormError.scss';

const FormError: React.FC<FormErrorProps> = ({ 
  message, 
  className = '',
  'data-testid': dataTestId 
}) => {
  if (!message) return null;
  
  return (
    <div className={`form-error ${className}`} role="alert" data-testid={dataTestId}>
      <svg 
        className="form-error-icon" 
        width="16" 
        height="16" 
        viewBox="0 0 16 16" 
        fill="currentColor"
      >
        <path d="M8 0a8 8 0 100 16A8 8 0 008 0zM7 4h2v5H7V4zm0 6h2v2H7v-2z"/>
      </svg>
      <span className="form-error-message">{message}</span>
    </div>
  );
};

export default FormError;
