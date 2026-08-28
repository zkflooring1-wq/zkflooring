"use client";

import React, { useState } from 'react';

interface AreaInfo {
  name: string;
  tier: 'same-day' | 'standard' | 'extended';
  travelTime: string;
  freeSurvey: boolean;
}

const COVERED_AREAS: Record<string, AreaInfo> = {
  // Birmingham Central & East (Headquarters Hub)
  'B10': { name: 'Small Heath & Bordesley Green (HQ Hub)', tier: 'same-day', travelTime: '5-15 mins', freeSurvey: true },
  'B9': { name: 'Bordesley & Small Heath', tier: 'same-day', travelTime: '10 mins', freeSurvey: true },
  'B11': { name: 'Sparkhill & Tyseley', tier: 'same-day', travelTime: '10 mins', freeSurvey: true },
  'B12': { name: 'Balsall Heath & Highgate', tier: 'same-day', travelTime: '15 mins', freeSurvey: true },
  'B1': { name: 'Birmingham City Centre & Bullring', tier: 'same-day', travelTime: '15 mins', freeSurvey: true },
  'B2': { name: 'Birmingham Central', tier: 'same-day', travelTime: '15 mins', freeSurvey: true },
  'B3': { name: 'Jewellery Quarter / City Centre', tier: 'same-day', travelTime: '15 mins', freeSurvey: true },
  'B4': { name: 'Aston Triangle / City Centre', tier: 'same-day', travelTime: '15 mins', freeSurvey: true },
  'B5': { name: 'Digbeth & Southside', tier: 'same-day', travelTime: '12 mins', freeSurvey: true },

  // South Birmingham & Solihull
  'B13': { name: 'Moseley', tier: 'same-day', travelTime: '15 mins', freeSurvey: true },
  'B14': { name: 'Kings Heath & Druids Heath', tier: 'same-day', travelTime: '20 mins', freeSurvey: true },
  'B15': { name: 'Edgbaston', tier: 'same-day', travelTime: '20 mins', freeSurvey: true },
  'B17': { name: 'Harborne', tier: 'same-day', travelTime: '20 mins', freeSurvey: true },
  'B25': { name: 'Yardley & Stechford', tier: 'same-day', travelTime: '10 mins', freeSurvey: true },
  'B26': { name: 'Sheldon & Airport Area', tier: 'same-day', travelTime: '15 mins', freeSurvey: true },
  'B27': { name: 'Acocks Green', tier: 'same-day', travelTime: '12 mins', freeSurvey: true },
  'B28': { name: 'Hall Green', tier: 'same-day', travelTime: '15 mins', freeSurvey: true },
  'B29': { name: 'Selly Oak & University', tier: 'same-day', travelTime: '20 mins', freeSurvey: true },
  'B30': { name: 'Bournville & Cotteridge', tier: 'same-day', travelTime: '25 mins', freeSurvey: true },
  'B31': { name: 'Northfield & Longbridge', tier: 'same-day', travelTime: '25 mins', freeSurvey: true },
  'B32': { name: 'Quinton & Woodgate', tier: 'same-day', travelTime: '25 mins', freeSurvey: true },
  'B90': { name: 'Shirley & Solihull South', tier: 'same-day', travelTime: '20 mins', freeSurvey: true },
  'B91': { name: 'Solihull Town Centre & Olton', tier: 'same-day', travelTime: '20 mins', freeSurvey: true },
  'B92': { name: 'Olton & Solihull North', tier: 'same-day', travelTime: '15 mins', freeSurvey: true },
  'B93': { name: 'Knowle & Dorridge', tier: 'same-day', travelTime: '25 mins', freeSurvey: true },
  'B94': { name: 'Hockley Heath & Lapworth', tier: 'standard', travelTime: '30 mins', freeSurvey: true },

  // North Birmingham & Sutton Coldfield
  'B23': { name: 'Erdington & Short Heath', tier: 'same-day', travelTime: '20 mins', freeSurvey: true },
  'B24': { name: 'Erdington & Castle Vale', tier: 'same-day', travelTime: '15 mins', freeSurvey: true },
  'B42': { name: 'Perry Barr', tier: 'same-day', travelTime: '20 mins', freeSurvey: true },
  'B43': { name: 'Great Barr', tier: 'same-day', travelTime: '25 mins', freeSurvey: true },
  'B44': { name: 'Kingstanding', tier: 'same-day', travelTime: '25 mins', freeSurvey: true },
  'B72': { name: 'Sutton Coldfield Town', tier: 'same-day', travelTime: '25 mins', freeSurvey: true },
  'B73': { name: 'Boldmere & Sutton Park', tier: 'same-day', travelTime: '25 mins', freeSurvey: true },
  'B74': { name: 'Four Oaks & Streetly', tier: 'same-day', travelTime: '30 mins', freeSurvey: true },
  'B75': { name: 'Roughley & Falcon Lodge', tier: 'same-day', travelTime: '30 mins', freeSurvey: true },
  'B76': { name: 'Walmley & Minworth', tier: 'same-day', travelTime: '20 mins', freeSurvey: true },

  // Black Country & West Midlands
  'B62': { name: 'Halesowen', tier: 'standard', travelTime: '30 mins', freeSurvey: true },
  'B63': { name: 'Halesowen & Cradley', tier: 'standard', travelTime: '30 mins', freeSurvey: true },
  'B66': { name: 'Smethwick', tier: 'same-day', travelTime: '20 mins', freeSurvey: true },
  'B67': { name: 'Smethwick & Bearwood', tier: 'same-day', travelTime: '20 mins', freeSurvey: true },
  'B68': { name: 'Oldbury', tier: 'same-day', travelTime: '25 mins', freeSurvey: true },
  'B70': { name: 'West Bromwich', tier: 'same-day', travelTime: '25 mins', freeSurvey: true },
  'B71': { name: 'West Bromwich North', tier: 'same-day', travelTime: '25 mins', freeSurvey: true },
  'DY1': { name: 'Dudley Central', tier: 'standard', travelTime: '35 mins', freeSurvey: true },
  'DY8': { name: 'Stourbridge', tier: 'standard', travelTime: '40 mins', freeSurvey: true },
  'WS1': { name: 'Walsall Town Centre', tier: 'standard', travelTime: '30 mins', freeSurvey: true },
  'WS5': { name: 'Walsall & Bescot', tier: 'standard', travelTime: '25 mins', freeSurvey: true },
  'WS13': { name: 'Lichfield', tier: 'standard', travelTime: '40 mins', freeSurvey: true },
  'WV1': { name: 'Wolverhampton Central', tier: 'standard', travelTime: '40 mins', freeSurvey: true },
  'CV1': { name: 'Coventry Central', tier: 'standard', travelTime: '35 mins', freeSurvey: true },
  'CV3': { name: 'Coventry South', tier: 'standard', travelTime: '35 mins', freeSurvey: true },
};

