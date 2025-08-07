import React, { useState, useContext, useEffect } from 'react';
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
  const [otp, setOtp] = useState(['', '', '', '']); // Array to store each digit of the OTP
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResendOTP, setCanResendOTP] = useState(true);
  const [useMobileLogin, setUseMobileLogin] = useState(false); // State to toggle between schoolId and mobile login
  const [errorMessage, setErrorMessage] = useState(''); // State to track error message
  const [showError, setShowError] = useState(false); // State to toggle error popup
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Timer effect for OTP resend
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setCanResendOTP(true);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      try {
        if (showOTP) {
          // Handle OTP login
          const otpString = otp.join('');
          const payload = useMobileLogin
            ? { mobile_number: formData.mobile_number, otp: otpString }
            : { schoolId: formData.schoolId, otp: otpString };
          
          const response = await axios.post(`${BASE_URL}/verify-otp-login`, payload);
          const schoolData = response.data.school;
          
          setGlobalData({ data: schoolData });
          navigate(`/school_dashboard/${schoolData.school_id}`);
        } else {
          // Handle password login (existing code)
          const payload = useMobileLogin
            ? { mobile_number: formData.mobile_number, password: formData.password }
            : { schoolId: formData.schoolId, password: formData.password };
          
          const response = await axios.post(`${BASE_URL}/login`, payload);
          const schoolData = response.data.school;
          
          setGlobalData({ data: schoolData });
          navigate(`/school_dashboard/${schoolData.school_id}`);
        }
      } catch (error) {
        setErrorMessage(error.response?.data?.detail || 'Invalid credentials. Please try again.');
        setShowError(true);
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
    setOtp(['', '', '', '']); // Reset OTP fields when toggling
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

  const handleSendOTP = async () => {
    if ((!formData.mobile_number && !formData.schoolId) || !canResendOTP) return;
  
    setIsSendingOTP(true);
    try {
      const payload = useMobileLogin
        ? { mobile_number: formData.mobile_number }
        : { schoolId: formData.schoolId };
      
      await axios.post(`${BASE_URL}/send-otp`, payload);
      
      // Start the 30-second timer
      setOtpTimer(30);
      setCanResendOTP(false);
      setSuccessMessage('OTP sent successfully!');
      
    } catch (error) {
      setErrorMessage(error.response?.data?.detail || 'Failed to send OTP. Please try again.');
      setShowError(true);
    } finally {
      setIsSendingOTP(false);
    }
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
            <TextField
              variant="standard"
              label="School Name"
              type="text"
              name="school_name"
              placeholder='School Name'
              value={formData.school_name}
              onChange={handleChange}
              required
              style={styles.inputField}
            />
          </div>
          <div style={styles.formGroup} className='form-group'>
            <TextField
              variant="standard"
              label="Syllabus Type"
              type="text"
              name="syllabus_type"
              placeholder='Syllabus Type'
              value={formData.syllabus_type}
              onChange={handleChange}
              required
              style={styles.inputField}
            />
          </div>
          <div style={styles.formGroup} className='form-group'>
            <TextField
              variant="standard"
              label="Admin Name"
              type="text"
              name="admin_name"
              placeholder='Admin Name'
              value={formData.admin_name}
              onChange={handleChange}
              required
              style={styles.inputField}
            />
          </div>
          <div style={styles.formGroup} className='form-group'>
            <TextField
              variant="standard"
              label="Mobile Number"
              type="text"
              name="mobile_number"
              placeholder='Mobile Number'
              value={formData.mobile_number}
              onChange={handleChange}
              required
              style={styles.inputField}
            />
          </div>
          <div style={styles.formGroup} className='form-group'>
            <TextField
              variant="standard"
              label="Email"
              type="email"
              name="email"
              placeholder='Email'
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.inputField}
            />
          </div>
        </>
      )}
      {isLogin && !useMobileLogin && (
        <div style={styles.formGroup} className='form-group'>
          <TextField
            variant="standard"
            label="School ID"
            type="text"
            name="schoolId"
            placeholder='School ID'
            value={formData.schoolId}
            onChange={handleChange}
            required
            style={styles.inputField}
          />
        </div>
      )}
      {isLogin && useMobileLogin && (
        <div style={styles.formGroup} className='form-group'>
          <TextField
            variant="standard"
            label="Mobile Number"
            type="text"
            name="mobile_number"
            placeholder='Mobile Number'
            value={formData.mobile_number}
            onChange={handleChange}
            required
            style={styles.inputField}
          />
        </div>
      )}
      {!showOTP && (
        <div style={styles.formGroup} className='form-group'>
          <TextField
            variant="standard"
            label="Password"
            type="password"
            name="password"
            placeholder='Password'
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.inputField}
          />
        </div>
      )}

{showOTP && isLogin && (
    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '15px' }}>
      <div style={styles.otpContainer} className='otp-container'>
        {otp.map((digit, index) => (
          <TextField
            key={index}
            value={digit}
            onChange={(e) => handleOtpChange(e.target.value, index)}
          inputProps={{
            maxLength: 1,
            style: { textAlign: 'center', color: '#fff' },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#AEAEAE',
              },
              '&:hover fieldset': {
                borderColor: '#AEAEAE',
              },
            },
            input: { color: '#fff' },
          }}
          className="otp-input-field"
        />
      ))}
    </div>
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
        <button
          type="button"
          style={styles.sendOtpButton}
          className='send-otp-button'
          onClick={handleSendOTP}
          disabled={!canResendOTP || isSendingOTP}
        >
          {isSendingOTP ? 'Sending...' : 
           canResendOTP ? 'Send OTP' : `Resend OTP (${otpTimer}s)`}
        </button>
      </div>
    </div>
  )}
  
  {isLogin && (
  <>
    <div style={styles.btnGroup} className='reg-btn-group'>
      {!showOTP && (
        <button
          type="button"
          style={styles.otpButton}
          className='otp-button'
          onClick={handleOTPClick}
        >
          Forgot Password
        </button>
      )}
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