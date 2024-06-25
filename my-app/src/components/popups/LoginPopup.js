import React from 'react';
import './LoginPopup.css'; // Assuming you will create this CSS file


const LoginPopup = ({ onClose }) => {
  return (
    /*<div className="loginPopup">
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
    </div>*/

<div className="loginPopup">
  <div className="loginPopupContainer">
    <div className="loginHeader">
      <h2>ADMINISTRATION  LOGIN</h2>
      <button onClick={onClose} className="closeButton">X</button>
    </div>
    <div className="loginBody">
      <div className="inputGroup inputIcon">
        <h4 className='space'>USER ID</h4>
        <i className="fas fa-user "></i>
        <input type="text" placeholder="" />
      </div>
      <div className="inputGroup inputIcon">
        <h4 className='space'>PASSWORD</h4>
        <i className="fas fa-lock"></i>
        <input type="password" placeholder="" />
      </div>
      <div class="button-grid">
      <button className="forgotPassword">forgot password</button>
      <button className="loginButton">LOGIN</button>
      </div>
    </div>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
  </div>
</div> 
  );
};

export default LoginPopup;