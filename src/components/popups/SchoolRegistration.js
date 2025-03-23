import React, { useState,useContext  } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../config';
import SuccessPopup from './successPopup'; // Import the SuccessPopup component
import ErrorPopup from './errorPopup'; // Import the ErrorPopup component
import TextField from '@mui/material/TextField';
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
    <div style={styles.overlay} className='overlay'>
      <div style={styles.popup} className='popup'>

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
          <div style={styles.twoColumnLayout} className='two-column-layout'>
            {/* Left Column: Company Logo */}
            <div style={styles.leftColumn} className='left-column'>
  {/* NeuraLife Text */}
  <h1 style={styles.neuraLifeText} className='neuralife-text'>neuraLife</h1>
  
  {/* Centered Logo Container */}
  <div style={styles.logoContainer} className='logo-container'>
    <img
      src={logo} // Use the imported image
      alt="Company Logo"
      style={styles.logo}
      className='logo'
    />
  </div>
</div>
            {/* Right Column: Registration/Login Fields */}
            <div style={styles.rightColumn} className='right-column'>
  <div style={styles.headerContainer} className='header-container'>
    <h2 style={styles.auth_title} className='auth-title'>{isLogin ? 'Login' : 'Registration'}</h2>
    <div style={styles.closeIconContainer} className='closeIcon-container' onClick={onClose}>
      <Close style={styles.closeIcon} className='close-icon'/>
    </div>
  </div>
  {/* Form Container with Scroll */}
  <div style={styles.formContainer} className='reg-form-container'>
    <form onSubmit={handleSubmit}>
      {/* Form fields remain unchanged */}
      {!isLogin && (
        <>
          <div style={styles.formGroup} className='form-group'>
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
          <div style={styles.formGroup} className='form-group'>
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
          <div style={styles.formGroup} className='form-group'>
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
          <div style={styles.formGroup} className='form-group'>
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
          <div style={styles.formGroup} className='form-group'>
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
        <div style={styles.formGroup} className='form-group'>
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
        <div style={styles.formGroup} className='form-group'>
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
        <div style={styles.formGroup} className='form-group'>
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
        <div style={styles.otpContainer} className='otp-container'>
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
              className="otp-input-field"
            />
          ))}
        </div>
      )}
      {isLogin && (
        <>
                  <div style={styles.btnGroup} className='reg-btn-group'>
            <button
              type="button"
              style={styles.otpButton}
              className='otp-button'
              onClick={handleOTPClick}
            >
              Forgot Password
            </button>
          </div>
          <div style={styles.btnGroup} className='reg-btn-group'>
            <button
              type="button"
              style={styles.otpButton}
              className='otp-button'
              onClick={handleOTPClick}
            >
              {showOTP ? 'Use Password' : 'Use OTP'}
            </button>
          </div>
          <div style={styles.btnGroup} className='reg-btn-group'>
            <button
              type="button"
              style={styles.otpButton}
              className='otp-button'
              onClick={toggleMobileLogin}
            >
              {useMobileLogin ? 'Login with School ID' : 'Login with Mobile'}
            </button>
          </div>
        </>
      )}
    </form>
  </div>
  {/* Button Container */}
  <div style={styles.buttonContainer} className='button-container'>
  <button 
    type="submit" 
    className='reg-lgn-btn'
    onClick={handleSubmit} // Explicitly handle the onClick event
  >
    {isLogin ? 'Login' : 'Register'}
  </button>
</div>
  <div style={styles.authToggleText} className='auth-toggle-text'>
    {isLogin ? 'Don’t have an account? ' : 'Already have an account? '}
    <span style={styles.authToggleLink} className='auth-toggle-link' onClick={toggleAuthMode}>
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

 
};

export default AuthPopup;