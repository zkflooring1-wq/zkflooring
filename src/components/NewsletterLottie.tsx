'use client';

import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function NewsletterLottie() {
  return (
    <div className="newsletter-lottie-wrapper" style={{ width: '160px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <DotLottieReact
        src="/Email motion loading.json"
        loop
        autoplay
      />
    </div>
  );
}
