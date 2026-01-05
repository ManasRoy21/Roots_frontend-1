import React from 'react';
import { DateInputProps } from '../types/components';
import './DateInput.scss';

const DateInput: React.FC<DateInputProps> = ({ 
  value = '', 
  onChange, 
  placeholder = 'DD / MM / YYYY', 
  error = null, 
  label, 
  required = false,
  name,
  id,
  className = '',
  'data-testid': dataTestId
}) => {
  const inputId = id || name || label?.toLowerCase().replace(/\s+/g, '-');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;
    
    // Remove any non-digit characters except /
    input = input.replace(/[^\d/]/g, '');
    
    // Auto-format as user types
    if (input.length === 2 && !input.includes('/')) {
      input = input + ' / ';
    } else if (input.length === 7 && input.split('/').length === 2) {
      input = input + ' / ';
    }
    
    // Limit to DD / MM / YYYY format (14 characters)
    if (input.length <= 14 && onChange) {
      onChange(input);
    }
  };

  const validateDateFormat = (dateString: string): boolean => {
    // Remove spaces for validation
    const cleaned = dateString.replace(/\s/g, '');
    
    // Check format DD/MM/YYYY
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = cleaned.match(dateRegex);
    
    if (!match) return false;
    
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    
    // Basic validation
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    if (year < 1900 || year > 2100) return false;
    
    // Check days in month
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day > daysInMonth) return false;
    
    return true;
  };

  const handleBlur = () => {
    if (value && !validateDateFormat(value)) {
      // Optionally trigger validation error on blur
    }
  };

  return (
    <div className={`date-input-wrapper ${className}`}>
      {label && (
        <label htmlFor={inputId} className="date-input-label">
          {label}
          {required && <span className="date-input-required" aria-label="required">*</span>}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type="text"
        className={`date-input-field ${error ? 'date-input-error' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : undefined}
        data-testid={dataTestId}
      />
      {error && (
        <span id={`${inputId}-error`} className="date-input-error-message" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default DateInput;
