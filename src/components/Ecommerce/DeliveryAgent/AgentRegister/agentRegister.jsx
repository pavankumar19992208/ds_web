import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './agentRegister.css';

const AgentRegistration = ({ onRegister, onLoginRedirect }) => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });
  const [step, setStep] = useState(1); // 1: initial form, 2: OTP verification
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name) {
      setError('Name is required');
      return false;
    }
    if (!formData.mobile.match(/^[6-9]\d{9}$/)) {
      setError('Enter a valid 10-digit mobile number');
      return false;
    }
    if (!formData.email.match(/^\S+@\S+\.\S+$/)) {
      setError('Enter a valid email address');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Call backend to send OTP
      const response = await axios.post('http://localhost:8000/agent-send-otp', {
        mobile_number: formData.mobile,
        email: formData.email
      });

      setOtpSent(true);
      setTimer(30);
      setStep(2);
      setSuccess('OTP sent successfully!');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0) return;
    
    setIsLoading(true);
    try {
      // Call backend to resend OTP
      await axios.post('http://localhost:8000/agent-send-otp', {
        mobile_number: formData.mobile,
        email: formData.email
      });

      setTimer(30);
      setSuccess('OTP resent successfully!');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.otp || formData.otp.length !== 4) {
      setError('Please enter a valid 4-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      // Verify OTP with backend
      const verifyResponse = await axios.post('http://localhost:8000/agent-verify-otp', {
        mobile_number: formData.mobile,
        email: formData.email,
        otp: formData.otp
      });

      if (verifyResponse.data.verified) {
        // If OTP verification succeeds, proceed with registration
        await handleRegister();
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    const registrationPayload = {
      name: formData.name,
      mobile_number: formData.mobile,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.password
    };

    // Print registration payload to console
    console.log('Registration Payload:', registrationPayload);
    try {
      // Submit registration data to backend
      const response = await axios.post('http://localhost:8000/agentregister', {
        name: formData.name,
        mobile_number: formData.mobile,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.password
      });

      // Store the token and agent data
      localStorage.setItem('agentToken', response.data.token);
      localStorage.setItem('agentData', JSON.stringify({
        id: response.data.agent_id,
        name: response.data.name,
        email: response.data.email,
        mobile_number: response.data.mobile_number
      }));

      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => {
        navigate('/agent-dashboard');
        if (onRegister) onRegister();
      });
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="agent-registration-page">
      <form className="agent-registration-form" onSubmit={step === 1 ? handleSendOtp : handleVerifyOtp}>
        <h2>Agent Registration</h2>
        
        {error && <div className="agt-error">{error}</div>}
        {success && <div className="agt-success">{success}</div>}

        {step === 1 ? (
          <>
            <div className="agt-form-group">
              <label>Full Name</label>
              <div className="agt-input-line">
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                  className="agt-line-input"
                />
                <span className="agt-line"></span>
              </div>
            </div>
            <div className="agt-form-group">
              <label>Mobile Number</label>
              <div className="agt-input-line">
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                  maxLength={10}
                  required
                  className="agt-line-input"
                />
                <span className="agt-line"></span>
              </div>
            </div>

            <div className="agt-form-group">
              <label>Email</label>
              <div className="agt-input-line">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  required
                  className="agt-line-input"
                />
                <span className="agt-line"></span>
              </div>
            </div>

            <div className="agt-form-group">
              <label>Password</label>
              <div className="agt-input-line">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                  className="agt-line-input"
                />
                <span className="agt-line"></span>
              </div>
            </div>

            <div className="agt-form-group">
              <label>Confirm Password</label>
              <div className="agt-input-line">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  required
                  className="agt-line-input"
                />
                <span className="agt-line"></span>
              </div>
            </div>

            <button 
              type="submit" 
              className="agt-btn agt-send-otp-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send OTP'}
            </button>
          </>
        ) : (
          <>
            <div className="agt-otp-info">
              OTP sent to {formData.mobile} and {formData.email}
              <p>Use OTP: <strong>1234</strong> for testing</p>
            </div>

            <div className="agt-form-group">
              <label>Enter OTP</label>
              <div className="agt-input-line">
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="Enter 4-digit OTP"
                  maxLength={4}
                  required
                  className="agt-line-input"
                />
                <span className="agt-line"></span>
              </div>
            </div>

            <div className="agt-otp-actions">
              <button 
                type="submit" 
                className="agt-btn agt-verify-otp-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <button 
                type="button" 
                className="agt-btn agt-resend-otp-btn"
                onClick={handleResendOtp}
                disabled={timer > 0 || isLoading}
              >
                Resend OTP {timer > 0 ? `(${timer}s)` : ''}
              </button>
            </div>
          </>
        )}

        <div className="agt-login-redirect">
          Already have an account? 
          <button 
            type="button" 
            className="agt-login-link" 
            onClick={() => {navigate('/agent-login')}}
          >
            Login Now
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgentRegistration;