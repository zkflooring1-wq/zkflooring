"use client";

import React, { useState } from 'react';

interface AreaInfo {
  name: string;
  travelTime: string;
}

const COVERED_AREAS: Record<string, AreaInfo> = {
  'B10': { name: 'Small Heath & Bordesley Green', travelTime: '5-15 mins' },
  'B9': { name: 'Bordesley & Small Heath', travelTime: '10 mins' },
  'B11': { name: 'Sparkhill & Tyseley', travelTime: '10 mins' },
  'B12': { name: 'Balsall Heath & Highgate', travelTime: '15 mins' },
  'B1': { name: 'Birmingham City Centre', travelTime: '15 mins' },
  'B2': { name: 'Birmingham Central', travelTime: '15 mins' },
  'B3': { name: 'Jewellery Quarter', travelTime: '15 mins' },
  'B4': { name: 'Aston / City Centre', travelTime: '15 mins' },
  'B5': { name: 'Digbeth & Southside', travelTime: '12 mins' },
  'B13': { name: 'Moseley', travelTime: '15 mins' },
  'B14': { name: 'Kings Heath', travelTime: '20 mins' },
  'B15': { name: 'Edgbaston', travelTime: '20 mins' },
  'B17': { name: 'Harborne', travelTime: '20 mins' },
  'B25': { name: 'Yardley & Stechford', travelTime: '10 mins' },
  'B26': { name: 'Sheldon & Airport Area', travelTime: '15 mins' },
  'B27': { name: 'Acocks Green', travelTime: '12 mins' },
  'B28': { name: 'Hall Green', travelTime: '15 mins' },
  'B29': { name: 'Selly Oak', travelTime: '20 mins' },
  'B30': { name: 'Bournville', travelTime: '25 mins' },
  'B31': { name: 'Northfield', travelTime: '25 mins' },
  'B32': { name: 'Quinton', travelTime: '25 mins' },
  'B90': { name: 'Shirley & Solihull South', travelTime: '20 mins' },
  'B91': { name: 'Solihull Town Centre', travelTime: '20 mins' },
  'B92': { name: 'Olton & Solihull North', travelTime: '15 mins' },
  'B93': { name: 'Knowle & Dorridge', travelTime: '25 mins' },
  'B23': { name: 'Erdington', travelTime: '20 mins' },
  'B24': { name: 'Castle Vale', travelTime: '15 mins' },
  'B72': { name: 'Sutton Coldfield', travelTime: '25 mins' },
  'B73': { name: 'Boldmere & Sutton Park', travelTime: '25 mins' },
  'B74': { name: 'Four Oaks & Streetly', travelTime: '30 mins' },
  'B76': { name: 'Walmley & Minworth', travelTime: '20 mins' },
  'B62': { name: 'Halesowen', travelTime: '30 mins' },
  'B66': { name: 'Smethwick', travelTime: '20 mins' },
  'B70': { name: 'West Bromwich', travelTime: '25 mins' },
  'DY1': { name: 'Dudley', travelTime: '35 mins' },
  'WS1': { name: 'Walsall', travelTime: '30 mins' },
  'WV1': { name: 'Wolverhampton', travelTime: '40 mins' },
  'CV1': { name: 'Coventry', travelTime: '35 mins' },
};

export default function PostcodeChecker() {
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [checkedResult, setCheckedResult] = useState<{
    postcode: string;
    areaName: string;
    travelTime: string;
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

  // STEP 1: Check availability
  const handleCheck = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleaned = input.trim().toUpperCase();
    if (!cleaned) {
      setCheckedResult({
        postcode: 'B10',
        areaName: 'Small Heath & Bordesley Green',
        travelTime: '5-15 mins',
      });
      return;
    }

    const match = cleaned.match(/^([A-Z]{1,2}[0-9]{1,2})/);
    const outcode = match ? match[1] : cleaned;
    const area = COVERED_AREAS[outcode];

    if (area) {
      setCheckedResult({
        postcode: outcode,
        areaName: area.name,
        travelTime: area.travelTime,
      });
    } else {
      setCheckedResult({
        postcode: outcode,
        areaName: 'Greater Birmingham Area',
        travelTime: '20-35 mins',
      });
    }
  };

  // STEP 2: Open modal
  const openModal = () => {
    const code = checkedResult?.postcode || input.trim().toUpperCase() || 'B10';
    const areaName = checkedResult?.areaName || 'Birmingham';
    setBookingForm((prev) => ({
      ...prev,
      postcode: code,
      message: `Requested Free In-Home Survey for ${areaName} (${code})`,
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
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* =========================================================================
          CLEAN LUXURY DOCK (ONE SLIM HORIZONTAL BAR)
          ========================================================================= */}
      {!isMinimized && (
        <aside aria-label="Mobile showroom booking" className="zk-clean-dock">
          <div className="zk-clean-dock-card">
            
            {!checkedResult ? (
              /* State 1: Input & Check */
              <form onSubmit={handleCheck} className="zk-dock-content-row">
                <div className="zk-dock-label">
                  <span className="zk-dock-van-dot">
                    <i className="fa-solid fa-van-shuttle"></i>
                  </span>
                  <div className="zk-dock-text">
                    <strong>Free Mobile Showroom &amp; Survey</strong>
                    <small>We bring 200+ samples to your door</small>
                  </div>
                </div>

                <div className="zk-dock-search-group">
                  <i className="fa-solid fa-location-dot zk-dock-icon"></i>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter Postcode (e.g. B10, B91, Solihull)..."
                    className="zk-dock-input-field"
                  />
                  <button type="submit" className="zk-dock-action-btn primary">
                    <span>Check Area</span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMinimized(true)}
                  className="zk-dock-dismiss-btn"
                  title="Close bar"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </form>
            ) : (
              /* State 2: Verified Result + Book Free Survey CTA */
              <div className="zk-dock-content-row verified">
                <div className="zk-dock-verified-info">
                  <span className="zk-dock-success-badge">
                    <i className="fa-solid fa-circle-check"></i>
                  </span>
                  <div className="zk-dock-text">
                    <strong style={{ color: '#166534' }}>
                      Survey Available in {checkedResult.areaName} ({checkedResult.postcode})!
                    </strong>
                    <small>
                      Free laser measuring &bull; Response time: {checkedResult.travelTime} &bull;{' '}
                      <button
                        type="button"
                        onClick={() => setCheckedResult(null)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#B45309',
                          textDecoration: 'underline',
                          fontWeight: 700,
                          cursor: 'pointer',
                          padding: 0,
                          fontSize: '11px',
                        }}
                      >
                        Change Area
                      </button>
                    </small>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <button
                    type="button"
                    onClick={openModal}
                    className="zk-dock-action-btn gold"
                  >
                    <i className="fa-solid fa-calendar-check"></i>
                    <span>Book Free Survey in {checkedResult.postcode}</span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsMinimized(true)}
                    className="zk-dock-dismiss-btn"
                    title="Close bar"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
            )}

          </div>
        </aside>
      )}

      {/* =========================================================================
          RE-OPEN CHIP (Fixed at Bottom-Left, completely away from bottom-right chat widget!)
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
          SURVEY BOOKING MODAL
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
                {checkedResult && (
                  <p style={{ fontSize: '12.5px', color: '#8a6820', fontWeight: 700, margin: '3px 0 0' }}>
                    📍 Area: {checkedResult.areaName} ({checkedResult.postcode})
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
                    setCheckedResult(null);
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
                  className="zk-dock-action-btn gold"
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
                      className="zk-dock-action-btn gold"
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
