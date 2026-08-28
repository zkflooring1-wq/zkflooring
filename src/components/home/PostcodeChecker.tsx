"use client";

import React, { useState } from 'react';

interface AreaInfo {
  name: string;
  travelTime: string;
}

const COVERED_AREAS: Record<string, AreaInfo> = {
  'B10': { name: 'Small Heath & Bordesley', travelTime: '5-15 mins' },
  'B9': { name: 'Bordesley Green', travelTime: '10 mins' },
  'B11': { name: 'Sparkhill & Tyseley', travelTime: '10 mins' },
  'B12': { name: 'Balsall Heath', travelTime: '15 mins' },
  'B1': { name: 'Birmingham City Centre', travelTime: '15 mins' },
  'B2': { name: 'Birmingham Central', travelTime: '15 mins' },
  'B3': { name: 'Jewellery Quarter', travelTime: '15 mins' },
  'B13': { name: 'Moseley', travelTime: '15 mins' },
  'B14': { name: 'Kings Heath', travelTime: '20 mins' },
  'B15': { name: 'Edgbaston', travelTime: '20 mins' },
  'B17': { name: 'Harborne', travelTime: '20 mins' },
  'B25': { name: 'Yardley', travelTime: '10 mins' },
  'B26': { name: 'Sheldon & Airport', travelTime: '15 mins' },
  'B27': { name: 'Acocks Green', travelTime: '12 mins' },
  'B28': { name: 'Hall Green', travelTime: '15 mins' },
  'B90': { name: 'Shirley', travelTime: '20 mins' },
  'B91': { name: 'Solihull Town Centre', travelTime: '20 mins' },
  'B92': { name: 'Olton & Solihull North', travelTime: '15 mins' },
  'B93': { name: 'Knowle & Dorridge', travelTime: '25 mins' },
  'B72': { name: 'Sutton Coldfield', travelTime: '25 mins' },
  'B73': { name: 'Boldmere & Sutton Park', travelTime: '25 mins' },
  'B74': { name: 'Four Oaks & Streetly', travelTime: '30 mins' },
  'B62': { name: 'Halesowen', travelTime: '30 mins' },
  'B66': { name: 'Smethwick', travelTime: '20 mins' },
  'WS1': { name: 'Walsall', travelTime: '30 mins' },
  'DY1': { name: 'Dudley', travelTime: '35 mins' },
  'WV1': { name: 'Wolverhampton', travelTime: '40 mins' },
  'CV1': { name: 'Coventry', travelTime: '35 mins' },
};

const UK_FLOORING_OPTIONS = [
  {
    id: 'Luxury Vinyl Tile (LVT) & Herringbone',
    title: 'Luxury Vinyl (LVT) & Herringbone',
    subtitle: 'Karndean & Amtico style parquet, 100% waterproof',
    badge: 'Most Popular',
    icon: 'fa-cubes-stacked',
  },
  {
    id: 'Premium Carpet & Heavy Underlay',
    title: 'Carpets & Underlays',
    subtitle: 'Plush Saxony, 80/20 Wool Twist & Cloud9 underlay',
    badge: 'Luxury Comfort',
    icon: 'fa-rug',
  },
  {
    id: 'Real Engineered & Solid Hardwood',
    title: 'Engineered Hardwood',
    subtitle: 'Natural Brushed Oak, Herringbone & Smoked finishes',
    badge: 'Premium Wood',
    icon: 'fa-tree',
  },
  {
    id: 'Laminate Flooring Installation',
    title: 'Laminate Flooring',
    subtitle: 'AC4/AC5 scratch-proof boards with bevelled edges',
    badge: 'High Durability',
    icon: 'fa-layer-group',
  },
  {
    id: 'Commercial Safety Flooring',
    title: 'Commercial Safety Flooring',
    subtitle: 'Altro, Polyflor, cap & cove hygienic wetrooms',
    badge: 'Commercial',
    icon: 'fa-building-shield',
  },
  {
    id: 'Full Multi-Room Renovation',
    title: 'Full House / Multi-Room Package',
    subtitle: 'Subfloor screeding, acoustic prep & full installation',
    badge: 'Complete Job',
    icon: 'fa-house-chimney',
  },
];

const UK_ROOM_OPTIONS = [
  'Living Room & Lounge',
  'Hallway, Stairs & Landing',
  'Kitchen & Dining',
  'Master Bedroom',
  'Full House / 3+ Rooms',
  'Commercial Office / Shop',
];

