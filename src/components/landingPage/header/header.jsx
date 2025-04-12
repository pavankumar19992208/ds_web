import React from 'react';
import './header.css';
function Header() {
    return (
      <div className='lp-header-container'>
        <div className='lp-header-logo-container'>
            <div className='lp-header-logo'></div>
            <div className='lp-header-logo-text'>neuraLife</div>
        </div>
        <div>Shop</div>
        <div>Blog</div>
        <div>About Us</div>
        <div>Sign In</div>
        <div>Sign Up</div>
        <div className='lp-header-demo-button'>Get demo</div>

      </div>
    );
  }
  
  export default Header;