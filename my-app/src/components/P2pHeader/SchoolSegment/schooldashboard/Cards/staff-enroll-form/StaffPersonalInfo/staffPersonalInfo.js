import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export default function StaffPersonalInfo() {
  const [currentAddress, setCurrentAddress] = useState({
    line1: '',
    line2: '',
    city: '',
    district: '',
    state: '',
    pinCode: '',
  });

  const [permanentAddress, setPermanentAddress] = useState({
    line1: '',
    line2: '',
    city: '',
    district: '',
    state: '',
    pinCode: '',
  });

  const [sameAsCurrent, setSameAsCurrent] = useState(false);

  const handleCurrentAddressChange = (e) => {
    const { name, value } = e.target;
    setCurrentAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePermanentAddressChange = (e) => {
    const { name, value } = e.target;
    setPermanentAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    setSameAsCurrent(e.target.checked);
    if (e.target.checked) {
      setPermanentAddress(currentAddress);
    } else {
      setPermanentAddress({
        line1: '',
        line2: '',
        city: '',
        district: '',
        state: '',
        pinCode: '',
      });
    }
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Personal details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            id="fullName"
            name="fullName"
            label="Full Name"
            fullWidth
            autoComplete="name"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="dob"
            name="dob"
            label="Date of Birth"
            type="date"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="gender"
            name="gender"
            label="Gender"
            select
            fullWidth
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="contactNumber"
            name="contactNumber"
            label="Contact Number"
            fullWidth
            autoComplete="tel"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="email"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            autoComplete="email"
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Current Address
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="currentAddressLine1"
            name="line1"
            label="Address Line 1"
            fullWidth
            value={currentAddress.line1}
            onChange={handleCurrentAddressChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="currentAddressLine2"
            name="line2"
            label="Address Line 2"
            fullWidth
            value={currentAddress.line2}
            onChange={handleCurrentAddressChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="currentCity"
            name="city"
            label="City"
            fullWidth
            value={currentAddress.city}
            onChange={handleCurrentAddressChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="currentDistrict"
            name="district"
            label="District"
            fullWidth
            value={currentAddress.district}
            onChange={handleCurrentAddressChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="currentState"
            name="state"
            label="State"
            fullWidth
            value={currentAddress.state}
            onChange={handleCurrentAddressChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="currentPinCode"
            name="pinCode"
            label="Pin Code"
            fullWidth
            value={currentAddress.pinCode}
            onChange={handleCurrentAddressChange}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={sameAsCurrent}
                onChange={handleCheckboxChange}
                color="primary"
              />
            }
            label="Same as Current Address"
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Permanent Address
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="permanentAddressLine1"
            name="line1"
            label="Address Line 1"
            fullWidth
            value={permanentAddress.line1}
            onChange={handlePermanentAddressChange}
            disabled={sameAsCurrent}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="permanentAddressLine2"
            name="line2"
            label="Address Line 2"
            fullWidth
            value={permanentAddress.line2}
            onChange={handlePermanentAddressChange}
            disabled={sameAsCurrent}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="permanentCity"
            name="city"
            label="City"
            fullWidth
            value={permanentAddress.city}
            onChange={handlePermanentAddressChange}
            disabled={sameAsCurrent}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="permanentDistrict"
            name="district"
            label="District"
            fullWidth
            value={permanentAddress.district}
            onChange={handlePermanentAddressChange}
            disabled={sameAsCurrent}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="permanentState"
            name="state"
            label="State"
            fullWidth
            value={permanentAddress.state}
            onChange={handlePermanentAddressChange}
            disabled={sameAsCurrent}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="permanentPinCode"
            name="pinCode"
            label="Pin Code"
            fullWidth
            value={permanentAddress.pinCode}
            onChange={handlePermanentAddressChange}
            disabled={sameAsCurrent}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}