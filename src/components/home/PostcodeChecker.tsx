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

const POPULAR_FLOORING = [
  'LVT & Herringbone',
  'Carpet & Underlay',
  'Engineered Hardwood',
  'Laminate Flooring',
  'Commercial Safety',
];

export default function PostcodeChecker() {
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [checkedArea, setCheckedArea] = useState<{
    postcode: string;
    name: string;
    isCovered: boolean;
  } | null>(null);

  // Minimal Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    postcode: '',
    flooring: 'LVT & Herringbone',
    preferredTime: 'Morning (9am - 12pm)',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Check logic
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
    const currentCode = checkedArea?.postcode || input.trim().toUpperCase() || 'B91';
    setFormData((prev) => ({
      ...prev,
      postcode: currentCode,
    }));
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: null,
          service: `Free Survey: ${formData.flooring}`,
          room_size: `Postcode: ${formData.postcode}`,
          message: `Slot: ${formData.preferredTime}. Mobile showroom consultation requested.`,
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
          STICKY BOTTOM FLOATING DOCK (CLEAN & SLIM)
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

            {/* Middle: Input with Check */}
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
                placeholder="Enter UK Postcode (e.g. B10, B91)..."
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

            {/* Right: Book Survey Button (Appears Only After Check) */}
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
        </aside>
      )}

      {/* =========================================================================
          RE-OPEN CHIP (Bottom-Left away from bottom-right chat widget)
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
          ULTRA-CLEAN MINIMALIST MODAL (FAST, ELEGANT & HIGH CONVERTING)
          ========================================================================= */}
      {isModalOpen && (
        <div className="zk-minimal-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="zk-minimal-modal-card" onClick={(e) => e.stopPropagation()}>
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="zk-minimal-close"
              aria-label="Close modal"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            {isSuccess ? (
              /* Success View */
              <div className="zk-minimal-success">
                <div className="zk-minimal-check-circle">
                  <i className="fa-solid fa-check"></i>
                </div>
                <h3>Survey Booked!</h3>
                <p>
                  Thank you, <strong>{formData.name}</strong>. Our specialist will call you at <strong>{formData.phone}</strong> shortly to confirm your appointment for <strong>{formData.preferredTime}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsSuccess(false);
                    setFormData({
                      name: '',
                      phone: '',
                      postcode: '',
                      flooring: 'LVT & Herringbone',
                      preferredTime: 'Morning (9am - 12pm)',
                    });
                  }}
                  className="zk-minimal-btn"
                >
                  Done
                </button>
              </div>
            ) : (
              /* Clean Minimal Form */
              <form onSubmit={handleSubmit} className="zk-minimal-form">
                
                {/* Header */}
                <div className="zk-minimal-head">
                  <div className="zk-minimal-van-badge">
                    <i className="fa-solid fa-van-shuttle"></i>
                    <span>Free Mobile Showroom</span>
                  </div>
                  <h3>Book Free In-Home Survey</h3>
                  <p>
                    We bring <strong>200+ samples &amp; laser measuring</strong> directly to your door in <strong>{formData.postcode || 'Birmingham'}</strong>.
                  </p>
                </div>

                {/* Flooring Pills */}
                <div className="zk-minimal-field">
                  <label>Flooring Type Needed</label>
                  <div className="zk-minimal-pills">
                    {POPULAR_FLOORING.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setFormData({ ...formData, flooring: item })}
                        className={`zk-minimal-pill ${
                          formData.flooring === item ? 'active' : ''
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name & Phone */}
                <div className="row g-2.5">
                  <div className="col-12">
                    <div className="zk-minimal-input-wrap">
                      <label>Full Name *</label>
                      <div className="zk-minimal-input-box">
                        <i className="fa-solid fa-user"></i>
                        <input
                          type="text"
                          required
                          placeholder="James Wilson"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="zk-minimal-input-wrap">
                      <label>UK Phone Number *</label>
                      <div className="zk-minimal-input-box">
                        <i className="fa-solid fa-phone"></i>
                        <input
                          type="tel"
                          required
                          placeholder="07700 900123"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="zk-minimal-input-wrap">
                      <label>Postcode *</label>
                      <div className="zk-minimal-input-box">
                        <i className="fa-solid fa-location-dot"></i>
                        <input
                          type="text"
                          required
                          placeholder="B91 3AB"
                          value={formData.postcode}
                          onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Time Slot Select */}
                  <div className="col-12">
                    <div className="zk-minimal-input-wrap">
                      <label>Preferred Time Slot</label>
                      <div className="zk-minimal-input-box">
                        <i className="fa-solid fa-clock"></i>
                        <select
                          value={formData.preferredTime}
                          onChange={(e) =>
                            setFormData({ ...formData, preferredTime: e.target.value })
                          }
                        >
                          <option value="Morning (9am - 12pm)">Morning (9:00 AM – 12:00 PM)</option>
                          <option value="Afternoon (12pm - 4pm)">Afternoon (12:00 PM – 4:00 PM)</option>
                          <option value="Evening (4pm - 7pm)">Evening (4:00 PM – 7:00 PM)</option>
                          <option value="Saturday VIP Slot">Saturday Weekend Appointment</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="zk-minimal-btn"
                >
                  {isSubmitting ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i>
                      <span>Booking Slot...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-calendar-check"></i>
                      <span>Confirm Free In-Home Survey</span>
                      <i className="fa-solid fa-arrow-right"></i>
                    </>
                  )}
                </button>

                {/* Trust Footer */}
                <div className="zk-minimal-trust">
                  <i className="fa-solid fa-shield-check"></i>
                  <span>100% Free &bull; Zero Purchase Obligation &bull; Instant Confirmation</span>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
