import React, { useState,useContext  } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../config';
import SuccessPopup from './successPopup'; // Import the SuccessPopup component
import ErrorPopup from './errorPopup'; // Import the ErrorPopup component
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import logo from '../../images/logo.png'; 
import { Close } from '@mui/icons-material';
import { GlobalStateContext } from '../../GlobalStateContext';
import './SchoolRegistration.css';

const AuthPopup = ({ onClose }) => {
  const navigate = useNavigate();
  const { setGlobalData } = useContext(GlobalStateContext);

  const [formData, setFormData] = useState({
    school_name: '',
    syllabus_type: '',
    admin_name: '',
    mobile_number: '',
    email: '',
    password: '',
    schoolId: '', // Add schoolId for login
  });

  const [isSuccess, setIsSuccess] = useState(false); // State to track success
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and registration
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // Array to store each digit of the OTP
  const [useMobileLogin, setUseMobileLogin] = useState(false); // State to toggle between schoolId and mobile login
  const [errorMessage, setErrorMessage] = useState(''); // State to track error message
  const [showError, setShowError] = useState(false); // State to toggle error popup

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      // Handle login logic
      const payload = useMobileLogin
        ? { mobile_number: formData.mobile_number, password: formData.password }
        : { schoolId: formData.schoolId, password: formData.password };
  
      try {
        console.log('Login payload:', payload);
        const response = await axios.post(`${BASE_URL}/login`, payload);
        console.log('Login successful:', response.data);
  
        // Extract school data from the response
        const schoolData = response.data.school;
  
        // Set global data with the correct structure
        setGlobalData({ data: schoolData });
  
        // Extract school_id from the school data
        const schoolId = schoolData.school_id;
  
        // Navigate to the school dashboard with the respective school ID
        navigate(`/school_dashboard/${schoolId}`);
  
        setIsSuccess(true); // Show success popup
      } catch (error) {
        console.error('Login failed:', error);
        setErrorMessage('Invalid credentials. Please try again.'); // Set error message
        setShowError(true); // Show error popup
      }
    } else {
      // Handle registration logic
      try {
        console.log('Payload being sent to backend:', formData);
        const response = await axios.post(`${BASE_URL}/schregister`, formData);
        console.log('Registration successful:', response.data);
        setIsSuccess(true); // Show success popup
      } catch (error) {
        console.error('Registration failed:', error);
        setErrorMessage('Registration failed. Please try again.'); // Set error message
        setShowError(true); // Show error popup
      }
    }
  };

const handleSuccessClose = () => {
  setIsSuccess(false); // Close success popup
  onClose(); // Close the auth popup
};

  const handleErrorClose = () => {
    setShowError(false); // Close error popup
  };

  const handleOTPClick = () => {
    setShowOTP(!showOTP);
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  const toggleMobileLogin = () => {
    setUseMobileLogin(!useMobileLogin);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>

        {isSuccess ? (
          <SuccessPopup
            message={isLogin ? 'Login successful!' : 'Your school has been successfully registered.'}
            onClose={handleSuccessClose}
          />
        ) : showError ? (
          <ErrorPopup
            message={errorMessage}
            onClose={handleErrorClose}
          />
        ) : (
          <div style={styles.twoColumnLayout}>
            {/* Left Column: Company Logo */}
            <div style={styles.leftColumn}>
  {/* NeuraLife Text */}
  <h1 style={styles.neuraLifeText}>NeuraLife</h1>
  
  {/* Centered Logo Container */}
  <div style={styles.logoContainer}>
    <img
      src={logo} // Use the imported image
      alt="Company Logo"
      style={styles.logo}
    />
  </div>
</div>
            {/* Right Column: Registration/Login Fields */}
            <div style={styles.rightColumn}>
  <div style={styles.headerContainer}>
    <h2 style={styles.auth_title}>{isLogin ? 'Login' : 'Registration'}</h2>
    <div style={styles.closeIconContainer} onClick={onClose}>
      <Close style={styles.closeIcon} />
    </div>
  </div>
  {/* Form Container with Scroll */}
  <div style={styles.formContainer}>
    <form onSubmit={handleSubmit}>
      {/* Form fields remain unchanged */}
      {!isLogin && (
        <>
          <div style={styles.formGroup}>
            <input
              type="text"
              name="school_name"
              placeholder='School Name'
              value={formData.school_name}
              onChange={handleChange}
              required
              style={styles.inputField}
              className="custom-input"
            />
          </div>
          <div style={styles.formGroup}>
            <input
              type="text"
              name="syllabus_type"
              placeholder='Syllabus Type'
              value={formData.syllabus_type}
              onChange={handleChange}
              required
              style={styles.inputField}
              className="custom-input"
            />
          </div>
          <div style={styles.formGroup}>
            <input
              type="text"
              name="admin_name"
              placeholder='Admin Name'
              value={formData.admin_name}
              onChange={handleChange}
              required
              style={styles.inputField}
              className="custom-input"
            />
          </div>
          <div style={styles.formGroup}>
            <input
              type="text"
              name="mobile_number"
              placeholder='Mobile Number'
              value={formData.mobile_number}
              onChange={handleChange}
              required
              style={styles.inputField}
              className="custom-input"
            />
          </div>
          <div style={styles.formGroup}>
            <input
              type="email"
              name="email"
              placeholder='Email'
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.inputField}
              className="custom-input"
            />
          </div>
        </>
      )}
      {isLogin && !useMobileLogin && (
        <div style={styles.formGroup}>
          <input
            type="text"
            name="schoolId"
            placeholder='School ID'
            value={formData.schoolId}
            onChange={handleChange}
            required
            style={styles.inputField}
            className="custom-input"
          />
        </div>
      )}
      {isLogin && useMobileLogin && (
        <div style={styles.formGroup}>
          <input
            type="text"
            name="mobile_number"
            placeholder='Mobile Number'
            value={formData.mobile_number}
            onChange={handleChange}
            required
            style={styles.inputField}
            className="custom-input"
          />
        </div>
      )}
      {!showOTP && (
        <div style={styles.formGroup}>
          <input
            type="password"
            name="password"
            placeholder='Password'
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.inputField}
            className="custom-input"
          />
        </div>
      )}
      {showOTP && isLogin && (
        <div style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextField
              key={index}
              value={digit}
              onChange={(e) => handleOtpChange(e.target.value, index)}
              inputProps={{
                maxLength: 1,
                style: { textAlign: 'center' },
              }}
              required
              style={styles.otpInputField}
            />
          ))}
        </div>
      )}
      {isLogin && (
        <>
                  <div style={styles.btnGroup}>
            <Button
              type="button"
              style={styles.otpButton}
              onClick={handleOTPClick}
            >
              Forgot Password
            </Button>
          </div>
          <div style={styles.btnGroup}>
            <Button
              type="button"
              style={styles.otpButton}
              onClick={handleOTPClick}
            >
              {showOTP ? 'Use Password' : 'Use OTP'}
            </Button>
          </div>
          <div style={styles.btnGroup}>
            <Button
              type="button"
              style={styles.otpButton}
              onClick={toggleMobileLogin}
            >
              {useMobileLogin ? 'Login with School ID' : 'Login with Mobile'}
            </Button>
          </div>
        </>
      )}
    </form>
  </div>
  {/* Button Container */}
  <div style={styles.buttonContainer}>
  <button 
    type="submit" 
    className='reg-lgn-btn'
    onClick={handleSubmit} // Explicitly handle the onClick event
  >
    {isLogin ? 'Login' : 'Register'}
  </button>
