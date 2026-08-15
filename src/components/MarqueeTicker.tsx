'use client';

import React, { useEffect } from 'react';

const marqueeContainerStyle: React.CSSProperties = {
  backgroundColor: 'var(--theme-color, #D4AF37)',
  padding: '25px 0',
  borderRadius: '30px 30px 0 0',
  overflow: 'hidden',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
};

const marqueeTrackStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  whiteSpace: 'nowrap',
  width: 'max-content',
  animation: 'marquee-scroll 35s linear infinite',
};

const marqueeItemStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  marginRight: '45px',
  fontSize: '26px',
  color: '#ffffff',
  fontWeight: 500,
  fontFamily: 'var(--title-font, sans-serif)',
  flexShrink: 0,
  whiteSpace: 'nowrap',
};

const iconStyle: React.CSSProperties = {
  display: 'inline-block',
  marginRight: '20px',
  height: 'auto',
  width: 'auto',
};

export default function MarqueeTicker() {
  const items = [
    "Premium Carpet Fitting",
    "Hardwood Installations",
    "Laminate Flooring",
    "LVT Flooring Specialists",
    "Expert Subfloor Preparation"
  ];

  useEffect(() => {
    // Inject keyframe animation if not already present
    const styleId = 'marquee-scroll-keyframes';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div className="tv-marquee-section bg-light position-relative">
      <div className="tv-marquee-inner mx-30 ml-mx-0 position-relative">
        <div className="container-fluid p-0 overflow-hidden">
          <div style={marqueeContainerStyle}>
            <div style={marqueeTrackStyle}>
              {/* Duplicate the array four times for seamless infinite scrolling loop */}
              {[...items, ...items, ...items, ...items].map((text, idx) => (
                <div key={idx} style={marqueeItemStyle}>
                  <img style={iconStyle} src="/assets/images/icons/marquee-icon.png" alt="" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
