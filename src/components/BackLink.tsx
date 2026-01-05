import React from 'react';
import { Link } from 'react-router-dom';
import './BackLink.scss';

interface BackLinkProps {
  to?: string;
  label?: string;
}

const BackLink: React.FC<BackLinkProps> = ({ 
  to = '/dashboard', 
  label = 'Back to Dashboard' 
}) => {
  return (
    <Link 
      to={to} 
      className="back-link"
      aria-label={label}
    >
      <svg 
        className="back-link-icon" 
        width="20" 
        height="20" 
        viewBox="0 0 20 20" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path 
          d="M12.5 15L7.5 10L12.5 5" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
      <span>{label}</span>
    </Link>
  );
};

export default BackLink;