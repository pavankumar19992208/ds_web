import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/large-dNk4O_UUZ-transformed (1).png';
import { FaBars } from 'react-icons/fa'; // Import the pi-bars icon
import LoginPopup from './popups/LoginPopup';
import SchoolLogin from '../components/P2pHeader/SchoolSegment/SchoolLogin';

const NavBar = ({ showButtons = true }) => {
  const [isHovered, setIsHovered] = useState({});
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle the menu
  const [showLoginPopup, setShowLoginPopup] = useState(false); // State to control the visibility of the LoginPopup
  const [showSchoolLoginPopup, setShowSchoolLoginPopup] = useState(false); // State to control the visibility of the SchoolLoginPopup
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to toggle the LoginPopup visibility
  const toggleLoginPopup = () => {
    setShowLoginPopup(!showLoginPopup);
  };

  // Function to toggle the SchoolLoginPopup visibility
  const toggleSchoolLoginPopup = () => {
    setShowSchoolLoginPopup(!showSchoolLoginPopup);
  };

  const navBarStyle = {
    maxHeight: windowWidth < 768 ? '20vh' : '10vh',
    width: 'auto',
    // backgroundColor: '#E9F4FA',
    display: 'flex',
    alignItems: 'center',
    justifyContent: windowWidth < 320 ? 'center' : 'flex-start',
    color: '#042642',
    fontFamily: 'monospace',
    borderRadius: '30px',
    marginLeft: '1.5%',
    marginRight: '1.5%',
    marginTop: windowWidth < 450 ? '3%' : '1%',
    flexDirection: windowWidth < 320 ? 'column' : 'row',
  };

  const logoStyle = {
    width: '8%',
    height: '8%',
    filter: 'brightness(1.1) contrast(1.5)',
    marginRight: '2%',
    marginLeft: '1%',
  };

  const titleStyle = {
    fontFamily: "'Libre Baskerville', serif",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0rem',
    marginLeft: windowWidth < 450 ? '25%' : '1%',
    marginRight: windowWidth < 450 ? '35%' : '40%',
  };

  const renderStyles = () => {
    if (windowWidth < 450) {
      return {
        position: isMenuOpen ? 'fixed' : 'absolute',
        top: 0,
        right: 0,
        marginTop: '10%',
        width: '150px',
        height: '15vh',
        backgroundColor: '#E9F4FA',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        transform: isMenuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease-in-out',
      };
    } else {
      return {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '15px',
        marginLeft: '1%',
      };
    }
  };

  const colors = ['#27BBAF41', '#974EAD4E', '#09599F50', '#00BFFF4E'];

  const buttonStyle = (button) => ({
    marginRight: '2%',
    padding: '10px',
    background: windowWidth < 450 ? '#00BFFF4E' : (isHovered[button] ? colors[Math.floor(Math.random() * colors.length)] : 'transparent'),
    borderRadius: '20px',
    border: windowWidth < 450 ? '1px solid #04264229' : (isHovered[button] ? '1px solid #04264229' : 'none'),
    fontFamily: isHovered[button] ? "'Tektur', cursive" : "'Tektur', cursive",
    whiteSpace: 'nowrap',
  });

  const renderButtons = () => (
    <div style={renderStyles()}>
      <button
        style={buttonStyle('demo')}
        onMouseEnter={() => setIsHovered({ ...isHovered, demo: true })}
        onMouseLeave={() => setIsHovered({ ...isHovered, demo: false })}
      >
        Book A Demo
      </button>
      <button
        style={buttonStyle('brochure')}
        onMouseEnter={() => setIsHovered({ ...isHovered, brochure: true })}
        onMouseLeave={() => setIsHovered({ ...isHovered, brochure: false })}
      >
        Brochure
      </button>
      <button
        style={buttonStyle('shopNow')}
        onMouseEnter={() => setIsHovered({ ...isHovered, shopNow: true })}
        onMouseLeave={() => setIsHovered({ ...isHovered, shopNow: false })}
        onClick={() => navigate('/ecommerce-dashboard')} // Redirect to the ecommerce page
      >
        Shop Now
      </button>
      <button
        style={buttonStyle('login')}
        onMouseEnter={() => setIsHovered({ ...isHovered, login: true })}
        onMouseLeave={() => setIsHovered({ ...isHovered, login: false })}
        onClick={toggleLoginPopup}
      >
        Admin Login
      </button>
      <button
        style={buttonStyle('schoolLogin')}
        onMouseEnter={() => setIsHovered({ ...isHovered, schoolLogin: true })}
        onMouseLeave={() => setIsHovered({ ...isHovered, schoolLogin: false })}
        onClick={toggleSchoolLoginPopup}
      >
        School Login
      </button>
    </div>
  );

  return (
    <>
      <div style={navBarStyle}>
        <img src={logo} alt="Logo" style={logoStyle} />
        <div style={titleStyle}>
          <p style={{
            margin: '0',
            fontSize: windowWidth < 900 ? '0.4rem' : (windowWidth < 1000 ? '0.8rem' : '1.2rem'),
            fontFamily: "'Rubik Doodle Shadow', cursive",
            fontWeight: '900' // Add this line
          }}>
            DIGITAL SCHOOLING
          </p>
          <p style={{ margin: '0', fontWeight: '900', fontSize: windowWidth < 900 ? '0.3rem' : '1rem' }}>
            <span style={{ color: '#0E5E9D' }}>P2P </span>
            <span style={{ color: '#F965A0' }}>TECHWORKS</span>
          </p>
        </div>
        {windowWidth < 450 ? (
          <FaBars onClick={() => setIsMenuOpen(!isMenuOpen)} /> // Render the pi-bars icon and toggle the menu on click
        ) : (
          showButtons && renderButtons()
        )}
        {isMenuOpen && windowWidth < 450 && renderButtons()}
      </div>
      {showLoginPopup && <LoginPopup onClose={toggleLoginPopup} />}
      {showSchoolLoginPopup && <SchoolLogin onClose={toggleSchoolLoginPopup} />}
    </>
  );
};

export default NavBar;