import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegistrationPopup from '../../popups/SchoolRegistration'; // Import the new RegistrationPopup

import './header.css';
function Header() {
  const navigate = useNavigate();
  const [showRegistrationPopup, setShowRegistrationPopup] = useState(false); // State for registration popup
  
  const toggleRegistrationPopup = () => {
    setShowRegistrationPopup(!showRegistrationPopup); // Toggle registration popup
  };
    return (
      <>
        <div className='lp-header-container'>
          <div className='lp-header-logo-container'>
              <div className='lp-header-logo'></div>
              <div className='lp-header-logo-text'>neuraLife</div>
          </div>
          <button className='lp-header-button' onClick={() => navigate('/ecommerce-dashboard')}>Shop</button>
          <button className='lp-header-button'>Blog</button>
          <button className='lp-header-button'>About Us</button>
          <button className='lp-header-button' onClick={toggleRegistrationPopup}>Sign In</button>
          <button className='lp-header-demo-button'>Get demo</button>
  
        </div>
        {showRegistrationPopup && <RegistrationPopup onClose={toggleRegistrationPopup} />}
      </>
    );
  }
  
  export default Header;