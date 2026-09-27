/**
 * Centralized SEO, GEO, and AEO Configuration for ZK Flooring
 * Adheres to British Standards, Google Rich Results, Schema.org, and LLM specifications.
 */

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://zkflooring.co.uk';

export const BUSINESS_INFO = {
  name: 'ZK Flooring',
  legalName: 'ZK Flooring Birmingham',
  tagline: 'Premium Carpet, Wood, LVT & Commercial Flooring Specialists in Birmingham',
  description:
    'ZK Flooring is Birmingham’s trusted specialist in luxury carpets, LVT herringbone, engineered hardwood, laminate, commercial safety vinyl, and subfloor self-levelling. Serving Birmingham, Solihull, West Midlands, and a 100–200 mile UK radius with free mobile showroom surveys.',
  phone: '07903 723 774',
  telephone: '+447903723774',
  email: 'zkflooring1@gmail.com',
  address: {
    streetAddress: 'Hobmoor Road, Small Heath',
    addressLocality: 'Birmingham',
    addressRegion: 'West Midlands',
    postalCode: 'B10 9HH',
    addressCountry: 'GB',
  },
  geo: {
    latitude: 52.4674,
    longitude: -1.8497,
  },
  priceRange: '££',
  currenciesAccepted: 'GBP',
  paymentAccepted: 'Cash, Credit Card, Debit Card, Bank Transfer',
  openingHours: [
    'Mo-Sa 08:00-18:30',
  ],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '08:00',
      closes: '18:30',
    },
  ],
  primaryAreas: [
    'Birmingham',
    'Small Heath',
    'Solihull',
    'Sutton Coldfield',
    'Edgbaston',
    'Harborne',
    'Moseley',
    'Kings Heath',
    'Hall Green',
    'Yardley',
    'Erdington',
    'Perry Barr',
    'Great Barr',
    'Selly Oak',
    'Bournville',
    'Longbridge',
  ],
  extendedAreas: [
    'Coventry',
    'Wolverhampton',
    'Dudley',
    'Walsall',
    'West Bromwich',
    'Stourbridge',
    'Halesowen',
    'Lichfield',
    'Tamworth',
    'Redditch',
    'Bromsgrove',
    'Worcester',
    'Leicester',
    'Derby',
    'Nottingham',
    'Milton Keynes',
    'London',
    'Manchester',
  ],
  rating: {
    ratingValue: '4.9',
    reviewCount: '128',
    bestRating: '5',
    worstRating: '1',
  },
  social: {
    facebook: 'https://facebook.com/zkflooring',
    instagram: 'https://instagram.com/zkflooring',
    tiktok: 'https://tiktok.com/@zkflooring',
  },
};

/**
 * Generate Schema.org LocalBusiness / FlooringStore JSON-LD
 */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['FlooringStore', 'HomeAndConstructionBusiness', 'ProfessionalService'],
    '@id': `${SITE_URL}/#localbusiness`,
    name: BUSINESS_INFO.name,
    legalName: BUSINESS_INFO.legalName,
    url: SITE_URL,
    logo: `${SITE_URL}/zk-logo.png`,
    image: `${SITE_URL}/slider/Carpet.webp`,
    telephone: BUSINESS_INFO.telephone,
    email: BUSINESS_INFO.email,
    priceRange: BUSINESS_INFO.priceRange,
    currenciesAccepted: BUSINESS_INFO.currenciesAccepted,
    paymentAccepted: BUSINESS_INFO.paymentAccepted,
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
    areaServed: [
      ...BUSINESS_INFO.primaryAreas.map(city => ({
        '@type': 'City',
        name: city,
      })),
      {
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: BUSINESS_INFO.geo.latitude,
          longitude: BUSINESS_INFO.geo.longitude,
        },
        geoRadius: '320000', // 200 miles in meters
      },
    ],
    openingHoursSpecification: BUSINESS_INFO.openingHoursSpecification,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: BUSINESS_INFO.rating.ratingValue,
      reviewCount: BUSINESS_INFO.rating.reviewCount,
      bestRating: BUSINESS_INFO.rating.bestRating,
      worstRating: BUSINESS_INFO.rating.worstRating,
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Flooring Supply & Installation Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Carpet & Carpet Tile Fitting',
            description: 'Luxury domestic carpet installation, stair runners, underlay, and contract commercial carpet tiles.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Luxury Vinyl Tile (LVT) & Sheet Vinyl',
            description: 'Gluedown and click LVT herringbone, stone tile effects, Amtico & Karndean alternative installations.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Self Levelling & Subfloor Preparation',
            description: 'Latex self-levelling screeds, liquid DPM moisture barriers, and 6mm/9mm ply boarding to BS 8203 standards.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Solid & Engineered Hardwood Flooring',
            description: 'Real wood oak flooring, parquet herringbone blocks, expansion profiling, and acoustic timber underlay.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Laminate Flooring Installation',
            description: 'AC4/AC5 rated high-durability scratch-resistant laminate flooring for residential and commercial spaces.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Commercial Safety Flooring',
            description: 'Slip-resistant vinyl, cap and cove skirting, hygienic welded seams for medical, dental, school, and kitchen facilities.',
          },
        },
      ],
    },
  };
}

