'use client';

import React, { useEffect, useRef } from 'react';

export interface HeroSlide {
  title: string;
  bg_image: string;
  cta_link: string;
  cta_text: string;
  sub_title: string;
  video_url?: string;
  description: string;
}

interface HeroSliderProps {
  slides: HeroSlide[];
}

export default function HeroSlider({ slides }: HeroSliderProps) {
  const swiperInstanceRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const tryInit = () => {
      const w = window as any;
      if (w.Swiper && containerRef.current) {
        console.log("Initializing Swiper now!");
        if ((containerRef.current as any).swiper) {
          (containerRef.current as any).swiper.destroy(true, true);
        }
        swiperInstanceRef.current = new w.Swiper(containerRef.current, {
          spaceBetween: 0,
          speed: 1500,
          effect: 'fade',
          fadeEffect: { crossFade: true },
          loop: true,
          autoplay: { delay: 4000, disableOnInteraction: false },
        });
      } else {
        timeoutId = setTimeout(tryInit, 200);
      }
    };

    tryInit();

    return () => {
      clearTimeout(timeoutId);
      if (swiperInstanceRef.current) {
        swiperInstanceRef.current.destroy(true, true);
      }
    };
  }, [slides]);

  return (
    <section className="tv-hero-section overflow-hidden z-2 bg-light">
      <div className="hero-inner mx-30 ml-mx-0 position-relative">
        <div className="container-fluid px-0">
          <div className="hero-slider position-relative swiper" suppressHydrationWarning ref={containerRef}>
            <div className="swiper-wrapper" suppressHydrationWarning>
              {slides.map((slide, index) => {
                const slideNumber = String(index + 1).padStart(2, '0');
                const pathId = `e-path-${index}`;
                const textPathId = `e-text-path-${index}`;
                const slideClass = index % 2 === 0 ? "pageTurn" : "blurSkew";
                const initialActive = index === 0 ? "swiper-slide-active" : "";

                return (
                  <div
                    key={index}
                    className={`swiper-slide ${slideClass} ${initialActive}`}
                    suppressHydrationWarning
                  >
                    <div className="hero-area position-relative">
                      <div className="p-bottom-left wow slideInUp z-1" suppressHydrationWarning>
                        <img src="/assets/images/hero/hm1-shape01.webp" alt="shape" />
                      </div>
                      <div
                        className="bg image"
                        data-bg-src={slide.bg_image}
                        style={{
                          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${encodeURI(slide.bg_image)}')`
                        }}
                        suppressHydrationWarning
                      ></div>
                      <div className="video-box">
                        <div className="circle-box">
                          <a
                            className="logo-box popup-video"
                            href={slide.video_url || "https://www.youtube.com/watch?v=SMKPKGW083c"}
                            data-fancybox="video-gallery"
                          >
                            <img src="/assets/images/hero/spin-icon.webp" alt="play" />
                          </a>
                          <div
                            className="text-inner"
                            style={{ animation: "10s linear 0s infinite normal none running text-rotate" }}
                            suppressHydrationWarning
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="192.5" height="192.5" viewBox="0 0 250.5 250.5">
                              <path d="M.25,125.25a125,125,0,1,1,125,125,125,125,0,0,1-125-125" id={pathId}></path>
                              <text>
                                <textPath id={textPathId} href={`#${pathId}`} startOffset="0%">
                                  ZK FLOORING PREMIUM CARPET FITTING SERVICE
                                </textPath>
                              </text>
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="container">
                        <div className="row">
                          <div className="col-lg-12">
                            <div className="hero-content">
                              <span className="sub-title">
                                <img src="/assets/images/hero/check.webp" alt="check" />
                                {slide.sub_title}
                              </span>
                              <h1 className="hero-title text-white" dangerouslySetInnerHTML={{ __html: slide.title }}></h1>
                              <div className="text-icon position-relative">
                                <div className="icon d-inline-block spin2">
                                  <img src="/assets/images/icons/star.png" alt="star" />
                                </div>
                                <p className="text">{slide.description}</p>
                              </div>
                              <a href={slide.cta_link} className="theme-btn mt-40 br-30">
                                <span className="link-effect">
                                  <span className="effect-1">{slide.cta_text}</span>
                                  <span className="effect-1">{slide.cta_text}</span>
                                </span>
                                <span className="arrow-all">
                                  <i>
                                    <svg width="16" height="19" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M2 6H10M10 6L6 2M10 6L6 10" stroke="#16120B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <svg width="16" height="19" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M2 6H10M10 6L6 2M10 6L6 10" stroke="#16120B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  </i>
                                </span>
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="slide-number">{slideNumber}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
