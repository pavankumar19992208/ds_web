import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import RegistrationPopup from './SchoolRegistration'; // Import the RegistrationPopup component

const LoginPopup = ({ onClose }) => {
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // Array to store each digit of the OTP
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false); // State to track registration popup visibility

  const handleOTPClick = () => {
    setShowOTP(!showOTP);
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const openRegistrationPopup = () => {
    setIsRegistrationOpen(true); // Open registration popup
  };

  const closeRegistrationPopup = () => {
    setIsRegistrationOpen(false); // Close registration popup
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <h2>Login</h2>
        <form>
          <div style={styles.formGroup}>
            <label>Email:</label>
            <input type="email" name="email" required />
          </div>
          {!showOTP && (
            <div style={styles.formGroup}>
              <label>Password:</label>
              <input type="password" name="password" required />
            </div>
          )}
          {showOTP && (
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
          <div style={styles.formGroup}>
            <Button
              type="button"
              style={styles.otpButton}
              onClick={handleOTPClick}
            >
              {showOTP ? 'Use Password' : 'Use OTP'}
            </Button>
          </div>
          <Button type="submit" variant="contained" color="primary">
            Login
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
        <div style={styles.signupText}>
          Don’t have an account?{' '}
          <span style={styles.signupLink} onClick={openRegistrationPopup}>
            Sign up for free
          </span>
        </div>
      </div>
      {isRegistrationOpen && <RegistrationPopup onClose={closeRegistrationPopup} />}
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
    width: '300px',
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
  signupText: {
    marginTop: '15px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#555',
  },
  signupLink: {
    color: '#007BFF',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
};

export default LoginPopup;