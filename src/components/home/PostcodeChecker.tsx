"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface AreaInfo {
  name: string;
  tier: 'same-day' | 'standard' | 'extended';
  travelTime: string;
  freeSurvey: boolean;
}

const COVERED_AREAS: Record<string, AreaInfo> = {
  // Birmingham Central & East (Headquarters Hub)
  'B10': { name: 'Small Heath & Bordesley Green (HQ Area)', tier: 'same-day', travelTime: '5-15 mins', freeSurvey: true },
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
  'B26': { name: 'Sheldon & Birmingham Airport Area', tier: 'same-day', travelTime: '15 mins', freeSurvey: true },
  'B27': { name: 'Acocks Green', tier: 'same-day', travelTime: '12 mins', freeSurvey: true },
  'B28': { name: 'Hall Green', tier: 'same-day', travelTime: '15 mins', freeSurvey: true },
  'B29': { name: 'Selly Oak & University', tier: 'same-day', travelTime: '20 mins', freeSurvey: true },
  'B30': { name: 'Bournville & Cotteridge', tier: 'same-day', travelTime: '25 mins', freeSurvey: true },
  'B31': { name: 'Northfield & Longbridge', tier: 'same-day', travelTime: '25 mins', freeSurvey: true },
  'B32': { name: 'Quinton & Woodgate', tier: 'same-day', travelTime: '25 mins', freeSurvey: true },
  'B90': { name: 'Shirley & Solihull South', tier: 'same-day', travelTime: '20 mins', freeSurvey: true },
  'B91': { name: 'Solihull Town Centre & Olton', tier: 'same-day', travelTime: '20 mins', freeSurvey: true },
  'B92': { name: 'Olton, Elmdon & Solihull North', tier: 'same-day', travelTime: '15 mins', freeSurvey: true },
  'B93': { name: 'Knowle & Dorridge', tier: 'same-day', travelTime: '25 mins', freeSurvey: true },
  'B94': { name: 'Hockley Heath & Lapworth', tier: 'standard', travelTime: '30 mins', freeSurvey: true },

  // North Birmingham & Sutton Coldfield
  'B23': { name: 'Erdington & Short Heath', tier: 'same-day', travelTime: '20 mins', freeSurvey: true },
  'B24': { name: 'Erdington & Castle Vale', tier: 'same-day', travelTime: '15 mins', freeSurvey: true },
  'B42': { name: 'Perry Barr', tier: 'same-day', travelTime: '20 mins', freeSurvey: true },
  'B43': { name: 'Great Barr', tier: 'same-day', travelTime: '25 mins', freeSurvey: true },
  'B44': { name: 'Kingstanding', tier: 'same-day', travelTime: '25 mins', freeSurvey: true },
  'B72': { name: 'Sutton Coldfield Town & Wylde Green', tier: 'same-day', travelTime: '25 mins', freeSurvey: true },
  'B73': { name: 'Boldmere & Sutton Park', tier: 'same-day', travelTime: '25 mins', freeSurvey: true },
  'B74': { name: 'Four Oaks & Streetly', tier: 'same-day', travelTime: '30 mins', freeSurvey: true },
  'B75': { name: 'Roughley & Falcon Lodge', tier: 'same-day', travelTime: '30 mins', freeSurvey: true },
  'B76': { name: 'Walmley & Minworth', tier: 'same-day', travelTime: '20 mins', freeSurvey: true },

  // Black Country & West Midlands
  'B62': { name: 'Halesowen', tier: 'standard', travelTime: '30 mins', freeSurvey: true },
  'B63': { name: 'Halesowen & Cradley', tier: 'standard', travelTime: '30 mins', freeSurvey: true },
  'B64': { name: 'Old Hill & Cradley Heath', tier: 'standard', travelTime: '30 mins', freeSurvey: true },
  'B66': { name: 'Smethwick', tier: 'same-day', travelTime: '20 mins', freeSurvey: true },
  'B67': { name: 'Smethwick & Bearwood', tier: 'same-day', travelTime: '20 mins', freeSurvey: true },
  'B68': { name: 'Oldbury', tier: 'same-day', travelTime: '25 mins', freeSurvey: true },
  'B69': { name: 'Tividale & Oldbury', tier: 'same-day', travelTime: '25 mins', freeSurvey: true },
  'B70': { name: 'West Bromwich', tier: 'same-day', travelTime: '25 mins', freeSurvey: true },
  'B71': { name: 'West Bromwich North', tier: 'same-day', travelTime: '25 mins', freeSurvey: true },
  'DY1': { name: 'Dudley Central', tier: 'standard', travelTime: '35 mins', freeSurvey: true },
  'DY2': { name: 'Dudley South', tier: 'standard', travelTime: '35 mins', freeSurvey: true },
  'DY3': { name: 'Sedgley & Gornal', tier: 'standard', travelTime: '40 mins', freeSurvey: true },
  'DY8': { name: 'Stourbridge & Amblecote', tier: 'standard', travelTime: '40 mins', freeSurvey: true },
  'WS1': { name: 'Walsall Town Centre', tier: 'standard', travelTime: '30 mins', freeSurvey: true },
  'WS5': { name: 'Walsall & Bescot', tier: 'standard', travelTime: '25 mins', freeSurvey: true },
  'WS13': { name: 'Lichfield', tier: 'standard', travelTime: '40 mins', freeSurvey: true },
  'WV1': { name: 'Wolverhampton Central', tier: 'standard', travelTime: '40 mins', freeSurvey: true },
  'CV1': { name: 'Coventry Central', tier: 'standard', travelTime: '35 mins', freeSurvey: true },
  'CV3': { name: 'Coventry South', tier: 'standard', travelTime: '35 mins', freeSurvey: true },
  'CV4': { name: 'Tile Hill & Warwick Uni', tier: 'standard', travelTime: '30 mins', freeSurvey: true },
  'CV5': { name: 'Allesley & Earlsdon', tier: 'standard', travelTime: '30 mins', freeSurvey: true },
};

