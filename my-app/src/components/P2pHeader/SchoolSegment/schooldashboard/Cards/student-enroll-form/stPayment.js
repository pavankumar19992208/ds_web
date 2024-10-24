// paymentForm.js
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

export default function PaymentForm({ formData, setFormData }) {
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      paymentInfo: {
        ...prevData.paymentInfo,
        [name]: value,
      },
    }));
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Payment Details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            required
            id="paymentMethod"
            name="paymentMethod"
            label="Select the way to pay amount"
            fullWidth
            value={formData.paymentInfo?.paymentMethod || ''}
            onChange={handleChange}
          >
            <MenuItem value="cash">Cash</MenuItem>
            <MenuItem value="upi">UPI</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="amount"
            name="amount"
            label="Amount"
            type="number"
            fullWidth
            value={formData.paymentInfo?.amount || ''}
            onChange={handleChange}
            disabled={formData.paymentInfo?.paymentMethod === 'upi'}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="referenceId"
            name="referenceId"
            label="Reference ID"
            fullWidth
            value={formData.paymentInfo?.referenceId || ''}
            onChange={handleChange}
            disabled={formData.paymentInfo?.paymentMethod === 'cash'}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}