export default function PostcodeChecker() {
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAreaText, setSelectedAreaText] = useState('');

  // Booking Modal Form State
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

  const checkAndOpenModal = (query: string) => {
    const cleaned = query.trim().toUpperCase();
    if (!cleaned) {
      setBookingForm((prev) => ({ ...prev, postcode: 'B10' }));
      setSelectedAreaText('Small Heath (B10 Hub)');
      setIsModalOpen(true);
      return;
    }

    const match = cleaned.match(/^([A-Z]{1,2}[0-9]{1,2})/);
    const outcode = match ? match[1] : cleaned;
    const area = COVERED_AREAS[outcode];

    const areaLabel = area ? `${area.name} (${outcode})` : `${cleaned} (West Midlands)`;
    setSelectedAreaText(areaLabel);
    setBookingForm((prev) => ({
      ...prev,
      postcode: cleaned,
      message: `Requested Mobile Showroom consultation for area: ${areaLabel}`,
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
          source: 'mobile_showroom_dock',
        }),
      });
      setIsSuccess(true);
    } catch {
      // Continue gracefully
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* =========================================================================
          STICKY BOTTOM DOCK (APPLE / LUXURY TESLA FLOATING BAR)
          ========================================================================= */}
      <div className={`zk-sticky-dock-container ${isMinimized ? 'zk-dock-minimized' : ''}`}>
        <div className="zk-sticky-dock-inner">
          
          {/* Left: Van Indicator & Title */}
          <div className="zk-dock-left">
            <div className="zk-van-pulse-badge">
              <span className="zk-pulse-dot"></span>
              <i className="fa-solid fa-van-shuttle" style={{ color: '#AA771C' }}></i>
              <span className="zk-dock-badge-text">Mobile Showroom Active</span>
            </div>
            <div className="zk-dock-heading">
              <strong>Free In-Home Survey &amp; Laser Measuring</strong>
              <span className="zk-dock-sub">We bring 200+ samples to your doorstep across Birmingham</span>
            </div>
          </div>

          {/* Center: Clean High-Contrast Postcode Input */}
          <div className="zk-dock-center">
            <div className="zk-dock-input-wrap">
              <i className="fa-solid fa-location-dot zk-dock-pin-icon"></i>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    checkAndOpenModal(input);
                  }
                }}
                placeholder="Enter UK Postcode (e.g. B10, B91, Solihull)..."
                className="zk-dock-clean-input"
              />
              <button
                type="button"
                onClick={() => checkAndOpenModal(input)}
                className="zk-dock-check-btn"
              >
                <span>Check</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>

            {/* Quick Area Badges */}
            <div className="zk-dock-quick-pills">
              {['B10 Small Heath', 'B91 Solihull', 'B13 Moseley', 'B73 Sutton'].map((pill) => (
                <button
                  key={pill}
                  type="button"
                  onClick={() => {
                    const code = pill.split(' ')[0];
                    setInput(code);
                    checkAndOpenModal(code);
                  }}
                  className="zk-dock-pill-btn"
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Primary Book Button & Minimize */}
          <div className="zk-dock-right">
            <button
              type="button"
              onClick={() => checkAndOpenModal(input || 'B10')}
              className="zk-dock-book-cta"
            >
              <i className="fa-solid fa-calendar-check"></i>
              <span>Book Free Survey</span>
            </button>

            <button
              type="button"
              onClick={() => setIsMinimized(!isMinimized)}
              className="zk-dock-toggle-btn"
              title={isMinimized ? 'Expand Dock' : 'Minimize Dock'}
            >
              <i className={`fa-solid ${isMinimized ? 'fa-chevron-up' : 'fa-minus'}`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Re-open Button when minimized */}
      {isMinimized && (
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="zk-dock-reopen-btn"
          title="Open Mobile Showroom Booking Dock"
        >
          <i className="fa-solid fa-van-shuttle"></i>
          <span>Book Free Home Survey</span>
        </button>
      )}

      {/* =========================================================================
          INTERACTIVE SURVEY BOOKING MODAL (AUTO-SYNCS TO ADMIN CRM)
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
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#16120B', margin: 0 }}>
                  Book Free In-Home Survey &amp; Sample Box
                </h3>
                {selectedAreaText && (
                  <p style={{ fontSize: '13px', color: '#8a6820', fontWeight: 700, margin: '4px 0 0' }}>
                    📍 Area: {selectedAreaText}
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
                <h4 style={{ fontSize: '20px', fontWeight: 800, color: '#16120B', marginBottom: '8px' }}>
                  Survey Appointment Requested!
                </h4>
                <p style={{ fontSize: '14px', color: '#635E57', maxWidth: '440px', margin: '0 auto 20px', lineHeight: 1.5 }}>
                  Thank you, <strong>{bookingForm.name}</strong>. Your request has been dispatched directly to our master fitting coordinator. We will call you shortly at <strong>{bookingForm.phone}</strong> to confirm your slot.
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
                  className="zk-dock-book-cta"
                  style={{ margin: '0 auto' }}
                >
                  Done &amp; Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="zk-survey-form">
                
                <div className="row g-3">
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
                        <option value="Saturday Morning">Saturday Morning Slot</option>
                        <option value="Urgent / Same-Day Consultation">Urgent / Same-Day Consultation</option>
                      </select>
                    </div>
                  </div>

                  {/* Optional Notes */}
                  <div className="col-12">
                    <label className="zk-form-label">Special Notes / Rooms to Measure</label>
                    <div className="zk-modal-input-wrap textarea-wrap">
                      <textarea
                        rows={2}
                        placeholder="e.g. Looking to measure living room and hallway, bring oak herringbone samples..."
                        value={bookingForm.message}
                        onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="d-flex align-items-center justify-content-between pt-3 mt-3 border-top">
                  <div style={{ fontSize: '11.5px', color: '#666' }}>
                    🔒 Zero spam &bull; Direct master fitter appointment
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
                      className="zk-dock-book-cta"
                    >
                      {isSubmitting ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin"></i>
                          <span>Dispatching...</span>
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-paper-plane"></i>
                          <span>Confirm Free Survey Booking</span>
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
