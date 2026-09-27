import type { Metadata } from 'next';
import React from 'react';
import { SITE_URL, BUSINESS_INFO, generateBreadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: "Contact Us | Free Home Survey & Quote | ZK Flooring Birmingham",
  description:
    "Connect with ZK Flooring Birmingham. Book your free in-home sample survey, laser measurements, or discuss domestic & commercial flooring installations. Call 07903 723 774.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us | Free Home Survey & Quote | ZK Flooring Birmingham",
    description:
      "Book your free home flooring survey and laser measurements with ZK Flooring Birmingham. Call 07903 723 774 or visit Hobmoor Road, Small Heath B10 9HH.",
    url: `${SITE_URL}/contact`,
    images: [{ url: "/slider/Carpet.webp", width: 1200, height: 630, alt: "Contact ZK Flooring Birmingham" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact ZK Flooring Birmingham | Free Measuring & Quote",
    description: "Book your free mobile showroom survey across Birmingham & 100-200 mile UK radius. Call 07903 723 774.",
    images: ["/slider/Carpet.webp"],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Contact Us', url: '/contact' },
  ]);

  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact ZK Flooring',
    description: 'Get in touch with ZK Flooring for carpet, LVT, hardwood, and laminate installation across Birmingham.',
    url: `${SITE_URL}/contact`,
    mainEntity: {
      '@type': 'LocalBusiness',
      name: BUSINESS_INFO.name,
      telephone: BUSINESS_INFO.telephone,
      email: BUSINESS_INFO.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: BUSINESS_INFO.address.streetAddress,
        addressLocality: BUSINESS_INFO.address.addressLocality,
        addressRegion: BUSINESS_INFO.address.addressRegion,
        postalCode: BUSINESS_INFO.address.postalCode,
        addressCountry: BUSINESS_INFO.address.addressCountry,
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: BUSINESS_INFO.geo.latitude,
        longitude: BUSINESS_INFO.geo.longitude,
      },
      openingHoursSpecification: BUSINESS_INFO.openingHoursSpecification,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      {children}
    </>
  );
}
