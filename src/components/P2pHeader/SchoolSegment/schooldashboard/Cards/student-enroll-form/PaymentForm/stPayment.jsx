import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  typography: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    color: "#3f51b5",
    fontSize: '1rem',
    fontFamily: '"Urbanist", sans-serif',
    fontOpticalSizing: 'auto',
    fontWeight: 500 ,
  },
  textField: {
    marginLeft: theme.spacing(2),
    width: '92%',
    fontFamily: '"Urbanist", sans-serif',
    fontOpticalSizing: 'auto',
    fontWeight: 500 ,
  },
}));

const validateNumbers = (value) => /^[0-9]+$/.test(value);

export default function StudentPaymentForm({ formData, setFormData }) {
  const classes = useStyles();
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    let isValid = true;

    if (name === 'Amount') {
      isValid = validateNumbers(value) || value === '';
    }

    if (isValid) {
      setFormData((prevData) => ({
        ...prevData,
        paymentInfo: {
          ...prevData.paymentInfo,
          [name]: value,
        },
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: 'Invalid number input',
      }));
    }
  };

  const paymentMethod = formData.paymentInfo?.PaymentMethod;

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom className={classes.typography}>
        Payment Details :
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
            value={paymentMethod || ''}
            onChange={handleChange}
            className={classes.textField}
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
            disabled={paymentMethod === 'upi' || paymentMethod === 'bankTransfer'}
            className={classes.textField}
            error={!!errors.Amount}
            helperText={errors.Amount}
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
            disabled={paymentMethod === 'cash' || paymentMethod === 'bankTransfer'}
            className={classes.textField}
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
            disabled={paymentMethod === 'upi' || paymentMethod === 'cash'}
            className={classes.textField}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}