/**
 * Generate WebSite Schema.org JSON-LD
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: BUSINESS_INFO.name,
    description: BUSINESS_INFO.description,
    publisher: {
      '@id': `${SITE_URL}/#localbusiness`,
    },
    inLanguage: 'en-GB',
  };
}

/**
 * Generate BreadcrumbList Schema.org JSON-LD
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * Generate FAQPage Schema.org JSON-LD (Vital for Answer Engine Optimization - AEO)
 */
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate Service Schema.org JSON-LD
 */
export function generateServiceSchema(service: {
  title: string;
  summary: string;
  slug: string;
  image?: string;
  category?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE_URL}/services/${service.slug}#service`,
    name: service.title,
    description: service.summary,
    serviceType: service.category || 'Flooring Installation',
    provider: {
      '@type': 'LocalBusiness',
      name: BUSINESS_INFO.name,
      telephone: BUSINESS_INFO.telephone,
      url: SITE_URL,
      address: {
        '@type': 'PostalAddress',
        streetAddress: BUSINESS_INFO.address.streetAddress,
        addressLocality: BUSINESS_INFO.address.addressLocality,
        postalCode: BUSINESS_INFO.address.postalCode,
        addressCountry: BUSINESS_INFO.address.addressCountry,
      },
    },
    areaServed: BUSINESS_INFO.primaryAreas.map(area => ({
      '@type': 'City',
      name: area,
    })),
    url: `${SITE_URL}/services/${service.slug}`,
    image: service.image ? (service.image.startsWith('http') ? service.image : `${SITE_URL}${service.image}`) : undefined,
  };
}

/**
 * Primary Core FAQs for Site-Level Answer Engine Optimization (AEO)
 */
export const CORE_SITE_FAQS = [
  {
    question: 'Where is ZK Flooring based and what areas do you cover?',
    answer:
      'ZK Flooring is based at Hobmoor Road, Small Heath, Birmingham (B10 9HH). We provide professional flooring installation across all Birmingham postcodes, Solihull, Sutton Coldfield, Coventry, Wolverhampton, and across the West Midlands, with nationwide commercial and domestic coverage within a 100 to 200 mile radius.',
  },
  {
    question: 'Does ZK Flooring provide free home measuring and sample visits?',
    answer:
      'Yes. ZK Flooring provides a 100% free, zero-obligation home survey. Our mobile showroom brings hundreds of carpet, LVT, laminate, and engineered wood samples directly to your doorstep, accompanied by laser measuring and an immediate fixed-price quote.',
  },
  {
    question: 'What types of flooring does ZK Flooring supply and install?',
    answer:
      'ZK Flooring installs luxury residential carpets, contract carpet tiles, Luxury Vinyl Tile (LVT in herringbone and plank formats), SPC flooring, sheet vinyl, engineered oak, real hardwood timber, laminate flooring, self-levelling latex screeds, wall panels, and decking.',
  },
  {
    question: 'Do you carry out subfloor preparation and self-levelling?',
    answer:
      'Yes. All installations adhere to British Standards (BS 8203 for resilient flooring and BS 5325 for carpets). We carry out moisture testing (DPM), old floor uplift and disposal, SP101 ply boarding, and latex self-levelling screeding to ensure a mirror-flat finish.',
  },
  {
    question: 'How do I book a quote or consultation with ZK Flooring?',
    answer:
      'You can call our master fitters directly on 07903 723 774, email zkflooring1@gmail.com, or submit our online contact form at https://zkflooring.co.uk/contact. Consultations are confirmed promptly.',
  },
  {
    question: 'Does ZK Flooring install commercial safety flooring?',
    answer:
      'Yes. We install commercial safety vinyl with hot-welded seams and cap-and-cove skirting compliant with UK hygiene and slip-resistance regulations for kitchens, dental surgeries, clinics, care homes, and schools.',
  },
];
