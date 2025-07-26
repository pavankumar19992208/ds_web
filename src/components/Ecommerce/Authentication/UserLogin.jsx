import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../../config';
import ErrorPopup from './errorPopup';
import TextField from '@mui/material/TextField';
import { Close } from '@mui/icons-material';
import { GlobalStateContext } from '../GlobalState';
import './UserRegistration.css';
import logo from '../../../images/logo2.png';

const LoginPopup = ({ onClose, toggleAuthMode }) => {
  const navigate = useNavigate();
  const { loginUser } = useContext(GlobalStateContext);

  const [loginData, setLoginData] = useState({
    email: '',
    mobile_number: '',
    password: '',
  });

  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResendOTP, setCanResendOTP] = useState(true);
  const [useMobileLogin, setUseMobileLogin] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);

  // OTP timer countdown effect
  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResendOTP(true);
    }
  }, [otpTimer]);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;
      if (showOTP) {
        const otpString = otp.join('');
        const payload = useMobileLogin
          ? { mobile_number: loginData.mobile_number, otp: otpString }
          : { email: loginData.email, otp: otpString };

        response = await axios.post(`${BASE_URL}/verify-otp-login`, payload);
      } else {
        const payload = useMobileLogin
          ? { mobile_number: loginData.mobile_number, password: loginData.password }
          : { email: loginData.email, password: loginData.password };

        response = await axios.post(`${BASE_URL}/login`, payload);
      }

      console.log('Full response:', response); // Debug the complete response

      // Verify response structure - now checking for both token and user
      if (!response.data?.token || !response.data?.user) {
        console.error('Invalid response structure:', response.data);
        throw new Error('Invalid response structure from server');
      }

      // Store token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Update global state
      loginUser(response.data.user);

      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

      onClose();
      navigate('/ecommerce-dashboard');

    } catch (error) {
      console.error('Login error details:', {
        error: error,
        response: error.response,
        message: error.message
      });

      setErrorMessage(
        error.response?.data?.message ||
        error.response?.data?.detail ||
        error.message ||
        'Login failed. Please try again.'
      );
      setShowError(true);

      // Clear any partial auth state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const handleOTPClick = () => {
    setShowOTP(!showOTP);
    setOtp(['', '', '', '']);
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const toggleMobileLogin = () => {
    setUseMobileLogin(!useMobileLogin);
    setLoginData({
      ...loginData,
      email: useMobileLogin ? loginData.email : '',
      mobile_number: useMobileLogin ? '' : loginData.mobile_number
    });
  };

  const handleSendOTP = async () => {
    if ((!loginData.mobile_number && !loginData.email) || !canResendOTP) return;

    setIsSendingOTP(true);
    try {
      const payload = useMobileLogin
        ? { mobile_number: loginData.mobile_number }
        : { email: loginData.email };

      await axios.post(`${BASE_URL}/send-otp`, payload);

      setOtpTimer(30);
      setCanResendOTP(false);
    } catch (error) {
      const errorMsg = error.response?.data?.message ||
        error.response?.data?.detail ||
        'Failed to send OTP. Please try again.';
      setErrorMessage(errorMsg);
      setShowError(true);
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleErrorClose = () => {
    setShowError(false);
  };

  return (
    <div className='overlay'>
      <div className='popup'>
        {showError ? (
          <ErrorPopup
            message={errorMessage}
            onClose={handleErrorClose}
          />
        ) : (
          <div className='two-column-layout'>
            <div className='ec-left-column'>
              {/* <h1 className='neuralife-text'>Cartsy</h1> */}
              <div className='logo-container'>
                <img
                  src={logo}
                  alt="Company Logo"
                  className='logo'
                />
              </div>
            </div>

            <div className='ec-right-column'>
              <div className='header-container'>
                <h2 className='auth-title'>Sign In</h2>
                <div className='closeIcon-container' onClick={onClose}>
                  <Close className='close-icon' />
                </div>
              </div>

              <div className='reg-form-container'>
                <form onSubmit={handleLoginSubmit}>
                  <div className='form-group'>
                    {useMobileLogin ? (
                      <TextField
                        variant="standard"
                        label="Mobile Number"
                        id="mobile-number"
                        type="text"
                        name="mobile_number"

                        value={loginData.mobile_number}
                        onChange={handleLoginChange}
                        required

                      />
                    ) : (
                      <TextField
                        variant="standard"
                        label="Email"
                        id="email"
                        type="email"
                        name="email"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        required

                      />
                    )}
                  </div>

                  {!showOTP && (
                    <div className='form-group'>
                      <TextField
                        variant="standard"
                        label="Password"
                        id="password"
                        type="password"
                        name="password"

                        value={loginData.password}
                        onChange={handleLoginChange}
                        required

                      />
                    </div>
                  )}

                  {showOTP && (
                    <div className='otp-section'>
                      <div className='otp-container'>
                        {otp.map((digit, index) => (
                          <TextField
                            key={index}
                            value={digit}
                            onChange={(e) => handleOtpChange(e.target.value, index)}
                            inputProps={{
                              maxLength: 1,
                              style: { textAlign: 'center', color: '#333' },
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  borderColor: '#333',
                                  borderWidth: 2,
                                },
                                '&:hover fieldset': {
                                  borderColor: '#1d3557',
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
                  )}

                  <div className='btn-group'>
                    <button
                      type="button"
                      className='otp-button'
                      onClick={handleOTPClick}
                    >
                      {showOTP ? 'Use Password' : 'Sign In with OTP'}
                    </button>
                  </div>

                  <div className='btn-group'>
                    <button
                      type="button"
                      className='otp-button'
                      onClick={toggleMobileLogin}
                    >
                      {useMobileLogin ? 'Sign In with Email' : 'Sign In with Mobile'}
                    </button>
                  </div>
                </form>
              </div>

              <div className='button-container'>
                <button
                  type="submit"
                  className='reg-lgn-btn'
                  onClick={handleLoginSubmit}
                >
                  Sign In
                </button>
              </div>

              <div className='auth-toggle-text'>
                Don't have an account?
                <span className='auth-toggle-link' onClick={toggleAuthMode}>
                  Sign up for free
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPopup;