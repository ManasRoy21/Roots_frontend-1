import React from 'react';
import { SelectProps } from '../types/components';
import './Select.scss';

const Select: React.FC<SelectProps> = ({ 
  label, 
  options = [], 
  value, 
  onChange, 
  error = null, 
  placeholder = 'Select an option',
  required = false,
  name,
  id,
  className = '',
  'data-testid': dataTestId
}) => {
  const selectId = id || name || label?.toLowerCase().replace(/\s+/g, '-');
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };
  
  return (
    <div className={`select-wrapper ${className}`}>
      {label && (
        <label htmlFor={selectId} className="select-label">
          {label}
          {required && <span className="select-required" aria-label="required">*</span>}
        </label>
      )}
      <select
        id={selectId}
        name={name}
        className={`select-field ${error ? 'select-error' : ''}`}
        value={value}
        onChange={handleChange}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${selectId}-error` : undefined}
        data-testid={dataTestId}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <span id={`${selectId}-error`} className="select-error-message" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default Select;
