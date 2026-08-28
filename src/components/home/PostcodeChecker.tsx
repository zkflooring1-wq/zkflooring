"use client";

import React, { useState } from 'react';

interface AreaInfo {
  name: string;
  travelTime: string;
}

const COVERED_AREAS: Record<string, AreaInfo> = {
  'B10': { name: 'Small Heath', travelTime: '5-15 mins' },
  'B9': { name: 'Bordesley', travelTime: '10 mins' },
  'B11': { name: 'Sparkhill', travelTime: '10 mins' },
  'B12': { name: 'Balsall Heath', travelTime: '15 mins' },
  'B1': { name: 'City Centre', travelTime: '15 mins' },
  'B2': { name: 'Central', travelTime: '15 mins' },
  'B3': { name: 'Jewellery Quarter', travelTime: '15 mins' },
  'B13': { name: 'Moseley', travelTime: '15 mins' },
  'B14': { name: 'Kings Heath', travelTime: '20 mins' },
  'B15': { name: 'Edgbaston', travelTime: '20 mins' },
  'B17': { name: 'Harborne', travelTime: '20 mins' },
  'B25': { name: 'Yardley', travelTime: '10 mins' },
  'B26': { name: 'Sheldon', travelTime: '15 mins' },
  'B27': { name: 'Acocks Green', travelTime: '12 mins' },
  'B28': { name: 'Hall Green', travelTime: '15 mins' },
  'B90': { name: 'Shirley', travelTime: '20 mins' },
  'B91': { name: 'Solihull', travelTime: '20 mins' },
  'B92': { name: 'Olton', travelTime: '15 mins' },
  'B72': { name: 'Sutton Coldfield', travelTime: '25 mins' },
  'B73': { name: 'Boldmere', travelTime: '25 mins' },
  'B74': { name: 'Four Oaks', travelTime: '30 mins' },
  'B62': { name: 'Halesowen', travelTime: '30 mins' },
  'B66': { name: 'Smethwick', travelTime: '20 mins' },
  'WS1': { name: 'Walsall', travelTime: '30 mins' },
  'DY1': { name: 'Dudley', travelTime: '35 mins' },
  'WV1': { name: 'Wolverhampton', travelTime: '40 mins' },
  'CV1': { name: 'Coventry', travelTime: '35 mins' },
};

const FLOORING_CHOICES = [
  { id: 'LVT & Herringbone', icon: 'fa-cubes-stacked', label: 'LVT & Herringbone', desc: 'Luxury vinyl & parquet' },
  { id: 'Carpet & Underlay', icon: 'fa-rug', label: 'Carpet & Underlay', desc: 'Plush, twist & saxony' },
  { id: 'Hardwood & Engineered', icon: 'fa-tree', label: 'Engineered Wood', desc: 'Natural oak & timber' },
  { id: 'Laminate Flooring', icon: 'fa-layer-group', label: 'Laminate Floors', desc: 'Durable & modern' },
  { id: 'Commercial Safety', icon: 'fa-building', label: 'Commercial Safety', desc: 'Altro & Polyflor' },
  { id: 'Subfloor Screeding', icon: 'fa-trowel-bricks', label: 'Subfloor & Screed', desc: 'Smoothing & leveling' },
];

const TIME_SLOTS = [
  { id: 'Morning (9:00 AM - 12:00 PM)', label: 'Morning', time: '9am - 12pm', icon: 'fa-sun' },
  { id: 'Afternoon (12:00 PM - 4:00 PM)', label: 'Afternoon', time: '12pm - 4pm', icon: 'fa-cloud-sun' },
  { id: 'Evening (4:00 PM - 7:00 PM)', label: 'Evening', time: '4pm - 7pm', icon: 'fa-moon' },
  { id: 'Saturday Morning', label: 'Saturday', time: 'Weekend Slot', icon: 'fa-calendar-day' },
];

