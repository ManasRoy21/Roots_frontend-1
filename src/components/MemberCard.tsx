import React from 'react';
import { MemberCardProps } from '../types/components';
import './MemberCard.scss';

const MemberCard = React.forwardRef<HTMLDivElement, MemberCardProps>(({ 
  member, 
  relationshipLabel, 
  isRoot = false, 
  isSelected = false, 
  isHighlighted = false,
  isDimmed = false,
  onClick 
}, ref) => {
  const cardClass = [
    'member-card',
    isRoot && 'member-card-root',
    isSelected && 'member-card-selected',
    isHighlighted && 'member-card-highlighted',
    isDimmed && 'member-card-dimmed'
  ].filter(Boolean).join(' ');

  const getInitials = (): string => {
    if (!member) return '';
    const firstInitial = member.firstName?.charAt(0) || '';
    const lastInitial = member.lastName?.charAt(0) || '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  const handleClick = (): void => {
    if (onClick && member) {
      onClick(member.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if ((e.key === 'Enter' || e.key === ' ') && onClick && member) {
      e.preventDefault();
      onClick(member.id);
    }
  };

  return (
    <div 
      ref={ref}
      className={cardClass}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`${member?.firstName} ${member?.lastName}, ${relationshipLabel}`}
    >
      <div className="member-card-photo">
        {member?.photoUrl ? (
          <img 
            src={member.photoUrl} 
            alt={`${member.firstName} ${member.lastName}`}
            className="member-card-image"
            loading="lazy"
          />
        ) : (
          <div className="member-card-placeholder" aria-hidden="true">
            {getInitials()}
          </div>
        )}
      </div>
      <div className="member-card-info">
        <div className="member-card-name">
          {member?.firstName} {member?.lastName}
        </div>
        <div className="member-card-label">
          {relationshipLabel}
        </div>
      </div>
    </div>
  );
});

MemberCard.displayName = 'MemberCard';

export default MemberCard;
