import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  typography: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    color: "#3f51b5",
    fontSize: '1rem',
  },
  textField: {
    marginLeft: theme.spacing(2),
    width: '92%',
  },
}));

export default function PaymentForm({ formData, setFormData }) {
  const classes = useStyles();

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
            value={formData.paymentInfo?.PaymentMethod || ''}
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
            disabled={formData.paymentInfo?.paymentMethod === 'upi' || formData.paymentInfo?.paymentMethod === 'bankTransfer'}
            className={classes.textField}
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
            disabled={formData.paymentInfo?.paymentMethod === 'upi' || formData.paymentInfo?.paymentMethod === 'cash'}
            className={classes.textField}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}