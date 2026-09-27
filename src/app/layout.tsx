import type { Metadata } from "next";
import Script from "next/script";
import { Manrope, Noto_Sans } from "next/font/google";
import "./globals.css";
import Header from '@/components/layout/Header';
import MobileMenu from '@/components/layout/MobileMenu';
import StickyHeader from '@/components/layout/StickyHeader';
import HeaderSearch from '@/components/layout/HeaderSearch';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
  display: "swap",
  preload: false,
});

import { SITE_URL, BUSINESS_INFO, generateLocalBusinessSchema, generateWebSiteSchema, generateFAQSchema, CORE_SITE_FAQS } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ZK Flooring | Luxury Carpet, Wood, LVT & Commercial Flooring Birmingham",
    template: "%s | ZK Flooring Birmingham",
  },
  description:
    "Birmingham's premier flooring specialists. Precision installation of luxury carpets, LVT herringbone, real wood, laminate, commercial safety flooring & self-levelling across Birmingham & 100-200 mile UK radius. Free home surveys.",
  keywords: [
    "flooring Birmingham",
    "carpet fitting Birmingham",
    "luxury vinyl tile Birmingham",
    "LVT herringbone Solihull",
    "laminate flooring West Midlands",
    "commercial safety flooring",
    "self levelling Birmingham",
    "subfloor preparation",
    "carpet fitters near me",
    "wood flooring B10",
    "ZK Flooring",
    "flooring suppliers Birmingham",
  ],
  authors: [{ name: "ZK Flooring", url: SITE_URL }],
  creator: "ZK Flooring",
  publisher: "ZK Flooring",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  verification: {
    google: "l5T9LYAyF1KoetW48mQyT727-GTcoPYNeENC1zxIVZ4",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: SITE_URL,
    siteName: "ZK Flooring",
    title: "ZK Flooring | Luxury Carpet, Wood, LVT & Commercial Flooring Birmingham",
    description:
      "Birmingham's premier flooring specialists. Precision installation of luxury carpets, LVT herringbone, real wood, laminate, commercial safety flooring & self-levelling.",
    images: [
      {
        url: "/slider/Carpet.webp",
        width: 1200,
        height: 630,
        alt: "ZK Flooring Birmingham - Luxury Flooring & Carpet Installation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZK Flooring | Luxury Carpet, Wood, LVT & Commercial Flooring Birmingham",
    description:
      "Birmingham's trusted flooring contractor: carpets, LVT herringbone, engineered wood, laminate & subfloor prep. Free home survey.",
    images: ["/slider/Carpet.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Home Improvement & Construction",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const localBusinessSchema = generateLocalBusinessSchema();
  const webSiteSchema = generateWebSiteSchema();
  const faqSchema = generateFAQSchema(CORE_SITE_FAQS);

  return (
    <html lang="en" className={`${manrope.variable} ${notoSans.variable}`} suppressHydrationWarning>
      <head>
        {/* Google Site Verification */}
        <meta name="google-site-verification" content="l5T9LYAyF1KoetW48mQyT727-GTcoPYNeENC1zxIVZ4" />

        {/* Favicon & Manifest */}
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="shortcut icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#D4AF37" />

        {/* GEO Optimization Meta Tags (Geotargeting / Local SEO) */}
        <meta name="geo.region" content="GB-BIR" />
        <meta name="geo.placename" content="Birmingham, West Midlands, United Kingdom" />
        <meta name="geo.position" content="52.4674;-1.8497" />
        <meta name="ICBM" content="52.4674, -1.8497" />

        {/* Answer Engine Optimization (AEO) & Local Business Schemas (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />

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
        <link href="/assets/css/style.css?v=metallic-gold-v21" rel="stylesheet" />
      </head>
      <body id="body" suppressHydrationWarning>
        <div className="page-wrapper bg-light">
          {/* Preloader */}
          <div className="loading-screen" id="loading-screen" suppressHydrationWarning>
            <div className="preloader-close">x</div>
            <span className="loader"></span>
          </div>

          <LayoutWrapper
            header={<Header />}
            mobileMenu={<MobileMenu />}
            stickyHeader={<StickyHeader />}
            headerSearch={<HeaderSearch />}
            sidebar={<Sidebar />}
            footer={<Footer />}
          >
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
        <Script src="/assets/js/vendor/jquery-3.7.1.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/bootstrap.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/gsap.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/ScrollSmoother.js" strategy="afterInteractive" />
        <Script src="/assets/js/gsap-scroll-to-plugin.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/ScrollTrigger.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/swiper-bundle.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/marquee.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/main.js" strategy="afterInteractive" />

        {/* Secondary / Heavy visual scripts deferred */}
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

        {/* Vercel Web Analytics & Real-Time Speed Insights */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
