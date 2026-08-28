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
    image: '/assets/images/visualizer/honey_oak_parquet.png',
    fallbackImage: '/slider/Laminate Flooring.webp',
    description: 'Bespoke British honey oak herringbone parquet. Precision micro-bevelled planks showcasing natural oak grain, authentic knots, and 0.55mm heavy commercial wear protection.',
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
    image: '/slider/Vinyl flooring.webp',
    fallbackImage: '/assets/images/visualizer/smoke_grey_wood.png',
    description: 'Contemporary Scandinavian smoke grey wide timber planks. Ultra-matte protective surface with subtle oak grain texture that fills modern open-plan interiors.',
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
    image: '/assets/images/visualizer/dark_walnut_floor.png',
    fallbackImage: '/slider/Laminate Flooring.webp',
    description: 'Rich, deep chocolate European walnut parquet. Highlights authentic timber swirls and satin UV-lacquered protection for executive master bedrooms and lounges.',
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
    image: '/assets/images/visualizer/champagne_laminate.png',
    fallbackImage: '/slider/Vinyl Tile.webp',
    description: 'Bright, airy champagne oak planks. Precision interlocking geometric planks engineered to brighten interior hallways and high-traffic family areas.',
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
    image: '/slider/Carpet.webp',
    fallbackImage: '/slider/Carpet Tile.webp',
    description: 'Supreme deep pile luxury Saxony carpet. Paired with 12mm Cloud9 underlay for heavenly underfoot cushioning, warmth, and sound dampening.',
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
    }, 150);
  };

  return (
    <div className="zk-visualizer-container">
      {/* Visualizer Frame */}
      <div className="zk-visualizer-card">
        <div className="row g-0 align-items-stretch" style={{ minHeight: '560px' }}>
          {/* Left: 100% Floor Texture Canvas */}
          <div className="col-lg-7 d-flex">
            <div className="zk-visualizer-canvas w-100 h-100" style={{ minHeight: '480px' }}>
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
                <i className="fa-solid fa-layer-group" style={{ color: '#D4AF37' }}></i>
                100% Pure Flooring Focus
              </div>

              {/* Price Tag Indicator */}
              <div className="zk-visualizer-price-tag">
                <i className="fa-solid fa-tag" style={{ color: '#B38728', marginRight: '6px' }}></i>
                Estimated Supply &amp; Fit: <strong>{selected.priceRange}</strong>
              </div>
            </div>
          </div>

          {/* Right: Interactive Controls & Live HUD */}
          <div className="col-lg-5 d-flex flex-column justify-content-between">
            <div className="zk-visualizer-controls h-100">
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: '#8a6820', background: '#f3ede2', padding: '4px 12px', borderRadius: '20px', marginBottom: '10px' }}>
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                  Interactive Flooring Studio
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#16120B', marginBottom: '6px' }}>
                  Select Flooring Finish
                </h3>
                <p style={{ fontSize: '12.5px', color: '#666', marginBottom: '18px', lineHeight: 1.5 }}>
                  Click any shade below to inspect the genuine floor texture in high resolution and review trade specifications.
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
              <div className="zk-visualizer-actions" style={{ marginTop: 'auto', paddingTop: '16px' }}>
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
