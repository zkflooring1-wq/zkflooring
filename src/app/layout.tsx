import type { Metadata } from "next";
import Script from "next/script";
import { Manrope, Noto_Sans } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "ZK Flooring - Premium Flooring & Carpet Installation in Birmingham",
  description: "ZK Flooring offers premium carpet, wood, vinyl, LVT, and SPC flooring installation services in Birmingham and surrounding regions.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${notoSans.variable}`} suppressHydrationWarning>
      <head>
        {/* Favicon & Site Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />

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

          <LayoutWrapper>
            {children}
          </LayoutWrapper>

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

        {/* Core essential scripts for initial interactive shell */}
        <script defer src="/assets/js/vendor/jquery-3.7.1.min.js"></script>
        <script defer src="/assets/js/bootstrap.min.js"></script>
        <script defer src="/assets/js/gsap.min.js"></script>
        <script defer src="/assets/js/ScrollSmoother.js"></script>
        <script defer src="/assets/js/gsap-scroll-to-plugin.min.js"></script>
        <script defer src="/assets/js/ScrollTrigger.min.js"></script>
        <script defer src="/assets/js/swiper-bundle.min.js"></script>
        <script defer src="/assets/js/marquee.min.js"></script>
        <script defer src="/assets/js/main.js"></script>

        {/* Secondary / Heavy visual scripts deferred */}
        <script defer src="/assets/js/jquery.fancybox.js"></script>
        <script defer src="/assets/js/select2.min.js"></script>
        <script defer src="/assets/js/jquery-ui.min.js"></script>
        <script defer src="/assets/js/jquery.validate.min.js"></script>
        <script defer src="/assets/js/jquery.appear.js"></script>
        <script defer src="/assets/js/jquery.odometer.min.js"></script>
        <script defer src="/assets/js/wow.min.js"></script>
        <script defer src="/assets/js/imagesloaded.pkgd.min.js"></script>
        <script defer src="/assets/js/isotope.pkgd.min.js"></script>
        <script defer src="/assets/js/lenis.min.js"></script>
        <script defer src="/assets/js/splite-type.min.js"></script>
        <script defer src="/assets/js/vanilla-tilt.min.js"></script>
        <script defer src="/assets/js/three.min.js"></script>
        <script defer src="/assets/js/hover.js"></script>
      </body>
    </html>
  );
}
