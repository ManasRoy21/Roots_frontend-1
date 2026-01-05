import React, { useEffect, useRef } from 'react';
import './FirstTimeTooltip.scss';

interface FirstTimeTooltipProps {
  show: boolean;
  onDismiss: () => void;
  targetRef: React.RefObject<HTMLElement>;
}

const FirstTimeTooltip: React.FC<FirstTimeTooltipProps> = ({ show, onDismiss, targetRef }) => {
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!show) return;

    const handleClickOutside = (event: MouseEvent) => {
      // Dismiss on any click
      onDismiss();
    };

    // Add click listener to document
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [show, onDismiss]);

  useEffect(() => {
    if (!show || !targetRef?.current || !tooltipRef.current) return;

    // Position tooltip above the target element
    const targetRect = targetRef.current.getBoundingClientRect();
    const tooltip = tooltipRef.current;

    // Center tooltip above the target
    const left = targetRect.left + targetRect.width / 2;
    const top = targetRect.top - 10; // 10px above the target

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }, [show, targetRef]);

  if (!show) return null;

  return (
    <div 
      ref={tooltipRef} 
      className="first-time-tooltip" 
      role="tooltip" 
      aria-label="Start building your family tree here"
    >
      <div className="tooltip-content">
        <span className="tooltip-text">Start here!</span>
      </div>
      <div className="tooltip-arrow"></div>
    </div>
  );
};

export default FirstTimeTooltip;