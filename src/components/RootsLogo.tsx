import React from 'react';
import rootsLogoIcon from '../assets/roots-logo.png.png';

interface RootsLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const RootsLogo: React.FC<RootsLogoProps> = ({ width = 40, height = 40, className = '' }) => {
  return (
    <img 
      src={rootsLogoIcon}
      alt="Roots Logo"
      width={width}
      height={height}
      className={className}
      style={{ display: 'block' }}
    />
  );
};

export default RootsLogo;