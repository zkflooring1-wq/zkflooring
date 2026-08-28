'use client';

import React, { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
  showSurveyCTA?: boolean;
}

const QUICK_SUGGESTIONS = [
  { label: '📐 Room Cost Estimate', text: 'How much does it cost for 25 sqm LVT in Birmingham?' },
  { label: '💧 Best for Kitchens', text: 'What is the best waterproof flooring for a kitchen?' },
  { label: '💎 LVT vs Real Wood', text: 'What are the pros and cons of LVT compared to Engineered Hardwood?' },
  { label: '🏠 Free Laser Survey', text: 'How can I book a 100% Free Home Measurement and Survey in Birmingham?' },
];

export default function AIFlooringChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [showCalcModal, setShowCalcModal] = useState(false);

  // Messages State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! 👋 Welcome to **ZK Flooring** Birmingham.\n\nI can calculate instant room estimates (£/m²), recommend ideal materials for any space (LVT, Hardwood, Laminate, Carpet), and help you book a **100% Free On-Site Laser Survey**.\n\nWhat flooring project are you planning?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Calculator State
  const [calcLength, setCalcLength] = useState<number>(5);
  const [calcWidth, setCalcWidth] = useState<number>(4);
  const [calcMaterial, setCalcMaterial] = useState<'lvt' | 'hardwood' | 'laminate' | 'carpet'>('lvt');

  // Lead State
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadPostcode, setLeadPostcode] = useState('');
  const [leadService, setLeadService] = useState('Luxury Vinyl Tile (LVT)');
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);
  const [leadError, setLeadError] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);

      // Prevent parent page smooth-scroll (Lenis / GSAP ScrollSmoother) from hijacking mouse scroll
      const container = scrollContainerRef.current;
      if (container) {
        const handleWheel = (e: WheelEvent) => {
          e.stopPropagation();
        };
        container.addEventListener('wheel', handleWheel, { passive: true });
        return () => {
          container.removeEventListener('wheel', handleWheel);
        };
      }
    }
  }, [isOpen, messages, showSurveyModal, showCalcModal]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      const data = await res.json();
      const replyText = data.reply || 'I would be delighted to help with your flooring project. Would you like a cost estimate or to schedule a free home survey?';

      const botMsg: Message = {
        id: `b-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        showSurveyCTA: true,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, I had trouble connecting. Please feel free to call our Birmingham team on **0121 448 3878** or book a free survey below.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          showSurveyCTA: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCalc = () => {
    const area = calcLength * calcWidth;
    const sqft = Math.round(area * 10.764);
    const materialNames: Record<string, string> = {
      lvt: 'Luxury Vinyl Tile (LVT)',
      hardwood: 'Engineered Hardwood',
      laminate: 'Premium Laminate',
      carpet: 'Luxury Carpet',
    };
    const matName = materialNames[calcMaterial];
    setShowCalcModal(false);
    handleSendMessage(`I calculated my room size: **${calcLength}m × ${calcWidth}m = ${area} m²** (~${sqft} sq ft) for **${matName}**. What are the pricing options, fitting costs, and next steps?`);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadPhone.trim()) {
      setLeadError('Please provide your name and phone number.');
      return;
    }

    setLeadSubmitting(true);
    setLeadError('');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadName.trim(),
          phone: leadPhone.trim(),
          service: leadService,
          room_size: `${calcLength * calcWidth} m² (${calcLength}m x ${calcWidth}m)`,
          message: `Free Home Survey requested via Clean AI Assistant. Postcode: ${leadPostcode || 'Not specified'}`,
          source: 'ai_assistant',
        }),
      });

      if (res.ok) {
        setLeadSuccess(true);
        setTimeout(() => {
          setShowSurveyModal(false);
          setLeadSuccess(false);
          setMessages((prev) => [
            ...prev,
            {
              id: `lead-done-${Date.now()}`,
              role: 'assistant',
              content: `🎉 **Thank you, ${leadName}!**\n\nYour Free Home Survey & Laser Measurement request has been submitted. Our Birmingham team will call you on **${leadPhone}** to confirm your preferred date and time slot!`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
        }, 1200);
      } else {
        const d = await res.json();
        setLeadError(d.error || 'Failed to submit. Please try again.');
      }
    } catch {
      setLeadError('Network error. Please call 0121 448 3878.');
    } finally {
      setLeadSubmitting(false);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `👋 Chat reset. What flooring question or estimate can I help you with?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setShowSurveyModal(false);
    setShowCalcModal(false);
  };

  // Clean formatted text helper
  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, idx) => {
      const boldFormatted = line.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#111827;font-weight:700;">$1</strong>');
      if (line.startsWith('• ') || line.startsWith('- ')) {
        return (
          <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', margin: '4px 0' }}>
            <span style={{ color: '#b2894b', fontSize: '9px', marginTop: '5px' }}>◆</span>
            <span style={{ color: '#374151' }} dangerouslySetInnerHTML={{ __html: boldFormatted.replace(/^[•\-]\s*/, '') }} />
          </div>
        );
      }
      if (line.trim() === '') return <div key={idx} style={{ height: '6px' }} />;
      return <p key={idx} style={{ margin: '4px 0', lineHeight: 1.5, color: '#374151' }} dangerouslySetInnerHTML={{ __html: boldFormatted }} />;
    });
  };

  return (
    <div
      className="zk-clean-ai-root"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 99999,
        fontFamily: 'var(--font-manrope, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
      }}
    >
      {/* 1. Ultra-Clean Luxury Floating Trigger Button */}
      {!isOpen && (
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>

          {/* Luxury White & Gold Circular Button */}
          <button
            onClick={() => setIsOpen(true)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-label="Open Flooring AI Assistant"
            style={{
              width: '58px',
              height: '58px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              border: '1.5px solid #c5a880',
              boxShadow: '0 12px 32px rgba(0,0,0,0.12), 0 4px 12px rgba(197,168,128,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: isHovered ? 'scale(1.08) translateY(-2px)' : 'scale(1)',
              position: 'relative',
            }}
          >
            {/* Elegant Metallic Gold Spark Icon */}
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #dfc093 0%, #c5a880 60%, #a47d48 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '17px',
                boxShadow: '0 3px 8px rgba(197,168,128,0.4)',
              }}
            >
              ✦
            </div>

            {/* Online Green Indicator Dot */}
            <span
              style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                border: '2px solid #ffffff',
                boxShadow: '0 0 4px rgba(16,185,129,0.5)',
              }}
            />
          </button>
        </div>
      )}

      {/* 2. Clean Luxury Light Chatbot Window */}
      {isOpen && (
        <div
          data-lenis-prevent="true"
          data-scroll-ignore="true"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          style={{
            width: '385px',
            maxWidth: 'calc(100vw - 32px)',
            height: '575px',
            maxHeight: 'calc(100vh - 48px)',
            backgroundColor: '#ffffff',
            border: '1px solid #e9e3da',
            borderRadius: '24px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.14), 0 4px 16px rgba(197,168,128,0.12)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'windowSlideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
            position: 'relative',
            overscrollBehavior: 'contain',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 18px',
              backgroundColor: '#fcfbfa',
              borderBottom: '1px solid #efeae2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #dfc093 0%, #c5a880 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: 800,
                  boxShadow: '0 2px 8px rgba(197,168,128,0.35)',
                }}
              >
                ✦
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#111827', letterSpacing: '-0.01em' }}>
                    ZK Flooring AI
                  </h4>
                  <span style={{ fontSize: '10px', color: '#059669', backgroundColor: '#ecfdf5', padding: '1px 6px', borderRadius: '10px', fontWeight: 600 }}>
                    Online
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>
                  Birmingham & West Midlands Specialist
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {/* Quick Calc Icon button */}
              <button
                onClick={() => setShowCalcModal(!showCalcModal)}
                title="Room Size Calculator"
                style={{
                  background: showCalcModal ? '#f3ede2' : 'transparent',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer',
                  padding: '6px 8px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.15s ease',
                }}
              >
                📐
              </button>
              {/* Reset button */}
              <button
                onClick={resetChat}
                title="Restart conversation"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ↻
              </button>
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div
            ref={scrollContainerRef}
            className="zk-clean-scroll"
            data-lenis-prevent="true"
            data-scroll-ignore="true"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            style={{
              flex: 1,
              overflowY: 'auto',
              overscrollBehavior: 'contain',
              touchAction: 'pan-y',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              backgroundColor: '#faf8f5',
            }}
          >
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: m.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '86%',
                    padding: '12px 15px',
                    borderRadius: m.role === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                    backgroundColor: m.role === 'user' ? '#b2894b' : '#ffffff',
                    color: m.role === 'user' ? '#ffffff' : '#1f2937',
                    fontSize: '13px',
                    lineHeight: 1.5,
                    border: m.role === 'user' ? 'none' : '1px solid #eae4da',
                    boxShadow: m.role === 'user' ? '0 3px 10px rgba(178,137,75,0.25)' : '0 2px 6px rgba(0,0,0,0.03)',
                  }}
                >
                  {m.role === 'assistant' ? renderFormattedText(m.content) : m.content}
                </div>

                {/* Inline Action Pill inside Assistant reply */}
                {m.role === 'assistant' && m.showSurveyCTA && (
                  <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                    <button
                      onClick={() => setShowSurveyModal(true)}
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '12px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #c5a880',
                        color: '#a0773f',
                        cursor: 'pointer',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      🏠 Book Free Laser Survey →
                    </button>
                    <button
                      onClick={() => setShowCalcModal(true)}
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '4px 10px',
                        borderRadius: '12px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5ded4',
                        color: '#4b5563',
                        cursor: 'pointer',
                      }}
                    >
                      📐 Room Calc
                    </button>
                  </div>
                )}

                <span style={{ fontSize: '9.5px', color: '#9ca3af', marginTop: '3px', padding: '0 4px' }}>
                  {m.timestamp}
                </span>
              </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 12px', borderRadius: '14px', backgroundColor: '#ffffff', border: '1px solid #eae4da', width: 'fit-content' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#b2894b', animation: 'pulseDot 1.2s infinite 0s' }} />
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#b2894b', animation: 'pulseDot 1.2s infinite 0.2s' }} />
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#b2894b', animation: 'pulseDot 1.2s infinite 0.4s' }} />
                <span style={{ fontSize: '11.5px', color: '#6b7280', marginLeft: '4px' }}>Thinking...</span>
              </div>
            )}

            {/* Initial Quick Suggestion Chips (2x2 Grid) */}
            {messages.length === 1 && !loading && (
              <div style={{ marginTop: '6px' }}>
                <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 600, marginBottom: '6px' }}>
                  Suggested questions:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  {QUICK_SUGGESTIONS.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(s.text)}
                      style={{
                        textAlign: 'left',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        padding: '9px 12px',
                        borderRadius: '12px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e7dfd5',
                        color: '#374151',
                        cursor: 'pointer',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#c5a880';
                        e.currentTarget.style.backgroundColor = '#fdfbf9';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e7dfd5';
                        e.currentTarget.style.backgroundColor = '#ffffff';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* SLIDE-UP MODAL: ROOM CALCULATOR */}
          {showCalcModal && (
            <div
              style={{
                position: 'absolute',
                bottom: '68px',
                left: '12px',
                right: '12px',
                backgroundColor: '#ffffff',
                border: '1px solid #c5a880',
                borderRadius: '18px',
                padding: '14px',
                boxShadow: '0 16px 36px rgba(0,0,0,0.14)',
                animation: 'slideUpSmooth 0.2s ease-out',
                zIndex: 10,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>
                  📐 Quick Room Calculator
                </span>
                <button
                  onClick={() => setShowCalcModal(false)}
                  style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '13px', cursor: 'pointer', fontWeight: 700 }}
                >
                  ✕
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <div>
                  <label style={{ fontSize: '10.5px', color: '#6b7280', display: 'block', marginBottom: '2px' }}>Length (m)</label>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    value={calcLength}
                    onChange={(e) => setCalcLength(parseFloat(e.target.value) || 1)}
                    style={{ width: '100%', padding: '6px 8px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '12px', color: '#111827' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '10.5px', color: '#6b7280', display: 'block', marginBottom: '2px' }}>Width (m)</label>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    value={calcWidth}
                    onChange={(e) => setCalcWidth(parseFloat(e.target.value) || 1)}
                    style={{ width: '100%', padding: '6px 8px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '12px', color: '#111827' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '11.5px', color: '#6b7280' }}>Area:</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#b2894b' }}>
                  {calcLength * calcWidth} m² (~{Math.round(calcLength * calcWidth * 10.764)} sq ft)
                </span>
              </div>

              <button
                type="button"
                onClick={handleApplyCalc}
                style={{
                  width: '100%',
                  padding: '8px 0',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #dfc093, #c5a880)',
                  border: 'none',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer',
                  boxShadow: '0 3px 8px rgba(197,168,128,0.3)',
                }}
              >
                Calculate Price with AI ➔
              </button>
            </div>
          )}

          {/* SLIDE-UP MODAL: FREE SURVEY BOOKING */}
          {showSurveyModal && (
            <div
              style={{
                position: 'absolute',
                bottom: '68px',
                left: '12px',
                right: '12px',
                backgroundColor: '#ffffff',
                border: '1.5px solid #c5a880',
                borderRadius: '18px',
                padding: '16px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
                animation: 'slideUpSmooth 0.2s ease-out',
                zIndex: 10,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div>
                  <h5 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#111827' }}>
                    🏠 Book Free Laser Survey
                  </h5>
                  <p style={{ margin: '1px 0 0', fontSize: '10.5px', color: '#6b7280' }}>
                    Free measurement + physical sample book brought to you.
                  </p>
                </div>
                <button
                  onClick={() => setShowSurveyModal(false)}
                  style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '14px', cursor: 'pointer', fontWeight: 700 }}
                >
                  ✕
                </button>
              </div>

              {leadSuccess ? (
                <div style={{ padding: '12px', backgroundColor: '#ecfdf5', border: '1px solid #10b981', borderRadius: '10px', color: '#065f46', fontSize: '12px', textAlign: 'center', fontWeight: 600 }}>
                  ✓ Survey request received! We will call you shortly.
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input
                    type="text"
                    required
                    placeholder="Your Name *"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    style={{ padding: '7px 10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '12px', color: '#111827' }}
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number *"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    style={{ padding: '7px 10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '12px', color: '#111827' }}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    <input
                      type="text"
                      placeholder="Postcode (e.g. B15)"
                      value={leadPostcode}
                      onChange={(e) => setLeadPostcode(e.target.value)}
                      style={{ padding: '7px 10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '12px', color: '#111827' }}
                    />
                    <select
                      value={leadService}
                      onChange={(e) => setLeadService(e.target.value)}
                      style={{ padding: '7px 8px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '11.5px', color: '#111827', backgroundColor: '#fff' }}
                    >
                      <option value="Luxury Vinyl Tile (LVT)">LVT Flooring</option>
                      <option value="Engineered Hardwood">Engineered Wood</option>
                      <option value="Solid Hardwood">Solid Hardwood</option>
                      <option value="Laminate Flooring">Laminate</option>
                      <option value="Luxury Carpet">Luxury Carpet</option>
                      <option value="Commercial Flooring">Commercial</option>
                    </select>
                  </div>

                  {leadError && (
                    <div style={{ color: '#dc2626', fontSize: '11px', textAlign: 'center' }}>
                      {leadError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={leadSubmitting}
                    style={{
                      marginTop: '4px',
                      padding: '9px 0',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #dfc093, #c5a880)',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 3px 8px rgba(197,168,128,0.3)',
                    }}
                  >
                    {leadSubmitting ? 'Submitting...' : 'Confirm Free Survey ➔'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Input Footer */}
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: '#ffffff',
              borderTop: '1px solid #efeae2',
            }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#f8f6f3',
                border: '1.5px solid #e7dfd5',
                borderRadius: '30px',
                padding: '4px 6px 4px 14px',
                transition: 'border-color 0.15s ease',
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask room dimensions, materials, or prices..."
                disabled={loading}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#111827',
                  fontSize: '12.5px',
                }}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Send message"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: input.trim() && !loading ? '#b2894b' : '#e5ded4',
                  color: '#ffffff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: input.trim() && !loading ? 'pointer' : 'default',
                  transition: 'all 0.15s ease',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
              <span style={{ fontSize: '10.5px', color: '#9ca3af' }}>
                ZK Flooring • 100% Free Home Survey
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Scoped CSS for Light Luxury Theme */}
      <style jsx global>{`
        .zk-clean-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .zk-clean-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .zk-clean-scroll::-webkit-scrollbar-thumb {
          background: rgba(197, 168, 128, 0.35);
          border-radius: 4px;
        }
        .zk-clean-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(197, 168, 128, 0.6);
        }
        @keyframes windowSlideUp {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes slideUpSmooth {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeTooltip {
          from { opacity: 0; transform: translateX(5px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulseDot {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.15); }
        }
        @media (max-width: 480px) {
          .zk-clean-ai-root {
            bottom: 16px !important;
            right: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}
