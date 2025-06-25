import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AgentLogin.css';

const AgentLogin = ({ onLogin, onRegister }) => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Example validation
    if (!mobile.match(/^[6-9]\d{9}$/)) {
      setError('Enter a valid 10-digit mobile number.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    // Replace with your API call
    try {
      // Example: const res = await fetch(...);
      // Simulate login success
      if (mobile === '9876543210' && password === 'password') {
        if (onLogin) onLogin();
      } else {
        setError('Invalid mobile number or password.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    if (onRegister) onRegister();
  };

  return (
    <div className="agent-login-page">
      <form className="agent-login-form" onSubmit={handleSubmit}>
        <h2>Agent Login</h2>
        {error && <div className="agt-login-error">{error}</div>}
        <div className="agt-form-group">
          <label>Mobile Number</label>
          <div className="agt-input-line">
            <input
              type="tel"
              value={mobile}
              onChange={e => setMobile(e.target.value)}
              placeholder="Enter mobile number"
              maxLength={10}
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
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              className="agt-line-input"
            />
            <span className="agt-line"></span>
          </div>
        </div>
        <button type="submit" className="agt-login-btn">Login</button>
        
        <div className="agt-register-section">
          <span style={{color:'#fff'}}>Don't have an account?</span>
          <button 
            className="agt-register-btn" 
            onClick={() => {navigate('/agent-registration')}}
          >
            Register Now
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgentLogin;