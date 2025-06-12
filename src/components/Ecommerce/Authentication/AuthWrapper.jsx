import React, { useState } from 'react';
import LoginPopup from './UserLogin';
import RegistrationPopup from './UserRegistration';

const AuthWrapper = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <>
      {isLogin ? (
        <LoginPopup onClose={onClose} toggleAuthMode={toggleAuthMode} />
      ) : (
        <RegistrationPopup onClose={onClose} toggleAuthMode={toggleAuthMode} />
      )}
    </>
  );
};

export default AuthWrapper;