export default function PostcodeChecker() {
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [checkedArea, setCheckedArea] = useState<{
    postcode: string;
    name: string;
    isCovered: boolean;
  } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    email: '',
    postcode: '',
    service: 'LVT & Herringbone',
    preferredSlot: 'Morning (9:00 AM - 12:00 PM)',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Check logic: Supports both covered (check) and extended (cross/notice)
  const handleCheck = (query?: string) => {
    const raw = (query !== undefined ? query : input).trim().toUpperCase();
    if (!raw) {
      setCheckedArea({ postcode: 'B10', name: 'Small Heath', isCovered: true });
      return;
    }

    const match = raw.match(/^([A-Z]{1,2}[0-9]{1,2})/);
    const outcode = match ? match[1] : raw;
    const area = COVERED_AREAS[outcode];

    if (area) {
      setCheckedArea({ postcode: outcode, name: area.name, isCovered: true });
    } else if (
      raw.startsWith('B') ||
      raw.startsWith('WS') ||
      raw.startsWith('DY') ||
      raw.startsWith('WV') ||
      raw.startsWith('CV')
    ) {
      setCheckedArea({ postcode: outcode, name: 'West Midlands', isCovered: true });
    } else {
      setCheckedArea({ postcode: raw, name: 'Extended Radius', isCovered: false });
    }
  };

  const handlePillClick = (code: string) => {
    setInput(code);
    handleCheck(code);
  };

  const openModal = () => {
    const currentCode = checkedArea?.postcode || input.trim().toUpperCase() || 'B10';
    const areaName = checkedArea?.name || 'Birmingham';

    setBookingForm((prev) => ({
      ...prev,
      postcode: currentCode,
      message: `Requested In-Home Survey for ${areaName} (${currentCode})`,
    }));
    setIsModalOpen(true);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: bookingForm.name,
          phone: bookingForm.phone,
          email: bookingForm.email || null,
          service: `Free Survey: ${bookingForm.service}`,
          room_size: `Postcode: ${bookingForm.postcode}`,
          message: `Slot: ${bookingForm.preferredSlot}. ${bookingForm.message || ''}`.trim(),
          source: 'sticky_bottom_dock',
        }),
      });
      setIsSuccess(true);
    } catch {
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* =========================================================================
          STICKY BOTTOM FLOATING DOCK (BUTTON APPEARS ONLY AFTER CHECKING)
          ========================================================================= */}
      {!isMinimized && (
        <aside aria-label="Mobile showroom booking" className="zk-sticky-dock-bar-wrap">
          <div className="zk-sticky-dock-pill">
            
            {/* Left: Van Icon & Title */}
            <div className="zk-dock-part-brand">
              <span className="zk-dock-van-circle">
                <i className="fa-solid fa-van-shuttle"></i>
              </span>
              <div className="zk-dock-brand-labels">
                <strong>Free Home Survey</strong>
                <span>Birmingham &amp; West Midlands</span>
              </div>
            </div>

            {/* Middle: Integrated Input with Check Action */}
            <div className="zk-dock-part-search">
              <i className="fa-solid fa-location-dot zk-dock-search-pin"></i>
              <input
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  if (!e.target.value) setCheckedArea(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleCheck(input);
                  }
                }}
                placeholder="Enter Postcode (e.g. B10, B91)..."
                className="zk-dock-input"
              />
              <button
                type="button"
                onClick={() => handleCheck(input)}
                className="zk-dock-check-action"
              >
                Check
              </button>
            </div>

            {/* Quick Area Pills (Visible on larger screens) */}
            <div className="zk-dock-part-pills d-none d-xl-flex">
              {[
                { code: 'B10', label: 'B10' },
                { code: 'B91', label: 'B91 Solihull' },
                { code: 'B13', label: 'B13' },
                { code: 'B73', label: 'B73' },
              ].map((pill) => (
                <button
                  key={pill.code}
                  type="button"
                  onClick={() => handlePillClick(pill.code)}
                  className={`zk-dock-quick-pill ${
                    checkedArea?.postcode === pill.code ? 'active' : ''
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Right: Book Survey Button APPEARS ONLY AFTER CHECK (Check ✅ or Cross ❌) */}
            {checkedArea && (
              <div className="zk-dock-part-actions">
                <button
                  type="button"
                  onClick={openModal}
                  className={`zk-dock-book-btn ${
                    checkedArea.isCovered ? 'highlight' : 'extended'
                  }`}
                >
                  <i
                    className={`fa-solid ${
                      checkedArea.isCovered ? 'fa-circle-check' : 'fa-circle-exclamation'
                    }`}
                    style={{
                      color: checkedArea.isCovered ? '#166534' : '#92400E',
                      fontSize: '13px',
                    }}
                  ></i>
                  <span>
                    {checkedArea.isCovered
                      ? `Book Survey in ${checkedArea.postcode}`
                      : `Request Survey (${checkedArea.postcode})`}
                  </span>
                  <i className="fa-solid fa-arrow-right" style={{ fontSize: '11px' }}></i>
                </button>
              </div>
            )}

            {/* Close / Minimize Button */}
            <button
              type="button"
              onClick={() => setIsMinimized(true)}
              className="zk-dock-close-btn"
              title="Minimize bar"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </aside>
      )}

      {/* =========================================================================
          RE-OPEN CHIP (Positioned Bottom-Left away from bottom-right chat widget!)
          ========================================================================= */}
      {isMinimized && (
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="zk-dock-reopen-chip"
          title="Open Free Home Survey"
        >
          <i className="fa-solid fa-van-shuttle" style={{ color: '#AA771C' }}></i>
          <span>Free Home Survey</span>
        </button>
      )}

      {/* =========================================================================
          ULTRA-BEAUTIFUL LUXURY SURVEY BOOKING MODAL (10/10 DESIGN)
          ========================================================================= */}
      {isModalOpen && (
        <div className="zk-survey-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="zk-luxury-modal-container" onClick={(e) => e.stopPropagation()}>
            
            {/* Top Luxury Banner */}
            <div className="zk-luxury-modal-top">
              <div className="zk-luxury-modal-top-content">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="zk-modal-tag-gold">
                    <i className="fa-solid fa-van-shuttle"></i> Mobile Showroom Consultation
                  </span>
                  <span className="zk-modal-tag-green">
                    <i className="fa-solid fa-shield-check"></i> 100% Free &bull; No Obligation
                  </span>
                </div>
                <h3 className="zk-luxury-modal-title">
                  Book Your Free In-Home Survey &amp; Sample Box
                </h3>
                <p className="zk-luxury-modal-subtitle">
                  We bring <strong>200+ physical samples</strong>, subfloor testing &amp; precision laser measuring directly to your doorstep in <strong>{bookingForm.postcode || 'Birmingham'}</strong>.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="zk-luxury-modal-close"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Modal Body */}
            {isSuccess ? (
              <div className="zk-luxury-success-view">
                <div className="zk-luxury-success-ring">
                  <i className="fa-solid fa-check"></i>
                </div>
                <h4>Survey Appointment Request Received!</h4>
                <p>
                  Thank you, <strong>{bookingForm.name}</strong>. Our senior fitting specialist will call you shortly at <strong>{bookingForm.phone}</strong> to confirm your slot for <strong>{bookingForm.preferredSlot}</strong>.
                </p>

                <div className="zk-success-perks">
                  <div className="zk-perk-item">
                    <i className="fa-solid fa-truck-fast"></i>
                    <span>Mobile van arrives at your property</span>
                  </div>
                  <div className="zk-perk-item">
                    <i className="fa-solid fa-ruler-combined"></i>
                    <span>Full room precision laser measuring</span>
                  </div>
                  <div className="zk-perk-item">
                    <i className="fa-solid fa-file-invoice-dollar"></i>
                    <span>Same-day written guarantee quote</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsSuccess(false);
                    setBookingForm({
                      name: '',
                      phone: '',
                      email: '',
                      postcode: '',
                      service: 'LVT & Herringbone',
                      preferredSlot: 'Morning (9:00 AM - 12:00 PM)',
                      message: '',
                    });
                  }}
                  className="zk-luxury-submit-btn"
                  style={{ maxWidth: '240px', margin: '0 auto' }}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="zk-luxury-form-body">
                
                {/* 1. Interactive Flooring Type Cards */}
                <div className="zk-form-section">
                  <label className="zk-section-heading">
                    <span>1</span> Select Flooring Samples to Bring to Your Home
                  </label>
                  <div className="zk-flooring-grid">
                    {FLOORING_CHOICES.map((choice) => (
                      <button
                        key={choice.id}
                        type="button"
                        onClick={() => setBookingForm({ ...bookingForm, service: choice.id })}
                        className={`zk-flooring-card ${
                          bookingForm.service === choice.id ? 'active' : ''
                        }`}
                      >
                        <div className="zk-flooring-card-icon">
                          <i className={`fa-solid ${choice.icon}`}></i>
                        </div>
                        <div className="zk-flooring-card-info">
                          <strong>{choice.label}</strong>
                          <span>{choice.desc}</span>
                        </div>
                        {bookingForm.service === choice.id && (
                          <span className="zk-flooring-selected-check">
                            <i className="fa-solid fa-check"></i>
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Interactive Time Slot Buttons */}
                <div className="zk-form-section">
                  <label className="zk-section-heading">
                    <span>2</span> Choose Preferred Consultation Time Slot
                  </label>
                  <div className="zk-slot-grid">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setBookingForm({ ...bookingForm, preferredSlot: slot.id })}
                        className={`zk-slot-pill ${
                          bookingForm.preferredSlot === slot.id ? 'active' : ''
                        }`}
                      >
                        <i className={`fa-solid ${slot.icon}`}></i>
                        <div>
                          <strong>{slot.label}</strong>
                          <small>{slot.time}</small>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Customer Contact Details */}
                <div className="zk-form-section">
                  <label className="zk-section-heading">
                    <span>3</span> Your Contact &amp; Property Details
                  </label>
                  <div className="row g-2.5">
                    {/* Name */}
                    <div className="col-md-6">
                      <div className="zk-input-container">
                        <label>Full Name *</label>
                        <div className="zk-input-box-inner">
                          <i className="fa-solid fa-user"></i>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Tariq Mehmood"
                            value={bookingForm.name}
                            onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="col-md-6">
                      <div className="zk-input-container">
                        <label>Phone Number (For Booking Confirmation) *</label>
                        <div className="zk-input-box-inner">
                          <i className="fa-solid fa-phone"></i>
                          <input
                            type="tel"
                            required
                            placeholder="e.g. 07903 723 774"
                            value={bookingForm.phone}
                            onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Postcode / Address */}
                    <div className="col-md-6">
                      <div className="zk-input-container">
                        <label>Postcode / Area *</label>
                        <div className="zk-input-box-inner">
                          <i className="fa-solid fa-location-dot"></i>
                          <input
                            type="text"
                            required
                            placeholder="e.g. B91 3AB, Solihull"
                            value={bookingForm.postcode}
                            onChange={(e) => setBookingForm({ ...bookingForm, postcode: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="col-md-6">
                      <div className="zk-input-container">
                        <label>Email (For Quote PDF)</label>
                        <div className="zk-input-box-inner">
                          <i className="fa-solid fa-envelope"></i>
                          <input
                            type="email"
                            placeholder="e.g. tariq@example.com"
                            value={bookingForm.email}
                            onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="col-12">
                      <div className="zk-input-container">
                        <label>Rooms to Measure / Special Requirements (Optional)</label>
                        <div className="zk-input-box-inner">
                          <i className="fa-solid fa-comment-dots"></i>
                          <input
                            type="text"
                            placeholder="e.g. Hallway &amp; living room, bringing natural oak samples..."
                            value={bookingForm.message}
                            onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="zk-luxury-modal-footer">
                  <div className="zk-footer-trust">
                    <i className="fa-solid fa-lock"></i>
                    <span>100% Free &bull; No Obligation &bull; Instant Confirmation</span>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="zk-luxury-cancel-btn"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="zk-luxury-submit-btn"
                    >
                      {isSubmitting ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin"></i>
                          <span>Confirming...</span>
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-calendar-check"></i>
                          <span>Confirm Free Appointment</span>
                          <i className="fa-solid fa-arrow-right"></i>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
