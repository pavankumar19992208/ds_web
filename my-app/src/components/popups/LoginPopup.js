import React from 'react';
import './LoginPopup.css'; // Assuming you will create this CSS file


const LoginPopup = ({ onClose }) => {
  return (
    <div className="loginPopup">
      <div className="loginPopupContainer">
        <div className="loginHeader">
          <h2>ADMINISTRATION LOGIN</h2>
          <button onClick={onClose} className="closeButton">X</button>
        </div>
        <div className="loginBody">
          <div className="inputGroup">
            <label>USER ID</label>
            <input type="text" placeholder="XXXXXXXXXX" />
          </div>
          <div className="inputGroup">
            <label>PASSWORD</label>
            <input type="password" placeholder="XXXXXXXXXX" />
          </div>
          <button className="loginButton">LOGIN</button>
          <button className="forgotPassword">forgot password</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;