import React, { useState } from 'react';
import axios from 'axios';
import BASE_URL from '../../config';
import SuccessPopup from './successPopup'; // Import the SuccessPopup component
import ErrorPopup from './errorPopup'; // Import the ErrorPopup component
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const AuthPopup = ({ onClose }) => {
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
          <>
            <h2>{isLogin ? 'Login' : 'School Registration'}</h2>
            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <>
                  <div style={styles.formGroup}>
                    <label>School Name</label>
                    <input
                      type="text"
                      name="school_name"
                      value={formData.school_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label>Syllabus Type</label>
                    <input
                      type="text"
                      name="syllabus_type"
                      value={formData.syllabus_type}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label>Admin Head Name</label>
                    <input
                      type="text"
                      name="admin_name"
                      value={formData.admin_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label>Mobile Number</label>
                    <input
                      type="text"
                      name="mobile_number"
                      value={formData.mobile_number}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label>Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </>
              )}
              {isLogin && !useMobileLogin && (
                <div style={styles.formGroup}>
                  <label>School ID:</label>
                  <input
                    type="text"
                    name="schoolId"
                    value={formData.schoolId}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
              {isLogin && useMobileLogin && (
                <div style={styles.formGroup}>
                  <label>Mobile Number:</label>
                  <input
                    type="text"
                    name="mobile_number"
                    value={formData.mobile_number}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
              {!showOTP && (
                <div style={styles.formGroup}>
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
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
                      variant="outlined"
                      required
                    />
                  ))}
                </div>
              )}
              {isLogin && (
                <>
                  <div style={styles.formGroup}>
                    <Button
                      type="button"
                      style={styles.otpButton}
                      onClick={handleOTPClick}
                    >
                      {showOTP ? 'Use Password' : 'Use OTP'}
                    </Button>
                  </div>
                  <div style={styles.formGroup}>
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
              <Button type="submit" variant="contained" color="primary">
                {isLogin ? 'Login' : 'Register'}
              </Button>
              <Button
                type="button"
                onClick={onClose}
                variant="contained"
                color="secondary"
                style={{ marginLeft: '10px' }}
              >
                Close
              </Button>
            </form>
            <div style={styles.authToggleText}>
              {isLogin ? 'Don’t have an account? ' : 'Already have an account? '}
              <span style={styles.authToggleLink} onClick={toggleAuthMode}>
                {isLogin ? 'Sign up for free' : 'Login'}
              </span>
            </div>
          </>
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
    padding: '20px',
    borderRadius: '10px',
    width: '400px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  otpContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
  },
  otpButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#007BFF',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  authToggleText: {
    marginTop: '15px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#555',
  },
  authToggleLink: {
    color: '#007BFF',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
};

export default AuthPopup;