import React from 'react';
import { ButtonProps } from '../types/components';
import './Button.scss';

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'medium', 
  onClick, 
  disabled = false, 
  children,
  type = 'button',
  className = '',
  'aria-label': ariaLabel,
  'data-testid': dataTestId
}) => {
  const buttonClass = `btn btn-${variant} btn-${size} ${disabled ? 'btn-disabled' : ''} ${className}`.trim();
  
  return (
    <button 
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      data-testid={dataTestId}
    >
      {children}
    </button>
  );
};

export default Button;
