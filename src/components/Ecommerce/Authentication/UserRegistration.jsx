import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../../config';
import SuccessPopup from './successPopup';
import ErrorPopup from './errorPopup';
import TextField from '@mui/material/TextField';
import { Close, ArrowBack  } from '@mui/icons-material';
import { GlobalStateContext } from '../GlobalState';
import './UserRegistration.css';
import logo from '../../../images/logo.png'; // Adjust the path as necessary

const RegistrationPopup = ({ onClose, toggleAuthMode }) => {
  const navigate = useNavigate();
  const { setUser } = useContext(GlobalStateContext);

  const [registrationData, setRegistrationData] = useState({
    name: '',
    email: '',
    mobile_number: '',
    password: '',
    confirmPassword: '',
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResendOTP, setCanResendOTP] = useState(true);
  const [useMobileLogin, setUseMobileLogin] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [registrationStep, setRegistrationStep] = useState(1);

    useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    } else if (otpTimer === 0 && !canResendOTP) {
      setCanResendOTP(true);
    }
    return () => clearInterval(interval);
  }, [otpTimer, canResendOTP]);

  const handleRegistrationChange = (e) => {
    const { name, value } = e.target;
    setRegistrationData({ ...registrationData, [name]: value });
  };

const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    
    if (registrationStep === 1) {
      // Validate step 1
      if (!registrationData.email && !registrationData.mobile_number) {
        setErrorMessage('Please enter either email or mobile number');
        setShowError(true);
        return;
      }
      
      try {
        setIsSendingOTP(true);
        const payload = useMobileLogin
          ? { mobile_number: registrationData.mobile_number }
          : { email: registrationData.email };
        
        await axios.post(`${BASE_URL}/send-otp`, payload);
        setSuccessMessage('OTP sent successfully!');
        setRegistrationStep(2);
      } catch (error) {
        setErrorMessage(error.response?.data?.detail || 'Failed to send OTP');
        setShowError(true);
      } finally {
        setIsSendingOTP(false);
      }
    } else {
      // Validate step 2
      if (!registrationData.name) {
        setErrorMessage('Name is required');
        setShowError(true);
        return;
      }
      
      if (registrationData.password !== registrationData.confirmPassword) {
        setErrorMessage('Passwords do not match');
        setShowError(true);
        return;
      }
      
      if (otp.some(digit => digit === '')) {
        setErrorMessage('Please enter the complete OTP');
        setShowError(true);
        return;
      }
      
      try {
        const otpString = otp.join('');
        // Verify OTP first
        const verifyPayload = useMobileLogin
          ? { mobile_number: registrationData.mobile_number, otp: otpString }
          : { email: registrationData.email, otp: otpString };
        
        await axios.post(`${BASE_URL}/verify-otp`, verifyPayload);
        
        // Then register the user
        const registrationPayload = {
          name: registrationData.name,
          email: useMobileLogin ? null : registrationData.email,
          mobile_number: useMobileLogin ? registrationData.mobile_number : null,
          password: registrationData.password,
          confirmPassword: registrationData.confirmPassword
        };
        
        const response = await axios.post(`${BASE_URL}/userregister`, registrationPayload);
        
        // Handle successful registration
if (response.data.token) {
  localStorage.setItem('authToken', response.data.token);
  setUser({
    id: response.data.user_id,
    name: response.data.name,
    email: response.data.email,
    mobile_number: response.data.mobile_number
  });
}
        
        setIsSuccess(true);
        setSuccessMessage('Registration successful!');
      } catch (error) {
        console.error('Registration error:', error);
        setErrorMessage(
          error.response?.data?.detail || 
          error.response?.data?.message || 
          'Registration failed. Please try again.'
        );
        setShowError(true);
      }
    }
  };

  const handleSuccessClose = () => {
    setIsSuccess(false);
    onClose();
  };

  const handleErrorClose = () => {
    setShowError(false);
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const toggleMobileLogin = () => {
    setUseMobileLogin(!useMobileLogin);
    setRegistrationData({
      ...registrationData,
      email: useMobileLogin ? registrationData.email : '',
      mobile_number: useMobileLogin ? '' : registrationData.mobile_number
    });
  };

  const handleSendOTP = async () => {
    if ((!registrationData.mobile_number && !registrationData.email) || !canResendOTP) return;
  
    setIsSendingOTP(true);
    try {
      const payload = useMobileLogin
        ? { mobile_number: registrationData.mobile_number }
        : { email: registrationData.email };
      
      await axios.post(`${BASE_URL}/send-otp`, payload);
      
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

    const handleBackToStep1 = () => {
    setRegistrationStep(1);
  };

  return (
    <div className='overlay'>
      <div className='popup'>
        {isSuccess ? (
          <SuccessPopup
            message={successMessage}
            onClose={handleSuccessClose}
          />
        ) : showError ? (
          <ErrorPopup
            message={errorMessage}
            onClose={handleErrorClose}
          />
        ) : (
          <div className='two-column-layout'>
            <div className='left-column'>
              <h1 className='neuralife-text'>neuraLife</h1>
              <div className='logo-container'>
                <img
                  src={logo}
                  alt="Company Logo"
                  className='logo'
                />
              </div>
            </div>
            
            <div className='right-column'>
              <div className='header-container'>
                <h2 className='auth-title'>
                  {registrationStep === 1 ? 'Sign Up' : 'Sign Up'}
                </h2>
                <div className='closeIcon-container' onClick={onClose}>
                  <Close className='close-icon'/>
                </div>
              </div>
              
              <div className='reg-form-container'>
                <form onSubmit={handleRegistrationSubmit}>
                  {registrationStep === 1 ? (
                    <div className='form-group'>
                      {useMobileLogin ? (
                        <input
                          type="text"
                          name="mobile_number"
                          placeholder='Mobile Number'
                          value={registrationData.mobile_number}
                          onChange={handleRegistrationChange}
                          required
                          className="custom-input"
                        />
                      ) : (
                        <input
                          type="email"
                          name="email"
                          placeholder='Email'
                          value={registrationData.email}
                          onChange={handleRegistrationChange}
                          required
                          className="custom-input"
                        />
                      )}
                      <div className='otp-button-container'>
                        <button
                          type="button"
                          className='send-otp-button'
                          onClick={toggleMobileLogin}
                        >
                          {useMobileLogin ? 'Use Email Instead' : 'Use Mobile Instead'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className='form-group'>
                        <input
                          type="text"
                          name="name"
                          placeholder='Full Name'
                          value={registrationData.name}
                          onChange={handleRegistrationChange}
                          required
                          className="custom-input"
                        />
                      </div>
                      <div className='otp-section'>
                        <div className='otp-container'>
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
                        <div className='otp-button-container'>
                          <button
                            type="button"
                            className='send-otp-button'
                            onClick={handleSendOTP}
                            disabled={!canResendOTP || isSendingOTP}
                          >
                            {isSendingOTP ? 'Sending...' : 
                             canResendOTP ? 'Send OTP' : `Resend OTP (${otpTimer}s)`}
                          </button>
                        </div>
                      </div>
                      <div className='form-group'>
                        <input
                          type="password"
                          name="password"
                          placeholder='Password'
                          value={registrationData.password}
                          onChange={handleRegistrationChange}
                          required
                          className="custom-input"
                        />
                      </div>
                      <div className='form-group'>
                        <input
                          type="password"
                          name="confirmPassword"
                          placeholder='Confirm Password'
                          value={registrationData.confirmPassword}
                          onChange={handleRegistrationChange}
                          required
                          className="custom-input"
                        />
                      </div>
                    </>
                  )}
                </form>
              </div>
              
              <div className='button-container'>
                  {registrationStep === 2 && (
                  <button 
                    type="button" 
                    className='back-button'
                    onClick={handleBackToStep1}
                  >
                    <ArrowBack /> Back
                  </button>
                )}
                <button 
                  type="submit" 
                  className='reg-lgn-btn'
                  onClick={handleRegistrationSubmit}
                >
                  {registrationStep === 1 ? 'Next' : 'Register'}
                </button>
              </div>
              
              <div className='auth-toggle-text'>
                Already have an account? 
                <span className='auth-toggle-link' onClick={toggleAuthMode}>
                  Sign In
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationPopup;