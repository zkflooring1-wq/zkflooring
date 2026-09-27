import type { Metadata } from 'next';
import React from 'react';
import { SITE_URL, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) | Flooring Installation Birmingham | ZK Flooring",
  description:
    "Expert answers about carpet fitting, LVT herringbone, subfloor self-levelling screed, free in-home sample visits, British Standards & warranties from ZK Flooring Birmingham.",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "Frequently Asked Questions (FAQ) | ZK Flooring Birmingham",
    description:
      "Find answers to all your flooring questions: free home measuring, subfloor preparation, LVT vs laminate, turnaround times, and trade guarantees in Birmingham.",
    url: `${SITE_URL}/faq`,
    images: [{ url: "/slider/Carpet.webp", width: 1200, height: 630, alt: "ZK Flooring FAQ" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions (FAQ) | ZK Flooring Birmingham",
    description: "Clear answers on flooring installation, subfloor prep, prices, and warranties in Birmingham.",
    images: ["/slider/Carpet.webp"],
  },
};

const FAQ_ITEMS = [
  {
    question: "Do you offer free home surveys and measurements in Birmingham?",
    answer: "Yes, 100% free with zero obligation. We visit your home or business with our mobile showroom featuring hundreds of carpet, LVT, hardwood, and laminate samples. We take laser-accurate measurements and provide a transparent, fixed quote.",
  },
  {
    question: "Do I need to prepare my subfloor or remove old flooring?",
    answer: "Our team handles complete end-to-end preparation. We test for moisture (DPM), remove and responsibly dispose of old flooring, repair uneven surfaces, install ply boarding, and apply latex self-levelling screed to guarantee a mirror-flat, durable base.",
  },
  {
    question: "What is the difference between LVT (Luxury Vinyl Tile) and laminate flooring?",
    answer: "LVT is 100% waterproof, exceptionally durable, and ideal for moisture-prone areas like kitchens, bathrooms, and hallways. It can be installed in custom patterns like herringbone. Laminate provides the authentic look of real timber at a cost-effective price point, offering superior scratch resistance for living areas and bedrooms.",
  },
  {
    question: "How long does a typical flooring installation take?",
    answer: "Most single-room or staircase carpet/laminate installations are completed within 1 working day. Full house installations or commercial projects typically take 2 to 4 days depending on required subfloor preparation and curing times.",
  },
  {
    question: "Do you provide a guarantee on your workmanship?",
    answer: "Yes, all ZK Flooring installations are backed by our comprehensive 10-Year Trade Workmanship Guarantee alongside manufacturer product warranties. We are also fully covered by £5,000,000 Public Liability Insurance for complete peace of mind.",
  },
  {
    question: "Will your fitters help move furniture and trim doors?",
    answer: "Yes, we offer white-glove property care. Our certified fitters can assist with moving heavy furniture, cleanly undercutting door bottoms to clear new carpet and underlay heights, and performing full post-installation vacuuming and waste removal.",
  },
  {
    question: "What areas across Birmingham and the West Midlands do you cover?",
    answer: "We cover all areas of Birmingham (Solihull, Sutton Coldfield, Edgbaston, Harborne, Moseley, Small Heath, Yardley, Hall Green, etc.) and extend throughout the entire West Midlands (100–200 mile service radius) for residential and commercial flooring contracts.",
  },
];

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Frequently Asked Questions', url: '/faq' },
  ]);

  const faqSchema = generateFAQSchema(FAQ_ITEMS);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
