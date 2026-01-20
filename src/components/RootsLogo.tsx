import React from 'react';
import rootsLogoIcon from '../assets/roots-logo.png.png';

interface RootsLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const RootsLogo: React.FC<RootsLogoProps> = ({ width, height, className = '' }) => {
  const imgProps: React.ImgHTMLAttributes<HTMLImageElement> = {
    src: rootsLogoIcon,
    alt: "Roots Logo",
    className,
    style: { display: 'block' }
  };

  // Only apply width/height if explicitly provided
  if (width !== undefined) imgProps.width = width;
  if (height !== undefined) imgProps.height = height;

  return <img {...imgProps} />;
};

export default RootsLogo;