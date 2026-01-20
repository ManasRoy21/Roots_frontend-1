import React from 'react';
import { useNavigate } from 'react-router-dom';
import './QuickActions.scss';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  route?: string;
}

interface QuickActionsProps {
  actions?: QuickAction[];
  onActionClick?: (actionId: string) => boolean | undefined;
}

const QuickActions: React.FC<QuickActionsProps> = ({ actions = [], onActionClick }) => {
  const navigate = useNavigate();
  
  const defaultActions: QuickAction[] = [
    {
      id: 'add-relative',
      label: 'Add Relative',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
          <path d="M20 8V14M23 11H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      route: '/add-family-member',
    },
    {
      id: 'add-photo',
      label: 'Add Photo',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
          <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
          <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      route: '/upload-photos',
    },
    {
      id: 'join-tree',
      label: 'Join Tree',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2V8M12 8C9.79086 8 8 9.79086 8 12V22M12 8C14.2091 8 16 9.79086 16 12V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="12" cy="2" r="2" fill="currentColor"/>
          <circle cx="8" cy="22" r="2" fill="currentColor"/>
          <circle cx="16" cy="22" r="2" fill="currentColor"/>
        </svg>
      ),
      route: '/join-tree',
    },
    {
      id: 'new-event',
      label: 'New Event',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M16 2V6M8 2V6M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M12 14V18M10 16H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      route: '/events/new',
    },
  ];

  const displayActions = actions.length > 0 ? actions : defaultActions;

  const handleClick = (action: QuickAction) => {
    if (onActionClick) {
      const result = onActionClick(action.id);
      // If onActionClick returns false, don't navigate
      if (result === false) return;
      // If onActionClick doesn't handle it (returns undefined), navigate
      if (result === undefined && action.route) {
        navigate(action.route);
      }
    } else if (action.route) {
      navigate(action.route);
    }
  };

  return (
    <div className="quick-actions-horizontal">
      {displayActions.map((action) => (
        <button
          key={action.id}
          className="quick-action-card"
          onClick={() => handleClick(action)}
          aria-label={action.label}
        >
          <div className="quick-action-icon-circle">{action.icon}</div>
          <span className="quick-action-label">{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;