</div>
  <div style={styles.authToggleText}>
    {isLogin ? 'Don’t have an account? ' : 'Already have an account? '}
    <span style={styles.authToggleLink} onClick={toggleAuthMode}>
      {isLogin ? 'Sign up for free' : 'Login'}
    </span>
  </div>
</div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    width: '1000px', // Increased width to accommodate two columns
    height: '500px',
    display: 'flex',
    justifyContent: 'center',
    border: '6px solid #444781',
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between', // Space between title and close icon
    alignItems: 'center', // Vertically center items
    width: '100%', // Take full width of the right column
  },
  closeIconContainer: {
    cursor: 'pointer', // Add pointer cursor for better UX
  },
  closeIcon: {
    color: '#fff', // Match the text color
    fontSize: '24px', // Adjust icon size
  },
  auth_title:{
    marginBottom: '30px',
    fontSize: '34px',
    fontWeight: 700,
  },
  twoColumnLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr', // Left column for logo, right column for form
    width: '100%', // Take full width of the popup
    height: '100%',
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column', // Stack items vertically
    justifyContent: 'flex-start', // Align items to the top
    alignItems: 'flex-start', // Align text to the left
    padding: '20px', // Add padding for spacing
  },

  neuraLifeText: {
    color: '#444781', // Match the theme color
    fontSize: '40px',
    fontWeight: 'bold',
    margin: '0', // Remove default margin
  },
  rightColumn: {
    padding: '0px 30px', // Add padding for spacing
    color: '#fff',
    backgroundColor: '#444781',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden', // Prevent scrolling in the right column
  },
  formContainer: {
    flex: 1, // Take remaining space
    overflowY: 'auto', // Enable vertical scrolling
    paddingRight: '10px', // Add padding to prevent scrollbar overlap
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center', // Center the logo horizontally
    alignItems: 'center', // Center the logo vertically
    width: '100%', // Take full width of the left column
    marginTop: '60px', // Add space between text and logo
  },
  logo: {
    maxWidth: '100%',
    height: '240px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  otpContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
    width: '80%',
  },
  otpInputField:{
    border: '2px solid #AEAEAE',
    borderRadius: '8px',
  },
  otpButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#fff',
    textDecoration: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '12px',
  },
  btnGroup:{
    margin: '0',

  },
  authToggleText: {
    marginTop: '15px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#fff',
  },
  authToggleLink: {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 'semibold',
    cursor: 'pointer',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end', // Align button to the right
    marginTop: '20px', // Add some spacing above the button
    paddingBottom: '20px', // Add padding at the bottom
  },
  // inputField: {
  //   width: '40%',
  //   padding: '10px',
  //   borderRadius: '5px',
  //   border: '1px solid #AEAEAE',
  //   fontSize: '14px',
  //   background: 'none',
  //   color: '#fff',
  // },
};

export default AuthPopup;