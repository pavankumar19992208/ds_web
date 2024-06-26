import React from 'react';
import './LoginPopup.css'; // Assuming you will create this CSS file


const LoginPopup = ({ onClose }) => {
  return (
<div className="loginPopup">
  <div className="loginPopupContainer">
    <div className='widget-container'>
    <div className="loginHeader">
      <h2 style={{marginLeft:'10%'}}>ADMINISTRATION  LOGIN</h2>
      <button onClick={onClose} className="closeButton widget-align-right">X</button>
    </div>
    <div className="loginBody">
      <div className="inputGroup inputIcon">
        <h4 className='space widget-align-left'>USER ID</h4>
        <i className="fas fa-user widget-align-left"></i>
        <input type="text" placeholder="" />
      </div>
      <div className="inputGroup inputIcon">
        <h4 className='space widget-align-left'>PASSWORD</h4>
        <i className="fas fa-lock widget-align-left"></i>
        <input type="password" placeholder="" />
      </div>
      <div class="button-grid">
      <button className="forgotPassword widget-align-left" >forgot password</button>
      <button className="loginButton widget-align-right">LOGIN</button>
      </div>
    </div>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
  </div>
</div> 
</div>
  );
};

export default LoginPopup;