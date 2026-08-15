import React from 'react';
import { getSetting, SocialLink } from '@/lib/settings';

export default async function Sidebar() {
  const socialLinks = await getSetting<SocialLink[]>('social_links');
  return (
    <div id="sidebar-area" className="sidebar">
      <div className="sidebar-overlay"></div>
      <div className="sidebar-wrapper">
        <button className="sidebar-close-btn">
          <svg className="icon-close" xmlns="http://www.w3.org/2000/svg" width="16px" height="12.7px" viewBox="0 0 16 12.7">
            <g>
              <rect x="0" y="5.4" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -2.1569 7.5208)" width="16" height="2"></rect>
              <rect x="0" y="5.4" transform="matrix(0.7071 0.7071 -0.7071 0.7071 6.8431 -3.7929)" width="16" height="2"></rect>
            </g>
          </svg>
        </button>
        <div className="sidebar-content">
          <div className="sidebar-logo">
            <a className="dark-logo" href="/"><img src="/zk-logo.png" alt="ZK Flooring Logo" style={{ maxHeight: '55px', width: 'auto', objectFit: 'contain' }} /></a>
          </div>
          <div className="sidebar-menu-wrap"></div>
          <div className="sidebar-about">
            <h6>Explore ZK Flooring</h6>
            <div className="sidebar-header">
              <h3>Birmingham's leading flooring & carpet installation service</h3>
            </div>
          </div>
          {/* Instagram Feed Section */}
          <div className="instafeed-wrapper">
            <div className="insta-item">
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <img src="/assets/images/sidebar/sidebar1.jpeg" alt="Instagram Showcase 1" />
                <span className="overlay"><i className="fa-brands fa-instagram"></i></span>
              </a>
            </div>
            <div className="insta-item">
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <img src="/assets/images/sidebar/sidebar-2.jpg" alt="Instagram Showcase 2" />
                <span className="overlay"><i className="fa-brands fa-instagram"></i></span>
              </a>
            </div>
            <div className="insta-item">
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <img src="/assets/images/sidebar/sidebar-3.jpg" alt="Instagram Showcase 3" />
                <span className="overlay"><i className="fa-brands fa-instagram"></i></span>
              </a>
            </div>
            <div className="insta-item">
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <img src="/assets/images/sidebar/sidebar-4.jpg" alt="Instagram Showcase 4" />
                <span className="overlay"><i className="fa-brands fa-instagram"></i></span>
              </a>
            </div>
            <div className="insta-item">
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <img src="/assets/images/sidebar/sidebar-5.jpg" alt="Instagram Showcase 5" />
                <span className="overlay"><i className="fa-brands fa-instagram"></i></span>
              </a>
            </div>
            <div className="insta-item">
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <img src="/assets/images/sidebar/sidebar-6.jpg" alt="Instagram Showcase 6" />
                <span className="overlay"><i className="fa-brands fa-instagram"></i></span>
              </a>
            </div>
          </div>
          {/* mail submit */}
          <p className="text-center mt-40">Get latest update for our premium services</p>
          <form className="newsletter-form" action="#" method="post">
            <div className="form-group">
              <input type="email" name="email" className="email" placeholder="Enter Your Email" autoComplete="on" required />
              <button type="submit">
                <i className="far fa-paper-plane"></i>
                <span className="btn-title"></span>
              </button>
            </div>
          </form>

          <ul className="sidebar-social">
            {socialLinks ? (
              socialLinks
                .filter((link) => link.enabled)
                .map((link) => (
                  <li key={link.platform} className={link.platform}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      <i className={link.icon}></i>
                    </a>
                  </li>
                ))
            ) : (
              <>
                <li className="facebook"><a href="#"><i className="fab fa-facebook-f"></i></a></li>
                <li className="instagram"><a href="#"><i className="fab fa-instagram"></i></a></li>
                <li className="twitter"><a href="#"><i className="fab fa-twitter"></i></a></li>
                <li className="g-plus"><a href="#"><i className="fab fa-google-plus"></i></a></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
