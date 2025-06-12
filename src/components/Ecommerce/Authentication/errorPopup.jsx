import React from 'react';
import Button from '@mui/material/Button';

const ErrorPopup = ({ message, onClose }) => {
  return (
    <div style={styles.errorPopup}>
      <h3>Error</h3>
      <p>{message}</p>
      <Button variant="contained" color="secondary" onClick={onClose}>
        Close
      </Button>
    </div>
  );
};

const styles = {
  errorPopup: {
    textAlign: 'center',
  },
};

export default ErrorPopup;