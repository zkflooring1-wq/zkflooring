import React from 'react';
import { getSetting, SocialLink, HeaderContact } from '@/lib/settings';
import NavMenu from '@/components/layout/NavMenu';

export default async function MobileMenu() {
  const socialLinks = await getSetting<SocialLink[]>('social_links');
  const contactInfo = await getSetting<HeaderContact>('header_contact');

  const email = contactInfo?.email || "example@gmail.com";
  const phone = contactInfo?.phone || "07903723774";
  const phoneLink = contactInfo?.phone_link || "tel:07903723774";
  return (
    <div className="mobile-menu-wrapper" suppressHydrationWarning>
      <div className="mobile-menu-area">
        <button className="menu-toggle"><i className="fas fa-times"></i></button>
        <div className="mobile-logo">
          <a href="/"><img alt="ZK Flooring Logo" src="/zk-logo.png" style={{ maxHeight: '50px', width: 'auto', objectFit: 'contain' }} /></a>
        </div>
        <div className="mobile-menu">
          <NavMenu className="navigation clearfix" suppressHydrationWarning />
        </div>
        <ul className="contact-list-one">
          <li>
            <div className="contact-info-box">
              <span className="icon fa-solid fa-phone"></span>
              <span className="title">Call Us Anytime</span>
              <a href={phoneLink}>{phone}</a>
            </div>
          </li>
          <li>
            <div className="contact-info-box">
              <span className="icon fa-light fa-envelope"></span>
              <span className="title">Email Us</span>
              <a href={`mailto:${email}`}>{email}</a>
            </div>
          </li>
          <li>
            <div className="contact-info-box">
              <span className="icon fa-light fa-alarm-clock"></span>
              <span className="title">Opening Hour</span>
              Mon - Sat 8:00 - 6:30, Sunday - CLOSED
            </div>
          </li>
        </ul>
        <ul className="social-links">
          {socialLinks ? (
            socialLinks
              .filter((link) => link.enabled)
              .map((link) => (
                <li key={link.platform}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    <i className={link.icon}></i>
                  </a>
                </li>
              ))
          ) : (
            <>
              <li><a href="#"><i className="fab fa-twitter"></i></a></li>
              <li><a href="#"><i className="fab fa-facebook-f"></i></a></li>
              <li><a href="#"><i className="fab fa-pinterest"></i></a></li>
              <li><a href="#"><i className="fab fa-instagram"></i></a></li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
