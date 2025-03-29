import React from 'react';

const SuccessPopup = ({ message, onClose }) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <h3>Success!</h3>
        <p>{message}</p>
        <button onClick={onClose}>OK</button>
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
    zIndex: 1000, // Ensure it appears above other content
  },
  popup: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    width: '300px',
    textAlign: 'center',
  },
};

export default SuccessPopup;