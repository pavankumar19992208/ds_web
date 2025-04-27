import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { makeStyles } from '@mui/styles';
import { storage } from '../../../../../../connections/firebase'; // Adjust the import path as necessary
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import './staffPersonalInfo.css';

const useStyles = makeStyles((theme) => ({
  fieldMargin: {
    marginLeft: 16, // Add left margin to all fields
    marginRight: 16, // Add right margin to all fields
    width: '92%', // Set the width of all fields to 92%
  },
  addressField: {
    fontFamily: '"Urbanist", sans-serif',
    fontOpticalSizing: 'auto',
    fontWeight: 500 ,
    marginLeft: 16, // Add left margin to all fields
    marginRight: 16, // Add right margin to all fields
    width: '92%', // Set the width of all fields to 92%
  },
}));

export default function StaffPersonalInfo({ formData, setFormData }) {
  const [errors, setErrors] = useState({});
  const classes = useStyles();
  const [addressTypes, setAddressTypes] = useState(['School', 'Office', 'Residential', 'Other']);
  const [address, setAddress] = useState(() => {
    const initialAddress = formData?.staffPersonalInfo?.address || {
      line1: '',
      line2: '',
      landmark: '',
      locality: '',
      city: '',
      district: '',
      state: '',
      country: 'India',
      pincode: '',
      address_type: ''
    };
    // Clean up any undefined values
    Object.keys(initialAddress).forEach(key => {
      if (initialAddress[key] === undefined) {
        initialAddress[key] = '';
      }
    });
    return initialAddress;
  });  
  const validateNumbers = (value) => /^[0-9]{0,10}$/.test(value);
  const validateField = (name, value) => {
    let error = '';
    if (['fullName', 'city', 'district', 'state', 'customGender'].includes(name)) {
      if (!/^[a-zA-Z\s]+$/.test(value)) {
        error = 'Only alphabets are allowed';
      }
    } else if (['pinCode', 'contact_number'].includes(name)) {
      if (!/^\d+$/.test(value)) {
        error = 'Only numbers are allowed';
      }
    } else if (name === 'email') {
      if (!value.endsWith('@gmail.com')) {
        error = 'Email must end with @gmail.com';
      }
    }
    return error;
  };

  const handleProfilePicUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const storageRef = ref(storage, `profile_pictures/${file.name}`);
      await uploadBytes(storageRef, file);
      const fileURL = await getDownloadURL(storageRef);

      setFormData((prevFormData) => ({
        ...prevFormData,
        personalInfo: {
          ...prevFormData.personalInfo,
          profilePic: fileURL,
          profilePicName: file.name,
        },
      }));
    }
  };

  const handleInputChange = (e, fieldType, addressType = null) => {
    const { name, value } = e.target;
    let error = validateField(name, value);
    let isValid = true;
    let errorMessage = '';
    // Show error if the field is empty
    if (!value) {
      error = 'This field is required';
    }

    if (name === 'contact_number') {
      isValid = validateNumbers(value) || value === '';
      if (value.length > 10) {
        isValid = false;
        errorMessage = 'Phone number must be 10 digits';
      }
      error = !isValid ? errorMessage : error;
    }

    setErrors((prev) => ({
      ...prev,
      [addressType ? `${addressType}.${name}` : name]: error,
    }));

    if (fieldType === 'personalInfo') {
      setFormData((prev) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          [name]: value,
        },
      }));
    } 
    else if (fieldType === 'address' && addressType) {
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

  const handleAddressChange = (event) => {
    const { id, value } = event.target;
    let isValid = true;
    let errorMessage = '';
  
    if (['city', 'district', 'state', 'country', 'locality', 'landmark'].includes(id)) {
      isValid = validateAlphabets(value) || value === '';
      errorMessage = 'Invalid alphabetic input';
    } else if (id === 'pincode') {
      isValid = validateNumbers(value) || value === '';
      errorMessage = 'Invalid numeric input';
    }
  
    if (value === '' && ['line1', 'city', 'district', 'state', 'pincode', 'address_type'].includes(id)) {
      isValid = false;
      errorMessage = 'This field is required';
    }

useEffect(() => {
  setFormData((prevData) => ({
    ...prevData,
    guardianInfo: {
      ...prevData.guardianInfo,
      address,
    },
  }));
}, [address, setFormData]);
  
    // Update the address state properly
    setAddress(prev => {
      const updatedAddress = { ...prev, [id]: value };
      // Remove any undefined properties that might have been accidentally added
      Object.keys(updatedAddress).forEach(key => {
        if (updatedAddress[key] === undefined) {
          delete updatedAddress[key];
        }
      });
      return updatedAddress;
    });

    setFormData(prev => ({
      ...prev,
      guardianInfo: {
        ...prev.guardianInfo,
        address: {
          ...prev.guardianInfo.address,
          [id]: value
        }
      }
    }));
  
    if (isValid) {
      setErrors(prevErrors => ({ ...prevErrors, [id]: '' }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, [id]: errorMessage }));
    }
  };


  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setFormData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        sameAsCurrent: checked,
        permanentAddress: checked ? prev.personalInfo.currentAddress : prev.personalInfo.permanentAddress || {
          line1: '',
          line2: '',
          city: '',
          district: '',
          state: '',
          pinCode: '',
        },
      },
    }));
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        sameAsCurrent: prev.personalInfo.sameAsCurrent || false,
      },
    }));
  }, [setFormData]);

  return (
    <React.Fragment>
      <Typography variant="h6" className='heading' style={{marginBottom:'26px', marginTop:'12px'}}>
        Personal details :
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
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
          {formData.personalInfo.gender === 'other' && (
            <TextField
              required
              id="customGender"
              name="customGender"
              label="Please specify"
              fullWidth
              className={`${classes.fieldMargin} heading`}
              value={formData.personalInfo.customGender || ''}
              onChange={(e) => handleInputChange(e, 'personalInfo')}
              error={!!errors.customGender}
              helperText={errors.customGender}
            />
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="contact_number"
            name="contact_number"
            label="Contact Number"
            fullWidth
            className={`${classes.fieldMargin} heading`}
            autoComplete="tel"
            value={formData.personalInfo.contact_number}
            onChange={(e) => handleInputChange(e, 'personalInfo')}
            error={!!errors.contact_number}
            helperText={errors.contact_number}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="email"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            required
            className={`${classes.fieldMargin} heading`}
            autoComplete="email"
            value={formData.personalInfo.email}
            onChange={(e) => handleInputChange(e, 'personalInfo')}
            error={!!errors.email}
            helperText={errors.email}
          />
        </Grid>

        <Grid item xs={12}>
        <Typography variant="h6" gutterBottom className='heading' style={{marginBottom:'0px', marginTop:'12px'}} >
        Address Information :
        </Typography>
        </Grid>
        {/* <Grid container spacing={3}> */}
        <Grid item xs={12}>
          <TextField
            required
            id="line1"
            label="Address Line 1"
            fullWidth
            autoComplete="address-line1"
            value={address.line1}
            onChange={handleAddressChange}
            className={`${classes.addressField} heading`} 
            error={!!errors.line1}
            helperText={errors.line1}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="line2"
            label="Address Line 2"
            fullWidth
            autoComplete="address-line2"
            value={address.line2}
            onChange={handleAddressChange}
            className={`${classes.addressField} heading`}
            error={!!errors.line2}
            helperText={errors.line2}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="landmark"
            label="Landmark"
            fullWidth
            autoComplete="landmark"
            value={address.landmark}
            onChange={handleAddressChange}
            className={`${classes.addressField} heading`} 
            error={!!errors.landmark}
            helperText={errors.landmark}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="locality"
            label="Locality"
            fullWidth
            autoComplete="locality"
            value={address.locality}
            onChange={handleAddressChange}
            className={`${classes.addressField} heading`} 
            error={!!errors.locality}
            helperText={errors.locality}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="city"
            label="City"
            fullWidth
            autoComplete="address-city"
            value={address.city}
            onChange={handleAddressChange}
            className={`${classes.addressField} heading`} 
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
            value={address.district}
            onChange={handleAddressChange}
            className={`${classes.addressField} heading`} 
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
            value={address.state}
            onChange={handleAddressChange}
            className={`${classes.addressField} heading`} 
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
            value={address.pincode}
            onChange={handleAddressChange}
            className={`${classes.addressField} heading`} 
            error={!!errors.pincode}
            helperText={errors.pincode}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="country"
            label="Country"
            fullWidth
            autoComplete="country"
            value={address.country}
            onChange={handleAddressChange}
            className={`${classes.addressField} heading`} 
            error={!!errors.country}
            helperText={errors.country}
          />
        </Grid>
        <Grid item xs={12} md={6}>
  <TextField
    select
    required
    id="address_type"
    name="address_type"
    label="Address Type"
    fullWidth
    value={address.address_type || ''}
    onChange={(e) => {
      setAddress(prev => ({ ...prev, address_type: e.target.value }));
    }}
    className={`${classes.addressField} heading`} 
    error={!!errors.address_type}
    helperText={errors.address_type}
  >
    {addressTypes.map((type) => (
      <MenuItem key={type} value={type}>
        {type}
      </MenuItem>
    ))}
  </TextField>
</Grid>
      </Grid>
      {/* </Grid> */}

    </React.Fragment>
  );
}