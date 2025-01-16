import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  personalTitle: {
    color: '#3f51b5',
    fontSize: '1rem',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
    fontFamily: '"Urbanist", sans-serif',
    fontOpticalSizing: 'auto',
    fontWeight: 500 ,
  },
  contactTitle: {
    color: '#3f51b5',
    fontSize: '1rem',
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(1),
    fontFamily: '"Urbanist", sans-serif',
    fontOpticalSizing: 'auto',
    fontWeight: 500 ,
  },
  addressTitle: {
    color: '#3f51b5',
    fontSize: '1rem',
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(1),
    fontFamily: '"Urbanist", sans-serif',
    fontOpticalSizing: 'auto',
    fontWeight: 500 ,
  },
  formControlLabel: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(4),
  },
  textField: {
    fontFamily: '"Urbanist", sans-serif',
    fontOpticalSizing: 'auto',
    fontWeight: 500 ,
    marginLeft: theme.spacing(3),
    width: '91%',
  },

  addressField: {
    fontFamily: '"Urbanist", sans-serif',
    fontOpticalSizing: 'auto',
    fontWeight: 500 ,
    marginLeft: theme.spacing(3),
    width: '95%',
  },
}));

const validateAlphabets = (value) => /^[A-Za-z\s]*$/.test(value);
const validateNumbers = (value) => /^[0-9]{0,10}$/.test(value);
const validateOtherQualification = (value) => /^[A-Za-z\s.,-]*$/.test(value);
const validateEmail = (value) => value.endsWith('@gmail.com');

export default function GuardianInfoForm({ formData, setFormData }) {
  const classes = useStyles();
  const [currentAddress, setCurrentAddress] = useState(formData.guardianInfo.currentAddress || {
    line1: '',
    line2: '',
    city: '',
    district: '',
    state: '',
    pincode: ''
  });
  const [permanentAddress, setPermanentAddress] = useState(formData.guardianInfo.permanentAddress || {
    line1: '',
    line2: '',
    city: '',
    district: '',
    state: '',
    pincode: ''
  });
  const [sameAddress, setSameAddress] = useState(formData.guardianInfo.sameAddress || false);
  const [errors, setErrors] = useState({});
  const [otherQualification, setOtherQualification] = useState(formData.guardianInfo.otherQualification || '');

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      guardianInfo: {
        ...prevData.guardianInfo,
        currentAddress,
        permanentAddress,
        sameAddress,
      },
    }));
  }, [currentAddress, permanentAddress, sameAddress, setFormData]);

  const handleCheckboxChange = (event) => {
    setSameAddress(event.target.checked);
    if (event.target.checked) {
      setPermanentAddress(currentAddress);
    }
  };

    const handleCurrentAddressChange = (event) => {
    const { id, value } = event.target;
    let isValid = true;
    let errorMessage = '';
  
    if (['city', 'district', 'state'].includes(id)) {
      isValid = validateAlphabets(value) || value === '';
      errorMessage = 'Invalid alphabetic input';
    } else if (id === 'pincode') {
      isValid = validateNumbers(value) || value === '';
      errorMessage = 'Invalid numeric input';
    }
  
    if (value === '' && ['line1', 'city', 'district', 'state', 'pincode'].includes(id)) {
      isValid = false;
      errorMessage = 'This field is required';
    }
  
    setCurrentAddress((prev) => ({ ...prev, [id]: value }));
    if (sameAddress) {
      setPermanentAddress((prev) => ({ ...prev, [id]: value }));
    }
  
    if (isValid) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [id]: '',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [id]: errorMessage,
      }));
    }
  };
  
  const handlePermanentAddressChange = (event) => {
    const { id, value } = event.target;
    let isValid = true;
    let errorMessage = '';
  
    if (['city', 'district', 'state'].includes(id)) {
      isValid = validateAlphabets(value) || value === '';
      errorMessage = 'Invalid alphabetic input';
    } else if (id === 'pincode') {
      isValid = validateNumbers(value) || value === '';
      errorMessage = 'Invalid numeric input';
    }
  
    if (value === '' && ['line1', 'city', 'district', 'state', 'pincode'].includes(id)) {
      isValid = false;
      errorMessage = 'This field is required';
    }
  
    setPermanentAddress((prev) => ({ ...prev, [id]: value }));
  
    if (isValid) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [id]: '',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [id]: errorMessage,
      }));
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    let isValid = true;
    let errorMessage = '';
  
    if (['FatherName', 'MotherName', 'GuardianName', 'ParentOccupation'].includes(name)) {
      isValid = validateAlphabets(value) || value === '';
      errorMessage = 'Invalid alphabetic input';
    } else if (['MobileNumber', 'EmergencyContact'].includes(name)) {
      isValid = validateNumbers(value) || value === '';
      if (value.length !== 10 && value !== '') {
        isValid = false;
        errorMessage = 'Phone number must be 10 digits';
      }
    } else if (name === 'Email') {
      isValid = validateEmail(value) || value === '';
      errorMessage = 'Email must end with @gmail.com';
    } else if (name === 'ParentQualification' && value === 'Other') {
      setOtherQualification('');
    }

    if (value === '' && ['FatherName', 'MotherName', 'ParentOccupation', 'MobileNumber', 'Email', 'EmergencyContact'].includes(name)) {
      isValid = false;
      errorMessage = 'This field is required';
    }
  
    setFormData((prevData) => ({
      ...prevData,
      guardianInfo: {
        ...prevData.guardianInfo,
        [name]: value,
      },
    }));
  
    if (isValid) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: errorMessage,
      }));
    }
  };

  const handleOtherQualificationChange = (event) => {
    const { value } = event.target;
    if (validateOtherQualification(value)) {
      setOtherQualification(value);
      setFormData((prevData) => ({
        ...prevData,
        guardianInfo: {
          ...prevData.guardianInfo,
          otherQualification: value,
        },
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        otherQualification: '',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        otherQualification: 'Invalid input (only alphabets, spaces, periods, commas, and hyphens allowed)',
      }));
    }
  };

  // const handleKeyDown = (event) => {
  //   if (event.key === 'Enter') {
  //     const { name, id } = event.target;
  //     setErrors((prevErrors) => ({
  //       ...prevErrors,
  //       [name || id]: '',
  //     }));
  //   }
  // };

  // const handleBlur = (event) => {
  //   const { name, id } = event.target;
  //   setErrors((prevErrors) => ({
  //     ...prevErrors,
  //     [name || id]: '',
  //   }));
  // };
  const handleKeyPress = (event) => {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  };
  const qualifications = ['Matriculation', '12th or Diploma', 'Graduation', 'Post Graduation', 'Other'];

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom className={classes.personalTitle}>
        Parent Information :
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="FatherName"
            name="FatherName"
            label="Father's Name"
            fullWidth
            autoComplete="fathers-name"
            value={formData.guardianInfo.FatherName || ''}
            onChange={handleInputChange}
            // onKeyDown={handleKeyDown}
            // onBlur={handleBlur}
            className={classes.textField}
            error={!!errors.FatherName}
            helperText={errors.FatherName}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="MotherName"
            name="MotherName"
            label="Mother's Name"
            fullWidth
            autoComplete="mothers-name"
            value={formData.guardianInfo.MotherName || ''}
            onChange={handleInputChange}
            // onKeyDown={handleKeyDown}
            // onBlur={handleBlur}
            className={classes.textField}
            error={!!errors.MotherName}
            helperText={errors.MotherName}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="GuardianName"
            name="GuardianName"
            label="Guardian (Optional)"
            fullWidth
            autoComplete="guardian"
            value={formData.guardianInfo.GuardianName || ''}
            onChange={handleInputChange}
            // onKeyDown={handleKeyDown}
            // onBlur={handleBlur}
            className={classes.textField}
            error={!!errors.GuardianName}
            helperText={errors.GuardianName}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="ParentOccupation"
            name="ParentOccupation"
            label="Parent Occupation"
            fullWidth
            autoComplete="parent-occupation"
            value={formData.guardianInfo.ParentOccupation || ''}
            onChange={handleInputChange}
            // onKeyDown={handleKeyDown}
            // onBlur={handleBlur}
            className={classes.textField}
            error={!!errors.ParentOccupation}
            helperText={errors.ParentOccupation}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            select
            required
            id="ParentQualification"
            name="ParentQualification"
            label="Parent Qualification"
            fullWidth
            autoComplete="parent-qualification"
            value={formData.guardianInfo.ParentQualification || ''}
            onChange={handleInputChange}
            // onKeyDown={handleKeyDown}
            // onBlur={handleBlur}
            className={classes.textField}
          >
            {qualifications.map((qualification) => (
              <MenuItem key={qualification} value={qualification}>
                {qualification}
              </MenuItem>
            ))}
          </TextField>
          {formData.guardianInfo.ParentQualification === 'Other' && (
            <TextField
              id="otherQualification"
              name="otherQualification"
              label="Please specify"
              fullWidth
              value={otherQualification}
              onChange={handleOtherQualificationChange}
              className={classes.textField}
              error={!!errors.otherQualification}
              helperText={errors.otherQualification}
            />
          )}
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom className={classes.contactTitle}>
        Contact Information :
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="MobileNumber"
            name="MobileNumber"
            label="Phone Number"
            fullWidth
            autoComplete="phone-number"
            value={formData.guardianInfo.MobileNumber || ''}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            // onKeyDown={handleKeyDown}
            // onBlur={handleBlur}
            className={classes.textField}
            error={!!errors.MobileNumber}
            helperText={errors.MobileNumber}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
  <TextField
    required
    id="Email"
    name="Email"
    label="Email"
    fullWidth
    autoComplete="email"
    value={formData.guardianInfo.Email || ''}
    onChange={handleInputChange}
    // onKeyDown={handleKeyDown}
    // onBlur={handleBlur}
    className={classes.textField}
    error={!!errors.Email}
    helperText={errors.Email}
  />
</Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="EmergencyContact"
            name="EmergencyContact"
            label="Emergency Contact Number"
            fullWidth
            autoComplete="emergency-contact-number"
            value={formData.guardianInfo.EmergencyContact || ''}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            // onKeyDown={handleKeyDown}
            // onBlur={handleBlur}
            className={classes.textField}
            error={!!errors.EmergencyContact}
            helperText={errors.EmergencyContact}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom className={classes.addressTitle}>
        Current Address :
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            id="line1"
            label="Line 1"
            fullWidth
            autoComplete="address-line1"
            value={currentAddress.line1}
            onChange={handleCurrentAddressChange}
            // onKeyDown={handleKeyDown}
            // onBlur={handleBlur}
            className={classes.addressField}
            error={!!errors.line1}
            helperText={errors.line1}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="line2"
            label="Line 2"
            fullWidth
            autoComplete="address-line2"
            value={currentAddress.line2}
            onChange={handleCurrentAddressChange}
            // onKeyDown={handleKeyDown}
            // onBlur={handleBlur}
            className={classes.addressField}
            error={!!errors.line2}
            helperText={errors.line2}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="city"
            label="City"
            fullWidth
            autoComplete="address-city"
            value={currentAddress.city}
            onChange={handleCurrentAddressChange}
            // onKeyDown={handleKeyDown}
            // onBlur={handleBlur}
            className={classes.textField}
            error={!!errors.city}
            helperText={errors.city}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="district"
            label="District"
            fullWidth
            autoComplete="address-district"
            value={currentAddress.district}
            onChange={handleCurrentAddressChange}
            // onKeyDown={handleKeyDown}
            // onBlur={handleBlur}
            className={classes.textField}
            error={!!errors.district}
            helperText={errors.district}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="state"
            label="State"
            fullWidth
            autoComplete="address-state"
            value={currentAddress.state}
            onChange={handleCurrentAddressChange}
            // onKeyDown={handleKeyDown}
            // onBlur={handleBlur}
            className={classes.textField}
            error={!!errors.state}
            helperText={errors.state}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="pincode"
            label="Pincode"
            fullWidth
            autoComplete="address-pincode"
            value={currentAddress.pincode}
            onChange={handleCurrentAddressChange}
            // onKeyDown={handleKeyDown}
            // onBlur={handleBlur}
            className={classes.textField}
            error={!!errors.pincode}
            helperText={errors.pincode}
          />
        </Grid>
      </Grid>

      <FormControlLabel
        control={
          <Checkbox
            checked={sameAddress}
            onChange={handleCheckboxChange}
            color="primary"
          />
        }
        label="Current address is same as permanent address"
        className={classes.formControlLabel}
      />

      <Typography variant="h6" gutterBottom className={classes.addressTitle}>
        Permanent Address :
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            id="line1"
            label="Line 1"
            fullWidth
            autoComplete="address-line1"
            value={permanentAddress.line1}
            onChange={handlePermanentAddressChange}
            // onKeyDown={handleKeyDown}
            // onBlur={handleBlur}
            className={classes.addressField}
            error={!!errors.line1}
            helperText={errors.line1}
            disabled={sameAddress}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="line2"
            label="Line 2"
            fullWidth
            autoComplete="address-line2"
            value={permanentAddress.line2}
            onChange={handlePermanentAddressChange}
            // onKeyDown={handleKeyDown}
            // onBlur={handleBlur}
            className={classes.addressField}
            error={!!errors.line2}
            helperText={errors.line2}
            disabled={sameAddress}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="city"
            label="City"
            fullWidth
            autoComplete="address-city"
            value={permanentAddress.city}
            onChange={handlePermanentAddressChange}
            // onKeyDown={handleKeyDown}
            // onBlur={handleBlur}
            className={classes.textField}
            error={!!errors.city}
            helperText={errors.city}
            disabled={sameAddress}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="district"
            label="District"
            fullWidth
            autoComplete="address-district"
            value={permanentAddress.district}
            onChange={handlePermanentAddressChange}
            // onKeyDown={handleKeyDown}
            // onBlur={handleBlur}
            className={classes.textField}
            error={!!errors.district}
            helperText={errors.district}
            disabled={sameAddress}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="state"
            label="State"
            fullWidth
            autoComplete="address-state"
            value={permanentAddress.state}
            onChange={handlePermanentAddressChange}
            // onKeyDown={handleKeyDown}
            // onBlur={handleBlur}
            className={classes.textField}
            error={!!errors.state}
            helperText={errors.state}
            disabled={sameAddress}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="pincode"
            label="Pincode"
            fullWidth
            autoComplete="address-pincode"
            value={permanentAddress.pincode}
            onChange={handlePermanentAddressChange}
            // onKeyDown={handleKeyDown}
            // onBlur={handleBlur}
            className={classes.textField}
            error={!!errors.pincode}
            helperText={errors.pincode}
            disabled={sameAddress}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}