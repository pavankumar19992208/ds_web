import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';
import './staffPersonalInfo.css';

const useStyles = makeStyles((theme) => ({
  fieldMargin: {
    marginLeft: theme.spacing(2), // Add left margin to all fields
    marginRight: theme.spacing(2), // Add right margin to all fields
    width: '92%', // Set the width of all fields to 92%
  },
}));

export default function StaffPersonalInfo({ formData, setFormData }) {
  const [sameAsCurrent, setSameAsCurrent] = useState(false);
  const [errors, setErrors] = useState({});
  const classes = useStyles();

  const validateField = (name, value) => {
    let error = '';
    if (['fullName', 'city', 'district', 'state'].includes(name)) {
      if (!/^[a-zA-Z\s]+$/.test(value)) {
        error = 'Only alphabets are allowed';
      }
    } else if (['pinCode', 'contactNumber'].includes(name)) {
      if (!/^\d+$/.test(value)) {
        error = 'Only numbers are allowed';
      }
    }
    return error;
  };

  const handleInputChange = (e, fieldType, addressType = null) => {
    const { name, value } = e.target;
    let error = validateField(name, value);
  
    // Show error if the field is empty
    if (!value) {
      error = 'This field is required';
    }
  
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  
    if (fieldType === 'personalInfo') {
      setFormData((prev) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          [name]: value,
        },
      }));
    } else if (fieldType === 'address' && addressType) {
      setFormData((prev) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          [addressType]: {
            ...prev.personalInfo[addressType],
            [name]: value,
          },
        },
      }));
    }
  };

  const handleCheckboxChange = (e) => {
    setSameAsCurrent(e.target.checked);
    if (e.target.checked) {
      setFormData((prev) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          permanentAddress: prev.personalInfo.currentAddress,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          permanentAddress: {
            line1: '',
            line2: '',
            city: '',
            district: '',
            state: '',
            pinCode: '',
          },
        },
      }));
    }
  };

  return (
    <React.Fragment>
      <Typography variant="h6"  className='heading' style={{marginBottom:'26px', marginTop:'12px'}}>
        Personal details :
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
            value={formData.personalInfo.fullName}
            onChange={(e) => handleInputChange(e, 'personalInfo')}
            error={!!errors.fullName}
            helperText={errors.fullName}
            className={`${classes.fieldMargin} heading`}
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
            className={`${classes.fieldMargin} heading`}
            InputLabelProps={{
              shrink: true,
            }}
            value={formData.personalInfo.dob}
            onChange={(e) => handleInputChange(e, 'personalInfo')}
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
            className={`${classes.fieldMargin} heading`}
            value={formData.personalInfo.gender}
            onChange={(e) => handleInputChange(e, 'personalInfo')}
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
            className={`${classes.fieldMargin} heading`}
            autoComplete="tel"
            value={formData.personalInfo.contactNumber}
            onChange={(e) => handleInputChange(e, 'personalInfo')}
            error={!!errors.contactNumber}
            helperText={errors.contactNumber}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="email"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            className={`${classes.fieldMargin} heading`}
            autoComplete="email"
            value={formData.personalInfo.email}
            onChange={(e) => handleInputChange(e, 'personalInfo')}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6"  className='heading' style={{marginBottom:'0px', marginTop:'12px'}}>
            Current Address :
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="currentAddressLine1"
            name="line1"
            label="Address Line 1"
            fullWidth
            className={`${classes.fieldMargin} heading`}
            value={formData.personalInfo.currentAddress.line1}
            onChange={(e) => handleInputChange(e, 'address', 'currentAddress')}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="currentAddressLine2"
            name="line2"
            label="Address Line 2"
            fullWidth
            className={`${classes.fieldMargin} heading`}
            value={formData.personalInfo.currentAddress.line2}
            onChange={(e) => handleInputChange(e, 'address', 'currentAddress')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="currentCity"
            name="city"
            label="City"
            fullWidth
            className={`${classes.fieldMargin} heading`}
            value={formData.personalInfo.currentAddress.city}
            onChange={(e) => handleInputChange(e, 'address', 'currentAddress')}
            error={!!errors.city}
            helperText={errors.city}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="currentDistrict"
            name="district"
            label="District"
            fullWidth
            className={`${classes.fieldMargin} heading`}
            value={formData.personalInfo.currentAddress.district}
            onChange={(e) => handleInputChange(e, 'address', 'currentAddress')}
            error={!!errors.district}
            helperText={errors.district}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="currentState"
            name="state"
            label="State"
            fullWidth
            className={`${classes.fieldMargin} heading`}
            value={formData.personalInfo.currentAddress.state}
            onChange={(e) => handleInputChange(e, 'address', 'currentAddress')}
            error={!!errors.state}
            helperText={errors.state}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="currentPinCode"
            name="pinCode"
            label="Pin Code"
            fullWidth
            className={`${classes.fieldMargin} heading`}
            value={formData.personalInfo.currentAddress.pinCode}
            onChange={(e) => handleInputChange(e, 'address', 'currentAddress')}
            error={!!errors.pinCode}
            helperText={errors.pinCode}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={sameAsCurrent}
                onChange={handleCheckboxChange}
                color="primary"
                className= 'heading'
                />
            }
            label="Same as Current Address"
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" className='heading' style={{ marginTop:'12px'}}>
            Permanent Address :
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="permanentAddressLine1"
            name="line1"
            label="Address Line 1"
            fullWidth
            className={`${classes.fieldMargin} heading`}
            value={formData.personalInfo.permanentAddress.line1}
            onChange={(e) => handleInputChange(e, 'address', 'permanentAddress')}
            disabled={sameAsCurrent}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="permanentAddressLine2"
            name="line2"
            label="Address Line 2"
            fullWidth
            className={`${classes.fieldMargin} heading`}
            value={formData.personalInfo.permanentAddress.line2}
            onChange={(e) => handleInputChange(e, 'address', 'permanentAddress')}
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
            className={`${classes.fieldMargin} heading`}
            value={formData.personalInfo.permanentAddress.city}
            onChange={(e) => handleInputChange(e, 'address', 'permanentAddress')}
            disabled={sameAsCurrent}
            error={!!errors.city}
            helperText={errors.city}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="permanentDistrict"
            name="district"
            label="District"
            fullWidth
            className={`${classes.fieldMargin} heading`}
            value={formData.personalInfo.permanentAddress.district}
            onChange={(e) => handleInputChange(e, 'address', 'permanentAddress')}
            disabled={sameAsCurrent}
            error={!!errors.district}
            helperText={errors.district}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="permanentState"
            name="state"
            label="State"
            fullWidth
            className={`${classes.fieldMargin} heading`}
            value={formData.personalInfo.permanentAddress.state}
            onChange={(e) => handleInputChange(e, 'address', 'permanentAddress')}
            disabled={sameAsCurrent}
            error={!!errors.state}
            helperText={errors.state}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="permanentPinCode"
            name="pinCode"
            label="Pin Code"
            fullWidth
            className={`${classes.fieldMargin} heading`}
            value={formData.personalInfo.permanentAddress.pinCode}
            onChange={(e) => handleInputChange(e, 'address', 'permanentAddress')}
            disabled={sameAsCurrent}
            error={!!errors.pinCode}
            helperText={errors.pinCode}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}