const UK_SLOT_OPTIONS = [
  { id: 'Morning (9:00 AM - 12:00 PM)', title: 'Morning Slot', sub: '9:00 AM – 12:00 PM', icon: 'fa-sun' },
  { id: 'Afternoon (12:00 PM - 4:00 PM)', title: 'Afternoon Slot', sub: '12:00 PM – 4:00 PM', icon: 'fa-cloud-sun' },
  { id: 'Evening (4:00 PM - 7:00 PM)', title: 'Evening Slot', sub: '4:00 PM – 7:00 PM', icon: 'fa-moon' },
  { id: 'Saturday VIP Appointment', title: 'Saturday Slot', sub: 'Weekend VIP Consultation', icon: 'fa-calendar-check' },
];

export default function PostcodeChecker() {
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [checkedArea, setCheckedArea] = useState<{
    postcode: string;
    name: string;
    isCovered: boolean;
  } | null>(null);

  // Multi-Step Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedFlooring, setSelectedFlooring] = useState('Luxury Vinyl Tile (LVT) & Herringbone');
  const [selectedRooms, setSelectedRooms] = useState<string[]>(['Living Room & Lounge']);
  const [selectedSlot, setSelectedSlot] = useState('Morning (9:00 AM - 12:00 PM)');

  // Contact Details (UK Friendly)
  const [contactData, setContactData] = useState({
    fullName: '',
    phone: '',
    email: '',
    postcode: '',
    address: '',
    notes: '',
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
    setContactData((prev) => ({
      ...prev,
      postcode: currentCode,
    }));
    setCurrentStep(1);
    setIsModalOpen(true);
  };

  const toggleRoom = (room: string) => {
    setSelectedRooms((prev) =>
      prev.includes(room) ? prev.filter((r) => r !== room) : [...prev, room]
    );
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactData.fullName || 'Valued Customer',
          phone: contactData.phone,
          email: contactData.email || null,
          service: `Free Survey: ${selectedFlooring}`,
          room_size: `Rooms: ${selectedRooms.join(', ') || 'General Survey'} | Postcode: ${contactData.postcode}`,
          message: `Slot: ${selectedSlot}. Address: ${contactData.address || 'Standard'}. Notes: ${contactData.notes || 'None'}`.trim(),
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
          STICKY BOTTOM FLOATING DOCK (CLEAN & MINIMALIST)
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

            {/* Right: Book Survey Button APPEARS ONLY AFTER CHECK */}
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
          UK LUXURY MULTI-STEP SURVEY BOOKING WIZARD (10/10 MODERN UX)
          ========================================================================= */}
      {isModalOpen && (
        <div className="zk-uk-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="zk-uk-modal-box" onClick={(e) => e.stopPropagation()}>
            
            {/* 1. Header Banner */}
            <div className="zk-uk-modal-header">
              <div className="zk-uk-header-brand">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="zk-uk-badge-gold">
                    <i className="fa-solid fa-van-shuttle"></i> Mobile Showroom Van
                  </span>
                  <span className="zk-uk-badge-green">
                    <i className="fa-solid fa-shield-check"></i> 100% Free &bull; No Obligation
                  </span>
                </div>
                <h3 className="zk-uk-header-title">
                  Book Free In-Home Flooring Survey
                </h3>
                <p className="zk-uk-header-sub">
                  We bring <strong>200+ samples &amp; laser measuring</strong> directly to your property in <strong>{contactData.postcode || 'Birmingham'}</strong>.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="zk-uk-close-btn"
                aria-label="Close modal"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* 2. Step Progress Bar */}
            {!isSuccess && (
              <div className="zk-uk-progress-bar">
                <div
                  className={`zk-uk-step-node ${currentStep >= 1 ? 'active' : ''} ${
                    currentStep > 1 ? 'completed' : ''
                  }`}
                  onClick={() => setCurrentStep(1)}
                >
                  <span className="zk-uk-step-num">1</span>
                  <span className="zk-uk-step-text">Flooring Style</span>
                </div>
                <div className="zk-uk-step-divider"></div>
                <div
                  className={`zk-uk-step-node ${currentStep >= 2 ? 'active' : ''} ${
                    currentStep > 2 ? 'completed' : ''
                  }`}
                  onClick={() => setCurrentStep(2)}
                >
                  <span className="zk-uk-step-num">2</span>
                  <span className="zk-uk-step-text">Rooms &amp; Time</span>
                </div>
                <div className="zk-uk-step-divider"></div>
                <div
                  className={`zk-uk-step-node ${currentStep >= 3 ? 'active' : ''}`}
                  onClick={() => setCurrentStep(3)}
                >
                  <span className="zk-uk-step-num">3</span>
                  <span className="zk-uk-step-text">Address &amp; Confirm</span>
                </div>
              </div>
            )}

            {/* 3. Modal Body Content */}
            {isSuccess ? (
              /* Success Screen */
              <div className="zk-uk-success-screen">
                <div className="zk-uk-success-icon">
                  <i className="fa-solid fa-calendar-check"></i>
                </div>
                <h4>Survey Appointment Requested!</h4>
                <p>
                  Thank you, <strong>{contactData.fullName || 'Valued Customer'}</strong>. Our Birmingham fitting specialist will call you at <strong>{contactData.phone}</strong> shortly to confirm your <strong>{selectedSlot}</strong> appointment.
                </p>

                <div className="zk-uk-guarantee-card">
                  <div className="zk-uk-guarantee-row">
                    <i className="fa-solid fa-truck-fast"></i>
                    <span>Mobile showroom van arrives at your doorstep</span>
                  </div>
                  <div className="zk-uk-guarantee-row">
                    <i className="fa-solid fa-ruler-combined"></i>
                    <span>Precision laser measuring &amp; subfloor assessment</span>
                  </div>
                  <div className="zk-uk-guarantee-row">
                    <i className="fa-solid fa-file-invoice-dollar"></i>
                    <span>Free itemised quote with zero purchase obligation</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsSuccess(false);
                    setCurrentStep(1);
                  }}
                  className="zk-uk-btn-primary"
                  style={{ maxWidth: '200px', margin: '0 auto' }}
                >
                  Done
                </button>
              </div>
            ) : (
              /* Multi-Step Wizard */
              <div className="zk-uk-wizard-body">
                
                {/* STEP 1: Select Flooring Type */}
                {currentStep === 1 && (
                  <div className="zk-uk-step-panel">
                    <div className="zk-uk-panel-head">
                      <h4>What type of flooring would you like to see?</h4>
                      <p>Our mobile showroom carries 200+ samples from Karndean, Amtico, Quick-Step &amp; British carpets.</p>
                    </div>

                    <div className="zk-uk-flooring-grid">
                      {UK_FLOORING_OPTIONS.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedFlooring(item.id)}
                          className={`zk-uk-flooring-card ${
                            selectedFlooring === item.id ? 'selected' : ''
                          }`}
                        >
                          <div className="zk-uk-flooring-card-top">
                            <div className="zk-uk-flooring-icon">
                              <i className={`fa-solid ${item.icon}`}></i>
                            </div>
                            <span className="zk-uk-pill-tag">{item.badge}</span>
                          </div>
                          <div className="zk-uk-flooring-info">
                            <strong>{item.title}</strong>
                            <span>{item.subtitle}</span>
                          </div>
                          <div className="zk-uk-radio-indicator">
                            {selectedFlooring === item.id ? (
                              <i className="fa-solid fa-circle-check"></i>
                            ) : (
                              <i className="fa-regular fa-circle"></i>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="zk-uk-nav-footer">
                      <div className="zk-uk-trust-pill">
                        <i className="fa-solid fa-check-double"></i>
                        <span>Select any style &bull; We bring all physical samples</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="zk-uk-btn-primary"
                      >
                        <span>Next: Choose Rooms &amp; Time</span>
                        <i className="fa-solid fa-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Rooms & Time Slot */}
                {currentStep === 2 && (
                  <div className="zk-uk-step-panel">
                    <div className="zk-uk-panel-head">
                      <h4>Which rooms need measuring &amp; when suits you?</h4>
                      <p>Select all rooms you would like our specialist to measure with precision lasers.</p>
                    </div>

                    {/* Rooms Selector */}
                    <div className="mb-4">
                      <label className="zk-uk-field-title">
                        <i className="fa-solid fa-house-chimney"></i> Areas to Measure (Select all that apply)
                      </label>
                      <div className="zk-uk-room-chips">
                        {UK_ROOM_OPTIONS.map((room) => {
                          const isSelected = selectedRooms.includes(room);
                          return (
                            <button
                              key={room}
                              type="button"
                              onClick={() => toggleRoom(room)}
                              className={`zk-uk-room-chip ${isSelected ? 'active' : ''}`}
                            >
                              <i
                                className={`fa-solid ${
                                  isSelected ? 'fa-check' : 'fa-plus'
                                }`}
                              ></i>
                              <span>{room}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Preferred Slot Selector */}
                    <div>
                      <label className="zk-uk-field-title">
                        <i className="fa-solid fa-clock"></i> Preferred In-Home Survey Time Slot
                      </label>
                      <div className="zk-uk-slot-grid">
                        {UK_SLOT_OPTIONS.map((slot) => (
                          <div
                            key={slot.id}
                            onClick={() => setSelectedSlot(slot.id)}
                            className={`zk-uk-slot-card ${
                              selectedSlot === slot.id ? 'selected' : ''
                            }`}
                          >
                            <i className={`fa-solid ${slot.icon} zk-uk-slot-icon`}></i>
                            <div>
                              <strong>{slot.title}</strong>
                              <span>{slot.sub}</span>
                            </div>
                            <div className="zk-uk-slot-radio">
                              {selectedSlot === slot.id && (
                                <i className="fa-solid fa-circle-check"></i>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="zk-uk-nav-footer">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="zk-uk-btn-back"
                      >
                        <i className="fa-solid fa-arrow-left"></i>
                        <span>Back</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        className="zk-uk-btn-primary"
                      >
                        <span>Next: Contact Details</span>
                        <i className="fa-solid fa-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Contact & Address (UK Friendly) */}
                {currentStep === 3 && (
                  <form onSubmit={handleBookingSubmit} className="zk-uk-step-panel">
                    <div className="zk-uk-panel-head">
                      <h4>Where should our Mobile Showroom visit?</h4>
                      <p>Enter your UK contact details. We will call you to confirm your appointment.</p>
                    </div>

                    <div className="row g-3">
                      {/* Full Name */}
                      <div className="col-md-6">
                        <div className="zk-uk-field-wrap">
                          <label>Full Name *</label>
                          <div className="zk-uk-input-box">
                            <i className="fa-solid fa-user"></i>
                            <input
                              type="text"
                              required
                              placeholder="e.g. James Wilson"
                              value={contactData.fullName}
                              onChange={(e) =>
                                setContactData({ ...contactData, fullName: e.target.value })
                              }
                            />
                          </div>
                        </div>
                      </div>

                      {/* Phone Number */}
                      <div className="col-md-6">
                        <div className="zk-uk-field-wrap">
                          <label>UK Mobile / Phone Number *</label>
                          <div className="zk-uk-input-box">
                            <i className="fa-solid fa-phone"></i>
                            <input
                              type="tel"
                              required
                              placeholder="e.g. 07700 900123"
                              value={contactData.phone}
                              onChange={(e) =>
                                setContactData({ ...contactData, phone: e.target.value })
                              }
                            />
                          </div>
                        </div>
                      </div>

                      {/* Postcode */}
                      <div className="col-md-6">
                        <div className="zk-uk-field-wrap">
                          <label>UK Postcode *</label>
                          <div className="zk-uk-input-box">
                            <i className="fa-solid fa-location-dot"></i>
                            <input
                              type="text"
                              required
                              placeholder="e.g. B91 3AB, Solihull"
                              value={contactData.postcode}
                              onChange={(e) =>
                                setContactData({ ...contactData, postcode: e.target.value })
                              }
                            />
                          </div>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="col-md-6">
                        <div className="zk-uk-field-wrap">
                          <label>Email Address (For Written Quote)</label>
                          <div className="zk-uk-input-box">
                            <i className="fa-solid fa-envelope"></i>
                            <input
                              type="email"
                              placeholder="e.g. james.wilson@example.co.uk"
                              value={contactData.email}
                              onChange={(e) =>
                                setContactData({ ...contactData, email: e.target.value })
                              }
                            />
                          </div>
                        </div>
                      </div>

                      {/* Street Address / Notes */}
                      <div className="col-12">
                        <div className="zk-uk-field-wrap">
                          <label>Street Address / Specific Samples Needed (Optional)</label>
                          <div className="zk-uk-input-box">
                            <i className="fa-solid fa-house"></i>
                            <input
                              type="text"
                              placeholder="e.g. 42 High Street, please bring light oak herringbone & grey carpets"
                              value={contactData.address}
                              onChange={(e) =>
                                setContactData({ ...contactData, address: e.target.value })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Summary Card */}
                    <div className="zk-uk-booking-summary">
                      <div className="zk-uk-summary-item">
                        <span className="label">Selected Flooring:</span>
                        <span className="val">{selectedFlooring}</span>
                      </div>
                      <div className="zk-uk-summary-item">
                        <span className="label">Appointment Slot:</span>
                        <span className="val">{selectedSlot}</span>
                      </div>
                    </div>

                    <div className="zk-uk-nav-footer">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="zk-uk-btn-back"
                      >
                        <i className="fa-solid fa-arrow-left"></i>
                        <span>Back</span>
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="zk-uk-btn-primary submit"
                      >
                        {isSubmitting ? (
                          <>
                            <i className="fa-solid fa-spinner fa-spin"></i>
                            <span>Confirming Booking...</span>
                          </>
                        ) : (
                          <>
                            <i className="fa-solid fa-calendar-check"></i>
                            <span>Confirm Free In-Home Survey</span>
                            <i className="fa-solid fa-arrow-right"></i>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
