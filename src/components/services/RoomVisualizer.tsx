"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface FloorFinish {
  id: string;
  name: string;
  type: string;
  swatchColor: string;
  image: string;
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
    swatchColor: 'linear-gradient(135deg, #d4a359, #b58338)',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
    description: 'Classic British honey oak herringbone with micro-bevelled edges. Combines timeless warmth with ultra-durable 0.55mm commercial wear resistance.',
    specs: {
      wearLayer: '0.55mm Commercial PVC',
      waterproof: '100% Waterproof',
      warranty: '25-Year Residential',
      ufhCompatible: 'Yes (Up to 27°C under BS 8203)',
      bestFor: 'Hallways, Living Rooms, Kitchens'
    },
    priceRange: '£38 - £52 / m²'
  },
  {
    id: 'smoke-grey',
    name: 'Nordic Smoke Grey',
    type: 'Ultra-Matte Wide Plank LVT',
    swatchColor: 'linear-gradient(135deg, #a69f97, #7a736c)',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85',
    description: 'Contemporary Scandinavian grey with subtle natural grain texture. Creates an expansive, bright atmosphere in modern UK open-plan homes.',
    specs: {
      wearLayer: '0.55mm Scratch-Guard',
      waterproof: '100% Waterproof',
      warranty: '20-Year Residential',
      ufhCompatible: 'Yes (Excellent Thermal Transfer)',
      bestFor: 'Open-Plan Living, Bathrooms, Dining'
    },
    priceRange: '£34 - £46 / m²'
  },
  {
    id: 'dark-walnut',
    name: 'Heritage Dark Walnut',
    type: 'Engineered Hardwood Parquet',
    swatchColor: 'linear-gradient(135deg, #5c3e21, #362211)',
    image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1600&q=85',
    description: 'Rich, luxurious dark walnut engineered timber with a UV-cured matte lacquer finish. Brings dramatic elegance and natural wood character.',
    specs: {
      wearLayer: '4mm European Walnut Top Layer',
      waterproof: 'Water-Resistant (Sealed)',
      warranty: '30-Year Structural',
      ufhCompatible: 'Yes (Engineered Multi-Ply Core)',
      bestFor: 'Master Bedrooms, Formal Lounges, Offices'
    },
    priceRange: '£65 - £88 / m²'
  },
  {
    id: 'champagne-lvt',
    name: 'Champagne Royal Parquet',
    type: 'Luxury Click Vinyl Tile',
    swatchColor: 'linear-gradient(135deg, #e3d2ba, #c4ae8d)',
    image: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=1600&q=85',
    description: 'Bright, airy champagne tones with delicate timber graining. Reflects natural ambient light to make spaces feel bigger and more inviting.',
    specs: {
      wearLayer: '0.70mm Heavy Commercial',
      waterproof: '100% Waterproof Impervious',
      warranty: 'Lifetime Residential',
      ufhCompatible: 'Yes (BS 8203 Certified)',
      bestFor: 'Kitchens, Conservatories, Hallways'
    },
    priceRange: '£42 - £58 / m²'
  },
  {
    id: 'charcoal-carpet',
    name: 'Plush Charcoal Saxony',
    type: 'Deep Pile Luxury Carpet',
    swatchColor: 'linear-gradient(135deg, #42454a, #232528)',
    image: 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1600&q=85',
    description: 'Ultra-soft deep saxony carpet paired with 12mm Cloud9 high-density underlay for supreme underfoot comfort and acoustic sound deadening.',
    specs: {
      wearLayer: '2,200g/m² Heavy Density Pile',
      waterproof: '10-Year Stain-Safe Protection',
      warranty: '15-Year Wear Warranty',
      ufhCompatible: 'Yes (1.8 TOG Rating)',
      bestFor: 'Bedrooms, Stairs, Cinema Rooms'
    },
    priceRange: '£28 - £44 / m²'
  }
];

export default function RoomVisualizer() {
  const [selected, setSelected] = useState<FloorFinish>(FLOOR_FINISHES[0]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSelect = (finish: FloorFinish) => {
    if (finish.id === selected.id) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setSelected(finish);
      setIsTransitioning(false);
    }, 200);
  };

  return (
    <div className="zk-visualizer-container">
      {/* Visualizer Frame */}
      <div className="zk-visualizer-card">
        <div className="row g-0">
          {/* Left / Top: Interactive Room Canvas */}
          <div className="col-lg-7">
            <div className="zk-visualizer-canvas">
              <img
                src={selected.image}
                alt={selected.name}
                className={`zk-visualizer-img ${isTransitioning ? 'fade-out' : 'fade-in'}`}
              />
              
              {/* Floating Live Swatch Badge */}
              <div className="zk-visualizer-badge">
                <div
                  className="zk-swatch-dot"
                  style={{ background: selected.swatchColor }}
                />
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {selected.type}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#16120B' }}>
                    {selected.name}
                  </div>
                </div>
              </div>

              {/* Price Tag Indicator */}
              <div className="zk-visualizer-price-tag">
                <i className="fa-solid fa-tag" style={{ color: '#B38728', marginRight: '6px' }}></i>
                {selected.priceRange} (inc. supply & fit)
              </div>
            </div>
          </div>

          {/* Right / Bottom: Interactive Swatch Selector & Specs */}
          <div className="col-lg-5">
            <div className="zk-visualizer-controls">
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: '#8a6820', background: '#f3ede2', padding: '3px 10px', borderRadius: '20px', marginBottom: '8px' }}>
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                  Interactive Visualizer
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#16120B', marginBottom: '6px' }}>
                  Choose Your Luxury Finish
                </h3>
                <p style={{ fontSize: '12.5px', color: '#666', marginBottom: '20px', lineHeight: 1.5 }}>
                  Click below to switch textures and see how our premium materials look in a luxury UK home setting.
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

                {/* Live Specifications HUD */}
                <div className="zk-specs-hud">
                  <div className="zk-specs-row">
                    <span className="zk-spec-label"><i className="fa-solid fa-shield-halved"></i> Wear Rating:</span>
                    <span className="zk-spec-value">{selected.specs.wearLayer}</span>
                  </div>
                  <div className="zk-specs-row">
                    <span className="zk-spec-label"><i className="fa-solid fa-droplet"></i> Moisture:</span>
                    <span className="zk-spec-value">{selected.specs.waterproof}</span>
                  </div>
                  <div className="zk-specs-row">
                    <span className="zk-spec-label"><i className="fa-solid fa-fire"></i> Underfloor Heat:</span>
                    <span className="zk-spec-value">{selected.specs.ufhCompatible}</span>
                  </div>
                  <div className="zk-specs-row">
                    <span className="zk-spec-label"><i className="fa-solid fa-award"></i> Guarantee:</span>
                    <span className="zk-spec-value">{selected.specs.warranty}</span>
                  </div>
                  <div className="zk-specs-row">
                    <span className="zk-spec-label"><i className="fa-solid fa-house"></i> Ideal For:</span>
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
                  Request Free Sample Box
                </Link>
                <a
                  href="tel:07903723774"
                  className="zk-btn-dark"
                >
                  <i className="fa-solid fa-phone" style={{ color: '#D4AF37', marginRight: '6px' }}></i>
                  Book Survey with this Floor
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
