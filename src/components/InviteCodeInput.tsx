import React from 'react';
import './InviteCodeInput.scss';

interface InviteCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  placeholder?: string;
}

const InviteCodeInput: React.FC<InviteCodeInputProps> = ({ 
  value, 
  onChange, 
  error = null, 
  placeholder = 'Enter Invite Code (e.g. RIV-2025)' 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.toUpperCase();
    
    // Remove any characters that aren't alphanumeric or hyphen
    input = input.replace(/[^A-Z0-9-]/g, '');
    
    // Auto-format with hyphen after 3 characters if not already present
    if (input.length === 3 && !input.includes('-')) {
      input = input + '-';
    } else if (input.length > 3 && !input.includes('-')) {
      // Insert hyphen if user types without it
      input = input.slice(0, 3) + '-' + input.slice(3);
    }
    
    // Limit to 7 characters (XXX-XXX format)
    if (input.length <= 7) {
      onChange(input);
    }
  };

  const validateInviteCode = (code: string): boolean => {
    // Remove hyphen for validation
    const cleaned = code.replace(/-/g, '');
    
    // Must be exactly 6 alphanumeric characters
    return /^[A-Z0-9]{6}$/.test(cleaned);
  };

  return (
    <div className="invite-code-input-wrapper">
      <input
        type="text"
        className={`invite-code-input ${error ? 'invite-code-error' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        aria-label="Invite code"
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? 'invite-code-error' : undefined}
      />
      {error && (
        <span id="invite-code-error" className="invite-code-error-message" role="alert" aria-live="assertive">
          {error}
        </span>
      )}
    </div>
  );
};

export default InviteCodeInput;