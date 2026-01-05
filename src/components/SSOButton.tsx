import React from 'react';
import './SSOButton.scss';

type SSOProvider = 'google' | 'apple';

interface SSOButtonProps {
  provider: SSOProvider;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

const SSOButton: React.FC<SSOButtonProps> = ({ 
  provider, 
  onClick, 
  disabled = false,
  className = ''
}) => {
  const providerConfig = {
    google: {
      label: 'Continue with Google',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4"/>
          <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="#34A853"/>
          <path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z" fill="#FBBC05"/>
          <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z" fill="#EA4335"/>
        </svg>
      )
    },
    apple: {
      label: 'Continue with Apple',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M17.442 13.324c-.346.787-.512 1.14-.957 1.837-.623.975-1.502 2.188-2.59 2.197-0.977.008-1.24-.629-2.56-.622-1.319.007-1.61.631-2.587.623-1.088-.009-1.91-1.098-2.533-2.073-1.746-2.732-1.93-5.938-.852-7.645.768-1.216 1.98-1.928 3.118-1.928 1.16 0 1.888.631 2.845.631.928 0 1.493-.632 2.832-.632 1.012 0 2.073.551 2.832 1.502-2.488 1.367-2.084 4.929.452 6.11zM13.095 3.737c.512-.648.903-1.553.76-2.487-.824.042-1.806.572-2.376 1.262-.512.614-.944 1.527-.779 2.426.874.025 1.773-.494 2.395-1.201z"/>
        </svg>
      )
    }
  };

  const config = providerConfig[provider];
  
  return (
    <button
      type="button"
      className={`sso-button sso-button-${provider} ${disabled ? 'sso-button-disabled' : ''} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
      aria-label={config.label}
    >
      <span className="sso-button-icon">{config.icon}</span>
      <span className="sso-button-label">{config.label}</span>
    </button>
  );
};

export default SSOButton;