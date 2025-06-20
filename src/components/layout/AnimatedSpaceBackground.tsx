"use client";

import React, { useEffect, useRef } from 'react';

const AnimatedSpaceBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Basic canvas setup (resize to fit its container)
    // The actual animation JavaScript for drawing on the canvas is not provided by the user.
    // This setup ensures the canvas element itself is responsive.
    const fitToContainer = (canvasEl: HTMLCanvasElement) => {
      // Ensure the canvas is sized based on its displayed size in the layout
      // The CSS handles the container (.large-header) size. Canvas fills this.
      canvasEl.width = canvasEl.offsetWidth;
      canvasEl.height = canvasEl.offsetHeight;
    };
    
    // Initial resize
    fitToContainer(canvas);

    // Resize on window resize
    const handleResize = () => fitToContainer(canvas);
    window.addEventListener('resize', handleResize);

    // Placeholder for user's canvas drawing logic:
    // const ctx = canvas.getContext('2d');
    // if (ctx) {
    //   // User's animation code would go here.
    //   // e.g., ctx.fillRect(10, 10, 100, 100);
    // }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    // The .demo class from user's example is applied here.
    // CSS in globals.css targets .dark .large-header-container.demo to show this.
    <div className="large-header-container demo">
      <div id="large-header" className="large-header">
        <canvas id="demo-canvas" ref={canvasRef}></canvas>
      </div>
      {/* Example Title - user can customize this */}
      <h1 className="main-title">
        IDEA<span className="thin">SPARK</span>
      </h1>
    </div>
  );
};

export default AnimatedSpaceBackground;
