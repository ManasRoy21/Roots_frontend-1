import React from 'react';
import { ToggleProps } from '../types/components';
import './Toggle.scss';

const Toggle: React.FC<ToggleProps> = ({ 
  checked = false, 
  onChange, 
  label, 
  disabled = false,
  id,
  name,
  className = '',
  'data-testid': dataTestId
}) => {
  const toggleId = id || name || label?.toLowerCase().replace(/\s+/g, '-');

  const handleClick = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if ((e.key === ' ' || e.key === 'Enter') && !disabled && onChange) {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <div className={`toggle-wrapper ${className}`}>
      <button
        id={toggleId}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className={`toggle-switch ${checked ? 'toggle-checked' : ''}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        data-testid={dataTestId}
      >
        <span className="toggle-slider" aria-hidden="true" />
      </button>
      {label && (
        <label 
          htmlFor={toggleId} 
          className="toggle-label"
          onClick={handleClick}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default Toggle;
