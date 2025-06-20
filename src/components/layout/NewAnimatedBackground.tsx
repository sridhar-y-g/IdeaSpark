
"use client";

import React, { useEffect, useRef } from 'react';

const NewAnimatedBackground: React.FC = () => {
  const particlesContainerRef = useRef<HTMLDivElement>(null);
  // Gradient spheres are animated via CSS. JS mouse interaction for them is omitted
  // as it would directly conflict with and override CSS transform animations.

  useEffect(() => {
    const particlesContainer = particlesContainerRef.current;
    if (!particlesContainer) return;

    const particleCount = 80;
    const createdParticles: { el: HTMLDivElement, animTimeoutId?: number, resetTimeoutId?: number }[] = [];

    function createParticleEl() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 3 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        resetParticlePos(particle);
        if (particlesContainer) {
            particlesContainer.appendChild(particle);
        }
        const particleData = { el: particle };
        createdParticles.push(particleData);
        return particleData;
    }

    function resetParticlePos(particleEl: HTMLDivElement) {
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        particleEl.style.left = `${posX}%`;
        particleEl.style.top = `${posY}%`;
        particleEl.style.opacity = '0';
        return { x: posX, y: posY };
    }

    function animateParticleEl(particleData: { el: HTMLDivElement, animTimeoutId?: number, resetTimeoutId?: number }) {
        const particleEl = particleData.el;
        const pos = resetParticlePos(particleEl);
        const duration = Math.random() * 10 + 10; // seconds
        const delay = Math.random() * 5; // seconds

        particleData.animTimeoutId = window.setTimeout(() => {
            particleEl.style.transition = `all ${duration}s linear`;
            particleEl.style.opacity = (Math.random() * 0.3 + 0.1).toString();
            const moveX = pos.x + (Math.random() * 20 - 10);
            const moveY = pos.y - Math.random() * 30; // Move upwards
            particleEl.style.left = `${moveX}%`;
            particleEl.style.top = `${moveY}%`;

            particleData.resetTimeoutId = window.setTimeout(() => {
                animateParticleEl(particleData); // Re-animate
            }, duration * 1000);
        }, delay * 1000);
    }

    for (let i = 0; i < particleCount; i++) {
        const pData = createParticleEl();
        animateParticleEl(pData);
    }
    
    const handleMouseMove = (e: MouseEvent) => {
        if (!particlesContainer) return;

        const mouseX = (e.clientX / window.innerWidth) * 100;
        const mouseY = (e.clientY / window.innerHeight) * 100;

        const tempParticle = document.createElement('div');
        tempParticle.className = 'particle';
        const size = Math.random() * 4 + 2;
        tempParticle.style.width = `${size}px`;
        tempParticle.style.height = `${size}px`;
        tempParticle.style.left = `${mouseX}%`;
        tempParticle.style.top = `${mouseY}%`;
        tempParticle.style.opacity = '0.6';
        particlesContainer.appendChild(tempParticle);

        setTimeout(() => {
            tempParticle.style.transition = 'all 2s ease-out';
            tempParticle.style.left = `${mouseX + (Math.random() * 10 - 5)}%`;
            tempParticle.style.top = `${mouseY + (Math.random() * 10 - 5)}%`;
            tempParticle.style.opacity = '0';
            setTimeout(() => {
                tempParticle.remove();
            }, 2000);
        }, 10);
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      createdParticles.forEach(pData => {
        if (pData.animTimeoutId) clearTimeout(pData.animTimeoutId);
        if (pData.resetTimeoutId) clearTimeout(pData.resetTimeoutId);
        pData.el.remove();
      });
      // Also attempt to remove any remaining temporary mouse particles
      const tempMouseParticles = particlesContainer.querySelectorAll('.particle');
      tempMouseParticles.forEach(p => {
        // A more robust way would be to mark temporary particles if they need special cleanup.
        // For now, relying on their own removal logic.
      });
    };
  }, []);


  return (
    <div className="gradient-background">
      <div className="gradient-sphere sphere-1"></div>
      <div className="gradient-sphere sphere-2"></div>
      <div className="gradient-sphere sphere-3"></div>
      <div className="glow"></div>
      <div className="grid-overlay"></div>
      <div className="noise-overlay"></div>
      <div className="particles-container" ref={particlesContainerRef}></div>
    </div>
  );
};

export default NewAnimatedBackground;
