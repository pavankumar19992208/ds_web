import React from 'react';
import Header from './header/header.jsx';
import HeroSection from './heroSection/heroSection.jsx';
import Features from './features/features.jsx';
import Footer from './footer/footer.jsx';
import './landingPage.css';
function LandingPage() {
    return (
      <div className='landing-page'>
        {/* <Header/> */}
        <HeroSection/>
        {/* <div className='features'><Features/></div>
        <div className='footer'><Footer/></div> */}
      </div>
    );
  }
  
  export default LandingPage;
  