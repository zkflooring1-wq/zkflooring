"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface FloorFinish {
  id: string;
  name: string;
  type: string;
  swatchColor: string;
  image: string;
  fallbackImage: string;
  description: string;
  specs: {
    wearLayer: string;
    waterproof: string;
    warranty: string;
    ufhCompatible: string;
    bestFor: string;
  };
  priceRange: string;
}

const FLOOR_FINISHES: FloorFinish[] = [
  {
    id: 'honey-oak',
    name: 'Royal Honey Oak',
    type: 'LVT Herringbone Parquet',
    swatchColor: 'linear-gradient(135deg, #c99342, #96671e)',
    image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1600&q=85',
    fallbackImage: '/slider/Laminate Flooring.webp',
    description: 'Classic British honey oak herringbone with micro-bevelled edges. Low-angle direct view showcasing the rich wood grain, realistic knots, and 0.55mm commercial wear layer.',
    specs: {
      wearLayer: '0.55mm Commercial PVC Wear Layer',
      waterproof: '100% Waterproof Impervious',
      warranty: '25-Year Residential Guarantee',
      ufhCompatible: 'Yes (Up to 27°C under BS 8203)',
      bestFor: 'Hallways, Living Rooms, Kitchens'
    },
    priceRange: '£38 - £52 / m²'
  },
  {
    id: 'smoke-grey',
    name: 'Nordic Smoke Grey',
    type: 'Ultra-Matte Wide Plank LVT',
    swatchColor: 'linear-gradient(135deg, #a69f97, #706a64)',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85',
    fallbackImage: '/slider/Vinyl flooring.webp',
    description: 'Contemporary Scandinavian smoke grey wide timber planks. Ultra-matte finish with subtle oak grain texture that reflects soft daylight across open-plan interiors.',
    specs: {
      wearLayer: '0.55mm Scratch-Guard Surface',
      waterproof: '100% Waterproof Impervious',
      warranty: '20-Year Residential Guarantee',
      ufhCompatible: 'Yes (High Thermal Conductivity)',
      bestFor: 'Open-Plan Living, Bathrooms, Dining'
    },
    priceRange: '£34 - £46 / m²'
  },
  {
    id: 'dark-walnut',
    name: 'Heritage Dark Walnut',
    type: 'Engineered Hardwood Parquet',
    swatchColor: 'linear-gradient(135deg, #54371b, #2b1708)',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=85',
    fallbackImage: '/slider/Laminate Flooring.webp',
    description: 'Rich, luxurious dark chocolate walnut parquet. Highlights deep timber swirls and satin UV-lacquered protection for executive homes and master bedroom suites.',
    specs: {
      wearLayer: '4mm European Walnut Hardwood Top',
      waterproof: 'Water-Resistant Sealed Surface',
      warranty: '30-Year Structural Guarantee',
      ufhCompatible: 'Yes (Engineered Multi-Ply Core)',
      bestFor: 'Master Bedrooms, Formal Lounges, Offices'
    },
    priceRange: '£65 - £88 / m²'
  },
  {
    id: 'champagne-lvt',
    name: 'Champagne Royal Parquet',
    type: 'Luxury Click Vinyl Tile',
    swatchColor: 'linear-gradient(135deg, #e5d4bc, #bfa682)',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
    fallbackImage: '/slider/Vinyl Tile.webp',
    description: 'Bright, airy champagne gold herringbone floor. Precision geometric planks designed to brighten interior hallways and high-traffic open living areas.',
    specs: {
      wearLayer: '0.70mm Heavy Commercial Grade',
      waterproof: '100% Waterproof Impervious',
      warranty: 'Lifetime Residential Guarantee',
      ufhCompatible: 'Yes (BS 8203 Trade Certified)',
      bestFor: 'Kitchens, Conservatories, Hallways'
    },
    priceRange: '£42 - £58 / m²'
  },
  {
    id: 'charcoal-carpet',
    name: 'Plush Charcoal Saxony',
    type: 'Deep Pile Luxury Carpet',
    swatchColor: 'linear-gradient(135deg, #3d4045, #1a1c1e)',
    image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1600&q=85',
    fallbackImage: '/slider/Carpet.webp',
    description: 'Ultra-plush charcoal Saxony deep pile carpet. Paired with 12mm Cloud9 underlay for supreme underfoot cushioning, warmth, and sound insulation.',
    specs: {
      wearLayer: '2,200g/m² Heavy Density Saxony',
      waterproof: '10-Year Stain-Safe Protection',
      warranty: '15-Year Wear Warranty',
      ufhCompatible: 'Yes (1.8 TOG Thermal Rating)',
      bestFor: 'Bedrooms, Stairs, Cinema Rooms'
    },
    priceRange: '£28 - £44 / m²'
  }
];

