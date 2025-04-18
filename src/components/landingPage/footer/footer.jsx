import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import InstagramIcon from '../../../images/instagram.png';
import YoutubeIcon from '../../../images/youtube.png';
import TwitterIcon from '../../../images/x.png';

import './footer.css';

function Footer() {
  return (
    <div className="lp-footer">
      <div className="lp-footer-content">
        <div className="lp-footer-header">
          <h2>neuraLife</h2>
          <p>Empowering schools with smart digital tools</p>
        </div>
        
        <div className="lp-footer-columns">
          <div className="lp-column">
            <h3>Platform</h3>
            <ul>
              <li>School ERP</li>
              <li>Slinked</li>
              <li>E-commerce</li>
              <li>AI Tools</li>
              <li>Community</li>
            </ul>
          </div>
          
          <div className="lp-column">
            <h3>Resources</h3>
            <ul>
              <li>Blog</li>
              <li>Help Center</li>
              <li>FAQ</li>
              <li>Tutorials</li>
            </ul>
          </div>
          
          <div className="lp-column">
            <h3>Company</h3>
            <ul>
              <li>About</li>
              <li>Contact Us</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
        </div>
        
        <div className="lp-social-icons">
          <a href="#">
            <img src={InstagramIcon} alt="Facebook" className="lp-social-icon" />
          </a>
          <a href="#">
            <img src={YoutubeIcon} alt="Twitter" className="lp-social-icon" />
          </a>
          <a href="#">
            <img src={TwitterIcon} alt="LinkedIn" className="lp-social-icon" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Footer;