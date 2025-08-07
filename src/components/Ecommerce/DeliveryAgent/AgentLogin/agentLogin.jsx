import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './AgentLogin.css';
import BaseUrl from '../../../../config';
import axios from 'axios';
import { GlobalStateContext } from '../../GlobalState';

const AgentLogin = ({ onLogin, onRegister }) => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
const { loginAgent } = useContext(GlobalStateContext);

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

    try {
      const response = await axios.post(`${BaseUrl}/agentlogin`, {
        mobile_number: mobile,
        password: password,
      });

      const data = response.data;
      // Save token and agent data to localStorage
      localStorage.setItem('agentToken', data.token);
      localStorage.setItem('agentData', JSON.stringify(data.agent));
      loginAgent(data.agent); 
      navigate('/agent-dashboard');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Login failed. Please try again.');
      }
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
          <span style={{ color: '#fff' }}>Don't have an account?</span>
          <button
            className="agt-register-btn"
            onClick={() => { navigate('/agent-registration') }}
          >
            Register Now
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgentLogin;