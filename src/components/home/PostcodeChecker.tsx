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

export default function PostcodeChecker() {
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [checkedArea, setCheckedArea] = useState<{
    postcode: string;
    name: string;
  } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    email: '',
    postcode: '',
    service: 'Luxury Vinyl Tile (LVT) & Herringbone',
    preferredSlot: 'Morning (9:00 AM - 12:00 PM)',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCheck = (query?: string) => {
    const raw = (query !== undefined ? query : input).trim().toUpperCase();
    if (!raw) {
      setCheckedArea({ postcode: 'B10', name: 'Small Heath' });
      return;
    }

    const match = raw.match(/^([A-Z]{1,2}[0-9]{1,2})/);
    const outcode = match ? match[1] : raw;
    const area = COVERED_AREAS[outcode];

    if (area) {
      setCheckedArea({ postcode: outcode, name: area.name });
    } else {
      setCheckedArea({ postcode: outcode, name: 'West Midlands' });
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
      message: `Requested Free Survey for ${areaName} (${currentCode})`,
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
          STICKY BOTTOM FLOATING DOCK (PERFECT PROPORTIONS & ZERO OVERFLOW)
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

            {/* Middle: Integrated Input with Check Button */}
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

            {/* Quick Area Pills */}
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

            {/* Right: Book Free Survey Button (Direct 1-Click to Modal) */}
            <div className="zk-dock-part-actions">
              <button
                type="button"
                onClick={openModal}
                className={`zk-dock-book-btn ${checkedArea ? 'highlight' : ''}`}
              >
                <i className="fa-solid fa-calendar-check"></i>
                <span>
                  {checkedArea
                    ? `Book Survey in ${checkedArea.postcode}`
                    : 'Book Survey'}
                </span>
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsMinimized(true)}
                className="zk-dock-close-btn"
                title="Minimize bar"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
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
          SURVEY BOOKING MODAL (DIRECT REALTIME SYNC TO ADMIN CRM)
          ========================================================================= */}
      {isModalOpen && (
        <div className="zk-survey-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="zk-survey-modal-card" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="zk-survey-modal-header">
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="zk-badge-gold">
                    <i className="fa-solid fa-van-shuttle"></i> Mobile Showroom Consultation
                  </span>
                  <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: 800 }}>
                    100% Free &amp; No Obligation
                  </span>
                </div>
                <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#16120B', margin: 0 }}>
                  Book Free In-Home Survey &amp; Sample Box
                </h3>
                {bookingForm.postcode && (
                  <p style={{ fontSize: '12.5px', color: '#8a6820', fontWeight: 700, margin: '3px 0 0' }}>
                    📍 Area: {bookingForm.postcode}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="zk-modal-close-btn"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Modal Body */}
            {isSuccess ? (
              <div className="zk-survey-success-view">
                <div className="zk-success-icon-circle">
                  <i className="fa-solid fa-check"></i>
                </div>
                <h4 style={{ fontSize: '19px', fontWeight: 800, color: '#16120B', marginBottom: '8px' }}>
                  Survey Request Confirmed!
                </h4>
                <p style={{ fontSize: '13.5px', color: '#635E57', maxWidth: '420px', margin: '0 auto 18px', lineHeight: 1.5 }}>
                  Thank you, <strong>{bookingForm.name}</strong>. Our fitting specialist will call you shortly at <strong>{bookingForm.phone}</strong> to confirm your appointment time and sample preferences.
                </p>
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
                      service: 'Luxury Vinyl Tile (LVT) & Herringbone',
                      preferredSlot: 'Morning (9:00 AM - 12:00 PM)',
                      message: '',
                    });
                  }}
                  className="zk-btn-book-survey"
                  style={{ margin: '0 auto' }}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="zk-survey-form">
                <div className="row g-2.5">
                  {/* Name */}
                  <div className="col-md-6">
                    <label className="zk-form-label">Full Name *</label>
                    <div className="zk-modal-input-wrap">
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

                  {/* Phone */}
                  <div className="col-md-6">
                    <label className="zk-form-label">Phone Number *</label>
                    <div className="zk-modal-input-wrap">
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

                  {/* Postcode / Address */}
                  <div className="col-md-6">
                    <label className="zk-form-label">Postcode / Area *</label>
                    <div className="zk-modal-input-wrap">
                      <i className="fa-solid fa-location-dot"></i>
                      <input
                        type="text"
                        required
                        placeholder="e.g. B10 9HH, Small Heath"
                        value={bookingForm.postcode}
                        onChange={(e) => setBookingForm({ ...bookingForm, postcode: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="col-md-6">
                    <label className="zk-form-label">Email (Optional)</label>
                    <div className="zk-modal-input-wrap">
                      <i className="fa-solid fa-envelope"></i>
                      <input
                        type="email"
                        placeholder="e.g. tariq@example.com"
                        value={bookingForm.email}
                        onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Flooring Type */}
                  <div className="col-md-6">
                    <label className="zk-form-label">Flooring Type Needed</label>
                    <div className="zk-modal-input-wrap">
                      <i className="fa-solid fa-layer-group"></i>
                      <select
                        value={bookingForm.service}
                        onChange={(e) => setBookingForm({ ...bookingForm, service: e.target.value })}
                      >
                        <option value="Luxury Vinyl Tile (LVT) & Herringbone">Luxury Vinyl Tile (LVT) &amp; Herringbone</option>
                        <option value="Carpet & Underlay Fitting">Carpet &amp; Underlay Fitting</option>
                        <option value="Solid & Engineered Hardwood">Solid &amp; Engineered Hardwood</option>
                        <option value="Laminate Flooring Installation">Laminate Flooring Installation</option>
                        <option value="Commercial Safety Flooring">Commercial Safety Flooring</option>
                        <option value="Self-Levelling Screed & Subfloor">Self-Levelling Screed &amp; Subfloor</option>
                      </select>
                    </div>
                  </div>

                  {/* Preferred Time Slot */}
                  <div className="col-md-6">
                    <label className="zk-form-label">Preferred Time Slot</label>
                    <div className="zk-modal-input-wrap">
                      <i className="fa-solid fa-clock"></i>
                      <select
                        value={bookingForm.preferredSlot}
                        onChange={(e) => setBookingForm({ ...bookingForm, preferredSlot: e.target.value })}
                      >
                        <option value="Morning (9:00 AM - 12:00 PM)">Morning (9:00 AM - 12:00 PM)</option>
                        <option value="Afternoon (12:00 PM - 4:00 PM)">Afternoon (12:00 PM - 4:00 PM)</option>
                        <option value="Evening (4:00 PM - 7:00 PM)">Evening (4:00 PM - 7:00 PM)</option>
                        <option value="Saturday Morning">Saturday Morning</option>
                        <option value="Urgent / Same-Day">Urgent / Same-Day</option>
                      </select>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="col-12">
                    <label className="zk-form-label">Special Notes / Rooms to Measure</label>
                    <div className="zk-modal-input-wrap textarea-wrap">
                      <textarea
                        rows={2}
                        placeholder="e.g. Living room & hallway measuring, bring oak samples..."
                        value={bookingForm.message}
                        onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="d-flex align-items-center justify-content-between pt-3 mt-3 border-top">
                  <div style={{ fontSize: '11px', color: '#777' }}>
                    🔒 100% Free &bull; No Obligation
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="zk-btn-cancel"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="zk-btn-book-survey"
                      style={{ border: 'none', cursor: 'pointer' }}
                    >
                      {isSubmitting ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin"></i>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-paper-plane"></i>
                          <span>Confirm Booking</span>
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
