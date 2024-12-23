import React, { useState } from 'react';
import { IoIosArrowDropleft } from 'react-icons/io';
import './academicYear.css';

const AcademicYear = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  const toggleContainer = () => {
    setIsOpen(!isOpen);
  };

  const handleSendOtp = () => {
    // Logic to send OTP to the mobile number
    setIsOtpSent(true);
  };

  const handleConfirmOtp = () => {
    // Logic to confirm OTP and start new academic year
    alert('New academic year started!');
  };
  
  return (
    <div className={`academic-year ${isOpen ? 'open' : ''}`}>
      <IoIosArrowDropleft className="icon" onClick={toggleContainer} />
      <div className="container">
        <p>Start New Academic Year 🎉</p>
        <input
          type="text"
          placeholder="Enter mobile number"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
        />
        <button onClick={handleSendOtp}>
          {isOtpSent ? 'Resend OTP' : 'Send OTP'}
        </button>
        {isOtpSent && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={handleConfirmOtp}>Confirm OTP</button>
          </>
        )}
      </div>
    </div>
  );
};

export default AcademicYear;