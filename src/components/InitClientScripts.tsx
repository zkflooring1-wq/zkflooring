'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function InitClientScripts() {
  const pathname = usePathname();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let attempts = 0;

    const initScripts = () => {
      if (typeof window === 'undefined') return;

      const windowAny = window as any;
      const $ = windowAny.$;

      // Wait until all required globals are available
      if (!windowAny.Swiper || !$) {
        if (attempts > 100) {
          clearInterval(intervalId);
          console.warn("InitClientScripts: Timed out waiting for global scripts.");
        }
        attempts++;
        return;
      }

      // Success, stop polling
      clearInterval(intervalId);

      // 1. Hero Swiper is initialized inside HeroSlider.tsx to survive Fast Refresh

      // 2. Initialize Testimonial Swiper (3 Slides on Desktop)
      const testiEl = document.querySelector('.testi-slider');
      if (testiEl && !(testiEl as any).swiper) {
        new windowAny.Swiper('.testi-slider', {
          spaceBetween: 24,
          speed: 1000,
          loop: true,
          autoplay: {
            delay: 4000,
            disableOnInteraction: false,
          },
          breakpoints: {
            1200: { slidesPerView: 3 },
            992: { slidesPerView: 2 },
            768: { slidesPerView: 2 },
            0: { slidesPerView: 1 },
          },
        });
      }

      // 3. Initialize Brands Swiper
      const brandsEl = document.querySelector('.brands-slider-two');
      if (brandsEl && !(brandsEl as any).swiper) {
        new windowAny.Swiper('.brands-slider-two', {
          spaceBetween: 30,
          speed: 1000,
          loop: true,
          autoplay: {
            delay: 3000,
            disableOnInteraction: false,
          },
          breakpoints: {
            1200: { slidesPerView: 5 },
            992: { slidesPerView: 4 },
            768: { slidesPerView: 3 },
            480: { slidesPerView: 2 },
            0: { slidesPerView: 1 },
          },
        });
      }

      // 4. Initialize WOW.js if available
      if (windowAny.WOW) {
        try {
          new windowAny.WOW().init();
        } catch (e) {
          // WOW already initialized or non-critical
        }
      }

      // 5. Trigger Odometer
      if ($ && $.fn && $.fn.odometer) {
        $('.odometer').each(function (this: HTMLElement) {
          const count = $(this).attr('data-count');
          if (count) {
            $(this).html(count);
          }
        });
      }
    };

    intervalId = setInterval(initScripts, 200);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [pathname]);

  return null;
}
