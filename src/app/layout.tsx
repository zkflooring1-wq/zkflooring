import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/layout/Header";
import MobileMenu from "@/components/layout/MobileMenu";
import StickyHeader from "@/components/layout/StickyHeader";
import HeaderSearch from "@/components/layout/HeaderSearch";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "ZK Flooring - Premium Flooring & Carpet Installation in Birmingham",
  description: "ZK Flooring offers premium carpet, wood, vinyl, LVT, and SPC flooring installation services in Birmingham and surrounding regions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />

        {/* Template CSS Stylesheets */}
        <link href="/assets/css/bootstrap.min.css" rel="stylesheet" />
        <link href="/assets/fontawesome/css/fontawesome.min.css" rel="stylesheet" />
        <link href="/assets/css/flaticon.min.css" rel="stylesheet" />
        <link href="/assets/css/fancybox.min.css" rel="stylesheet" />
        <link href="/assets/css/swiper-bundle.min.css" rel="stylesheet" />
        <link href="/assets/css/animate.min.css" rel="stylesheet" />
        <link href="/assets/css/select2.min.css" rel="stylesheet" />
        <link href="/assets/css/jquery-ui.min.css" rel="stylesheet" />
        <link href="/assets/css/odometer.css" rel="stylesheet" />
        <link href="/assets/css/style.css" rel="stylesheet" />
      </head>
      <body id="body" suppressHydrationWarning>
        <div className="page-wrapper bg-light">
          {/* Preloader */}
          <div className="loading-screen" id="loading-screen" suppressHydrationWarning>
            <div className="preloader-close">x</div>
            <span className="loader"></span>
          </div>

          <Header />
          <MobileMenu />
          <StickyHeader />
          <HeaderSearch />
          <Sidebar />

          {children}

          <Footer />

          {/* Scroll To Top */}
          <div className="scrollToTop">
            <div className="arrowUp">
              <i className="fa-light fa-arrow-up"></i>
            </div>
            <div className="water" style={{ transform: "translate(0px, 40%)" }}>
              <svg viewBox="0 0 560 20" className="water_wave water_wave_back">
                <use xlinkHref="#wave"></use>
              </svg>
              <svg viewBox="0 0 560 20" className="water_wave water_wave_front">
                <use xlinkHref="#wave"></use>
              </svg>
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 560 20" style={{ display: "none" }}>
                <symbol id="wave">
                  <path d="M420,20c21.5-0.4,38.8-2.5,51.1-4.5c13.4-2.2,26.5-5.2,27.3-5.4C514,6.5,518,4.7,528.5,2.7c7.1-1.3,17.9-2.8,31.5-2.7c0,0,0,0,0,0v20H420z" fill="#" style={{ transition: "stroke-dashoffset 10ms linear", strokeDasharray: "301.839, 301.839", strokeDashoffset: "119.488px" }}></path>
                  <path d="M420,20c-21.5-0.4-38.8-2.5-51.1-4.5c-13.4-2.2-26.5-5.2-27.3-5.4C326,6.5,322,4.7,311.5,2.7C304.3,1.4,293.6-0.1,280,0c0,0,0,0,0,0v20H420z" fill="#"></path>
                  <path d="M140,20c21.5-0.4,38.8-2.5,51.1-4.5c13.4-2.2,26.5-5.2,27.3-5.4C234,6.5,238,4.7,248.5,2.7c7.1-1.3,17.9-2.8,31.5-2.7c0,0,0,0,0,0v20H140z" fill="#"></path>
                  <path d="M140,20c-21.5-0.4-38.8-2.5-51.1-4.5c-13.4-2.2-26.5-5.2-27.3-5.4C46,6.5,42,4.7,31.5,2.7C24.3,1.4,13.6-0.1,0,0c0,0,0,0,0,0l0,20H140z" fill="#"></path>
                </symbol>
              </svg>
            </div>
          </div>
        </div>

        {/* Vendor scripts loaded afterInteractive so React hydrates first, then jQuery runs safely.
            This prevents the hydration-mismatch cascade that caused the preloader to get stuck. */}
        <Script src="/assets/js/vendor/jquery-3.7.1.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/bootstrap.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/gsap.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/ScrollSmoother.js" strategy="afterInteractive" />
        <Script src="/assets/js/gsap-scroll-to-plugin.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/ScrollTrigger.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/swiper-bundle.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/marquee.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/jquery.fancybox.js" strategy="afterInteractive" />
        <Script src="/assets/js/select2.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/jquery-ui.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/jquery.validate.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/jquery.appear.js" strategy="afterInteractive" />
        <Script src="/assets/js/jquery.odometer.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/wow.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/imagesloaded.pkgd.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/isotope.pkgd.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/lenis.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/splite-type.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/vanilla-tilt.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/three.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/hover.js" strategy="afterInteractive" />
        <Script src="/assets/js/main.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
