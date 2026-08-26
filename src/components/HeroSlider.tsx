'use client';

import React, { useEffect, useRef } from 'react';
import { useEditor } from '@/components/editor/EditModeProvider';
import { EditableField } from '@/components/editor/EditableField';

export interface HeroSlide {
  title: string;
  bg_image: string;
  cta_link: string;
  cta_text: string;
  sub_title: string;
  video_url?: string;
  description: string;
  badge_text?: string;
}

interface HeroSliderProps {
  slides: HeroSlide[];
}

export default function HeroSlider({ slides }: HeroSliderProps) {
  const swiperInstanceRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { liveData, isEditMode, handleElementClick, openImagePicker } = useEditor();

  const activeSlides = (isEditMode && Array.isArray(liveData?.hero) && liveData.hero.length > 0)
    ? liveData.hero
    : slides;

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const tryInit = () => {
      const w = window as any;
      if (w.Swiper && containerRef.current) {
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
  }, [activeSlides]);

  return (
    <section className="tv-hero-section overflow-hidden z-2 bg-light">
      <div className="hero-inner mx-30 ml-mx-0 position-relative">
        <div className="container-fluid px-0">
          <div className="hero-slider position-relative swiper" suppressHydrationWarning ref={containerRef}>
            <div className="swiper-wrapper" suppressHydrationWarning>
              {activeSlides.map((slide: HeroSlide, index: number) => {
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
                    <div
                      className="hero-area position-relative"
                      onClick={(e) => isEditMode && handleElementClick(`hero.${index}`, e)}
                      onDoubleClick={(e) => {
                        if (isEditMode && e.target === e.currentTarget) {
                          openImagePicker(`hero.${index}.bg_image`, slide.bg_image);
                        }
                      }}
                    >
                      {/* Background Image Change Pill on Hover in Edit Mode */}
                      {isEditMode && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openImagePicker(`hero.${index}.bg_image`, slide.bg_image);
                          }}
                          style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            zIndex: 100,
                            background: 'linear-gradient(135deg, #BF953F, #FCF6BA)',
                            color: '#16120B',
                            border: 'none',
                            padding: '6px 14px',
                            borderRadius: '20px',
                            fontWeight: 800,
                            fontSize: '11px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          📷 Change Slide Background
                        </button>
                      )}

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
                                  {slide.badge_text || "ZK FLOORING PREMIUM CARPET FITTING SERVICE"}
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
                                <EditableField path={`hero.${index}.sub_title`} fallback={slide.sub_title} />
                              </span>
                              <h1 className="hero-title text-white">
                                <EditableField path={`hero.${index}.title`} fallback={slide.title} isHtml />
                              </h1>
                              <div className="text-icon position-relative">
                                <div className="icon d-inline-block spin2">
                                  <img src="/assets/images/icons/star.png" alt="star" />
                                </div>
                                <p className="text">
                                  <EditableField path={`hero.${index}.description`} fallback={slide.description} />
                                </p>
                              </div>
                              <a href={slide.cta_link} className="theme-btn mt-40 br-30">
                                <span className="link-effect">
                                  <span className="effect-1">
                                    <EditableField path={`hero.${index}.cta_text`} fallback={slide.cta_text} />
                                  </span>
                                  <span className="effect-1">
                                    <EditableField path={`hero.${index}.cta_text`} fallback={slide.cta_text} />
                                  </span>
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