export default function RoomVisualizer() {
  const [selected, setSelected] = useState<FloorFinish>(FLOOR_FINISHES[0]);
  const [imgSrc, setImgSrc] = useState<string>(FLOOR_FINISHES[0].image);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSelect = (finish: FloorFinish) => {
    if (finish.id === selected.id) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setSelected(finish);
      setImgSrc(finish.image);
      setIsTransitioning(false);
    }, 180);
  };

  return (
    <div className="zk-visualizer-container">
      {/* Visualizer Frame */}
      <div className="zk-visualizer-card">
        <div className="row g-0">
          {/* Left: Flooring Visual Canvas */}
          <div className="col-lg-7">
            <div className="zk-visualizer-canvas">
              <img
                src={imgSrc}
                alt={selected.name}
                onError={() => {
                  if (imgSrc !== selected.fallbackImage) {
                    setImgSrc(selected.fallbackImage);
                  }
                }}
                className={`zk-visualizer-img ${isTransitioning ? 'fade-out' : 'fade-in'}`}
              />
              
              {/* Floating Top Badge */}
              <div className="zk-visualizer-badge">
                <div
                  className="zk-swatch-dot"
                  style={{ background: selected.swatchColor }}
                />
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#8a6820' }}>
                    {selected.type}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#16120B' }}>
                    {selected.name}
                  </div>
                </div>
              </div>

              {/* Focus Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'rgba(22, 18, 11, 0.85)',
                  backdropFilter: 'blur(6px)',
                  color: '#FCF6BA',
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '10.5px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  border: '1px solid rgba(212, 175, 55, 0.3)'
                }}
              >
                <i className="fa-solid fa-eye" style={{ color: '#D4AF37' }}></i>
                Real Floor Focus
              </div>

              {/* Price Tag Indicator */}
              <div className="zk-visualizer-price-tag">
                <i className="fa-solid fa-tag" style={{ color: '#B38728', marginRight: '6px' }}></i>
                Estimated Supply &amp; Fit: <strong>{selected.priceRange}</strong>
              </div>
            </div>
          </div>

          {/* Right: Interactive Controls & Live HUD */}
          <div className="col-lg-5">
            <div className="zk-visualizer-controls">
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: '#8a6820', background: '#f3ede2', padding: '4px 12px', borderRadius: '20px', marginBottom: '10px' }}>
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                  Interactive Flooring Studio
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#16120B', marginBottom: '6px' }}>
                  Select Flooring Finish
                </h3>
                <p style={{ fontSize: '12.5px', color: '#666', marginBottom: '18px', lineHeight: 1.5 }}>
                  Click any shade below to see the realistic floor texture in close-up detail and review trade specifications.
                </p>

                {/* Swatch Selector Buttons */}
                <div className="zk-swatch-grid">
                  {FLOOR_FINISHES.map((finish) => {
                    const isActive = finish.id === selected.id;
                    return (
                      <button
                        key={finish.id}
                        type="button"
                        onClick={() => handleSelect(finish)}
                        className={`zk-swatch-btn ${isActive ? 'active' : ''}`}
                      >
                        <span
                          className="zk-swatch-circle"
                          style={{ background: finish.swatchColor }}
                        />
                        <span className="zk-swatch-name">{finish.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Description Box */}
                <div style={{ padding: '12px 14px', background: '#faf8f5', borderRadius: '12px', border: '1px solid #ede5d8', marginBottom: '16px', fontSize: '12px', color: '#555', lineHeight: 1.5 }}>
                  <i className="fa-solid fa-circle-info" style={{ color: '#B38728', marginRight: '6px' }}></i>
                  {selected.description}
                </div>

                {/* Live Specifications HUD */}
                <div className="zk-specs-hud">
                  <div className="zk-specs-row">
                    <span className="zk-spec-label"><i className="fa-solid fa-shield-halved"></i> Wear Layer:</span>
                    <span className="zk-spec-value">{selected.specs.wearLayer}</span>
                  </div>
                  <div className="zk-specs-row">
                    <span className="zk-spec-label"><i className="fa-solid fa-droplet"></i> Moisture Protection:</span>
                    <span className="zk-spec-value">{selected.specs.waterproof}</span>
                  </div>
                  <div className="zk-specs-row">
                    <span className="zk-spec-label"><i className="fa-solid fa-fire"></i> Underfloor Heating:</span>
                    <span className="zk-spec-value">{selected.specs.ufhCompatible}</span>
                  </div>
                  <div className="zk-specs-row">
                    <span className="zk-spec-label"><i className="fa-solid fa-award"></i> Trade Warranty:</span>
                    <span className="zk-spec-value">{selected.specs.warranty}</span>
                  </div>
                  <div className="zk-specs-row">
                    <span className="zk-spec-label"><i className="fa-solid fa-house"></i> Recommended For:</span>
                    <span className="zk-spec-value">{selected.specs.bestFor}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="zk-visualizer-actions">
                <Link
                  href={`/contact?sample=${encodeURIComponent(selected.name)}`}
                  className="zk-btn-gold"
                >
                  <i className="fa-solid fa-box-open" style={{ marginRight: '6px' }}></i>
                  Request Free Sample Pack of {selected.name}
                </Link>
                <a
                  href="tel:07903723774"
                  className="zk-btn-dark"
                >
                  <i className="fa-solid fa-phone" style={{ color: '#D4AF37', marginRight: '6px' }}></i>
                  Book Free Laser Survey: 07903 723 774
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
