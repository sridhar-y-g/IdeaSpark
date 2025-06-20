
"use client";

import React, { useEffect, useRef } from 'react';

// This component is no longer used and can be considered for deletion.
// The new background is implemented in NewAnimatedBackground.tsx
const AnimatedSpaceBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const fitToContainer = (canvasEl: HTMLCanvasElement) => {
      canvasEl.width = canvasEl.offsetWidth;
      canvasEl.height = canvasEl.offsetHeight;
    };
    
    fitToContainer(canvas);

    const handleResize = () => fitToContainer(canvas);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="large-header-container demo" style={{ display: 'none' }}> {/* Hidden explicitly */}
      <div id="large-header" className="large-header">
        <canvas id="demo-canvas" ref={canvasRef}></canvas>
      </div>
    </div>
  );
};

export default AnimatedSpaceBackground;
