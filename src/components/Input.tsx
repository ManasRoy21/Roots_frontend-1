import React from 'react';
import { InputProps } from '../types/components';
import './Input.scss';

const Input: React.FC<InputProps> = ({ 
  type = 'text', 
  label, 
  placeholder = '', 
  value, 
  onChange, 
  error = null, 
  required = false,
  name,
  id,
  className = '',
  'data-testid': dataTestId
}) => {
  const inputId = id || name || label?.toLowerCase().replace(/\s+/g, '-');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };
  
  return (
    <div className={`input-wrapper ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required" aria-label="required">*</span>}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type={type}
        className={`input-field ${error ? 'input-error' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : undefined}
        data-testid={dataTestId}
      />
      {error && (
        <span id={`${inputId}-error`} className="input-error-message" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
