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
            id="PaymentMethod"
            name="PaymentMethod"
            label="Payment Mode"
            fullWidth
            value={formData.paymentInfo?.PaymentMethod || ''}
            onChange={handleChange}
          >
            <MenuItem value="bankTransfer">Bank Transfer</MenuItem>
            <MenuItem value="cash">Cash</MenuItem>
            <MenuItem value="upi">UPI</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="Amount"
            name="Amount"
            label="Amount"
            type="number"
            fullWidth
            value={formData.paymentInfo?.Amount || ''}
            onChange={handleChange}
            disabled={formData.paymentInfo?.paymentMethod === 'upi' || formData.paymentInfo?.paymentMethod === 'bankTransfer'}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="TransactionId"
            name="TransactionId"
            label="Transaction ID"
            fullWidth
            value={formData.paymentInfo?.TransactionId || ''}
            onChange={handleChange}
            disabled={formData.paymentInfo?.paymentMethod === 'cash' || formData.paymentInfo?.paymentMethod === 'bankTransfer'}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="BankTransfer"
            name="BankTransfer"
            label="Reference ID"
            fullWidth
            value={formData.paymentInfo?.BankTransfer || ''}
            onChange={handleChange}
            disabled={formData.paymentInfo?.paymentMethod === 'upi' || formData.paymentInfo?.paymentMethod === 'cash'}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}