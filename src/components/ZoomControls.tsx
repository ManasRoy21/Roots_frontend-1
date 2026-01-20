import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectZoomLevel, zoomIn, zoomOut } from '../redux/slices/treeSlice';
import './ZoomControls.scss';
import { AppDispatch } from '../redux/store';

// Extend Document interface to include vendor-prefixed fullscreen methods
declare global {
  interface Document {
    webkitExitFullscreen?: () => Promise<void>;
    msExitFullscreen?: () => Promise<void>;
  }
  
  interface Element {
    webkitRequestFullscreen?: () => Promise<void>;
    msRequestFullscreen?: () => Promise<void>;
  }
}

const ZoomControls: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const zoomLevel = useSelector(selectZoomLevel);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleFullscreenToggle = async () => {
    try {
      if (!document.fullscreenElement) {
        // Enter fullscreen
        const element = document.documentElement;
        if (element.requestFullscreen) {
          await element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
          // Safari
          await element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          await element.msRequestFullscreen();
        }
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          // Safari
          await document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          // IE11
          await document.msExitFullscreen();
        }
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
    }
  };

  return (
    <div className="zoom-controls" role="toolbar" aria-label="Zoom controls">
      <button
        className="zoom-btn zoom-out"
        onClick={() => dispatch(zoomOut())}
        disabled={zoomLevel <= 10}
        aria-label="Zoom out"
        title="Zoom out (10%)"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      <div className="zoom-display" aria-live="polite" aria-atomic="true">
        {zoomLevel}%
      </div>

      <button
        className="zoom-btn zoom-in"
        onClick={() => dispatch(zoomIn())}
        disabled={zoomLevel >= 200}
        aria-label="Zoom in"
        title="Zoom in (10%)"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 5V15M5 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      <button
        className="zoom-btn fullscreen-btn"
        onClick={handleFullscreenToggle}
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullscreen ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 6L18 2M18 2H14M18 2V6M6 14L2 18M2 18H6M2 18V14M14 14L18 18M18 18V14M18 18H14M6 6L2 2M2 2V6M2 2H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 6V2H6M18 6V2H14M2 14V18H6M18 14V18H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>
    </div>
  );
};

export default ZoomControls;