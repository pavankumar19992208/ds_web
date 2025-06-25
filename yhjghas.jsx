import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../../config';
import SuccessPopup from './SuccessPopup';
import ErrorPopup from './ErrorPopup';
import { Close, ArrowBack } from '@mui/icons-material';
import './AgentRegistration.css';
import logo from '../../../images/logo.png';

const AgentRegistration = ({ onClose, toggleAuthMode }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile_number: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });
  const [step, setStep] = useState(1); // 1: initial form, 2: OTP verification
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResendOTP, setCanResendOTP] = useState(true);
  const [isSendingOTP, setIsSendingOTP] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name) {
      setErrorMessage('Name is required');
      return false;
    }
    
    if (!formData.email && !formData.mobile_number) {
      setErrorMessage('Either email or mobile number is required');
      return false;
    }
    
    if (formData.email && !formData.email.match(/^\S+@\S+\.\S+$/)) {
      setErrorMessage('Enter a valid email address');
      return false;
    }
    
    if (formData.mobile_number && !formData.mobile_number.match(/^[6-9]\d{9}$/)) {
      setErrorMessage('Enter a valid 10-digit mobile number');
      return false;
    }
    
    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!validateForm()) {
      setShowError(true);
      return;
    }
    
    try {
      setIsSendingOTP(true);
      const payload = {
        email: formData.email || null,
        mobile_number: formData.mobile_number || null
      };
      
      await axios.post(`${BASE_URL}/agent-send-otp`, payload);
      
      setSuccessMessage('OTP sent successfully!');
      setStep(2);
      setOtpTimer(30);
      setCanResendOTP(false);
    } catch (error) {
      setErrorMessage(error.response?.data?.detail || 'Failed to send OTP');
      setShowError(true);
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResendOTP) return;
    
    try {
      setIsSendingOTP(true);
      const payload = {
        email: formData.email || null,
        mobile_number: formData.mobile_number || null
      };
      
      await axios.post(`${BASE_URL}/agent-send-otp`, payload);
      
      setSuccessMessage('New OTP sent successfully!');
      setOtpTimer(30);
      setCanResendOTP(false);
    } catch (error) {
      setErrorMessage(error.response?.data?.detail || 'Failed to resend OTP');
      setShowError(true);
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!formData.otp || formData.otp.length !== 4) {
      setErrorMessage('Please enter a valid 4-digit OTP');
      setShowError(true);
      return;
    }
    
    try {
      // Verify OTP first
      const verifyPayload = {
        email: formData.email || null,
        mobile_number: formData.mobile_number || null,
        otp: formData.otp
      };
      
      await axios.post(`${BASE_URL}/agent-verify-otp`, verifyPayload);
      
      // Then register the agent
      const registrationPayload = {
        name: formData.name,
        email: formData.email || null,
        mobile_number: formData.mobile_number || null,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      };
      
      const response = await axios.post(`${BASE_URL}/agentregister`, registrationPayload);
      
      // Handle successful registration
      if (response.data.token) {
        localStorage.setItem('agentToken', response.data.token);
        setIsSuccess(true);
        setSuccessMessage('Registration successful! Redirecting to dashboard...');
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/agent-dashboard');
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage(
        error.response?.data?.detail || 
        error.response?.data?.message || 
        'Registration failed. Please try again.'
      );
      setShowError(true);
    }
  };

  const handleBackToStep1 = () => {
    setStep(1);
  };

  const handleSuccessClose = () => {
    setIsSuccess(false);
    onClose();
  };

  const handleErrorClose = () => {
    setShowError(false);
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
                  Agent Registration
                </h2>
                <div className='closeIcon-container' onClick={onClose}>
                  <Close className='close-icon'/>
                </div>
              </div>
              
              <div className='reg-form-container'>
                <form onSubmit={step === 1 ? handleSendOTP : handleVerifyOTP}>
                  {step === 1 ? (
                    <>
                      <div className='form-group'>
                        <input
                          type="text"
                          name="name"
                          placeholder='Full Name'
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="custom-input"
                        />
                      </div>
                      <div className='form-group'>
                        <input
                          type="email"
                          name="email"
                          placeholder='Email (optional if mobile provided)'
                          value={formData.email}
                          onChange={handleChange}
                          className="custom-input"
                        />
                      </div>
                      <div className='form-group'>
                        <input
                          type="text"
                          name="mobile_number"
                          placeholder='Mobile Number (optional if email provided)'
                          value={formData.mobile_number}
                          onChange={handleChange}
                          className="custom-input"
                        />
                      </div>
                      <div className='form-group'>
                        <input
                          type="password"
                          name="password"
                          placeholder='Password'
                          value={formData.password}
                          onChange={handleChange}
                          required
                          className="custom-input"
                        />
                      </div>
                      <div className='form-group'>
                        <input
                          type="password"
                          name="confirmPassword"
                          placeholder='Confirm Password'
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          className="custom-input"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className='otp-section'>
                        <p className='otp-info'>
                          OTP sent to {formData.email || formData.mobile_number}
                        </p>
                        <div className='form-group'>
                          <input
                            type="text"
                            name="otp"
                            placeholder='Enter OTP'
                            value={formData.otp}
                            onChange={handleChange}
                            maxLength={4}
                            required
                            className="custom-input"
                          />
                        </div>
                        <div className='otp-button-container'>
                          <button
                            type="button"
                            className='send-otp-button'
                            onClick={handleResendOTP}
                            disabled={!canResendOTP || isSendingOTP}
                          >
                            {isSendingOTP ? 'Sending...' : 
                             canResendOTP ? 'Resend OTP' : `Resend OTP (${otpTimer}s)`}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </form>
              </div>
              
              <div className='button-container'>
                {step === 2 && (
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
                  onClick={step === 1 ? handleSendOTP : handleVerifyOTP}
                >
                  {step === 1 ? 'Send OTP' : 'Register'}
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

export default AgentRegistration;