export default function PostcodeChecker() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{
    searched: string;
    found: boolean;
    info?: AreaInfo;
    outcode?: string;
  } | null>(null);

  const checkPostcode = (query: string) => {
    const cleaned = query.trim().toUpperCase();
    if (!cleaned) {
      setResult(null);
      return;
    }

    // Extract outcode (e.g. B10, B91, WS1, etc.)
    const match = cleaned.match(/^([A-Z]{1,2}[0-9]{1,2})/);
    const outcode = match ? match[1] : cleaned;

    if (COVERED_AREAS[outcode]) {
      setResult({
        searched: cleaned,
        found: true,
        info: COVERED_AREAS[outcode],
        outcode,
      });
    } else if (cleaned.startsWith('B') || cleaned.startsWith('WS') || cleaned.startsWith('DY') || cleaned.startsWith('WV') || cleaned.startsWith('CV')) {
      // General West Midlands coverage
      setResult({
        searched: cleaned,
        found: true,
        info: {
          name: 'Greater Birmingham & West Midlands Area',
          tier: 'standard',
          travelTime: '25-45 mins',
          freeSurvey: true,
        },
        outcode,
      });
    } else {
      // Extended nationwide radius
      setResult({
        searched: cleaned,
        found: false,
      });
    }
  };

  const handleQuickCheck = (postcode: string) => {
    setInput(postcode);
    checkPostcode(postcode);
  };

  return (
    <div className="zk-postcode-banner-wrap">
      <div className="container">
        <div className="zk-postcode-card">
          <div className="row align-items-center gy-20">
            {/* Left: Heading & Context */}
            <div className="col-lg-5">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="zk-badge-gold">
                  <i className="fa-solid fa-truck-fast"></i> Mobile Showroom Van
                </span>
                <span style={{ fontSize: '11px', color: '#B38728', fontWeight: 700 }}>
                  Active Today
                </span>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#16120B', margin: 0 }}>
                Check Free Survey &amp; Showroom in Your Area
              </h3>
              <p style={{ fontSize: '13px', color: '#666', marginTop: '4px', marginBottom: 0, lineHeight: 1.4 }}>
                Enter your Birmingham or West Midlands postcode to check appointment availability.
              </p>
            </div>

            {/* Right: Search Box & Quick Area Chips */}
            <div className="col-lg-7">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  checkPostcode(input);
                }}
                className="zk-postcode-input-form"
              >
                <div className="zk-postcode-field-box">
                  <i className="fa-solid fa-location-dot zk-postcode-icon"></i>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      if (!e.target.value) setResult(null);
                    }}
                    placeholder="Enter UK Postcode (e.g. B10, B91, Solihull, B13)..."
                    className="zk-postcode-input"
                  />
                  <button type="submit" className="zk-postcode-submit-btn">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <span>Check Area</span>
                  </button>
                </div>
              </form>

              {/* Popular Area Quick Pills */}
              <div className="zk-postcode-pills">
                <span style={{ fontSize: '11.5px', color: '#888', fontWeight: 600, marginRight: '4px' }}>
                  Popular:
                </span>
                {[
                  { code: 'B10', label: 'B10 Small Heath' },
                  { code: 'B91', label: 'B91 Solihull' },
                  { code: 'B13', label: 'B13 Moseley' },
                  { code: 'B73', label: 'B73 Sutton Coldfield' },
                  { code: 'B15', label: 'B15 Edgbaston' },
                ].map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => handleQuickCheck(item.code)}
                    className="zk-area-pill"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dynamic Result Popup Banner */}
          {result && (
            <div
              className={`zk-postcode-result-box ${
                result.found ? 'zk-result-success' : 'zk-result-notice'
              }`}
            >
              {result.found && result.info ? (
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="zk-result-icon success">
                      <i className="fa-solid fa-circle-check"></i>
                    </div>
                    <div>
                      <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#16120B' }}>
                        🎉 Great news! We provide Free In-Home Surveys in {result.info.name} ({result.outcode})
                      </div>
                      <div style={{ fontSize: '12px', color: '#4a443a', marginTop: '2px' }}>
                        <i className="fa-solid fa-van-shuttle" style={{ color: '#AA771C', marginRight: '5px' }}></i>
                        <strong>Mobile Showroom Van:</strong> Direct samples brought to your door &bull; Average response: <strong>{result.info.travelTime}</strong> &bull; 100% Free No-Obligation Quote
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <Link
                      href={`/contact?service=Survey%20Request%20(${encodeURIComponent(result.outcode || result.searched)})`}
                      className="zk-btn-book-survey"
                    >
                      <i className="fa-solid fa-calendar-check" style={{ marginRight: '6px' }}></i>
                      Book Free Survey in {result.outcode}
                    </Link>
                    <a
                      href="tel:07903723774"
                      className="zk-btn-call-fitter"
                    >
                      <i className="fa-solid fa-phone" style={{ marginRight: '5px' }}></i>
                      07903 723 774
                    </a>
                  </div>
                </div>
              ) : (
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="zk-result-icon notice">
                      <i className="fa-solid fa-compass"></i>
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#16120B' }}>
                        📍 Extended Travel Coverage for &quot;{result.searched}&quot;
                      </div>
                      <div style={{ fontSize: '12px', color: '#555', marginTop: '2px' }}>
                        We regularly undertake bespoke commercial and residential installations across a 100-200 mile radius from Birmingham.
                      </div>
                    </div>
                  </div>

                  <a
                    href="tel:07903723774"
                    className="zk-btn-book-survey"
                  >
                    <i className="fa-solid fa-phone" style={{ marginRight: '6px' }}></i>
                    Call Master Fitter for Availability
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
