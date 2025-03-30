import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import BaseUrl from '../../../../../../../config';

const useStyles = makeStyles((theme) => ({
  personalTitle: {
    color: '#3f51b5',
    fontSize: '1rem',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
    fontFamily: '"Urbanist", sans-serif',
    fontOpticalSizing: 'auto',
    fontWeight: 500,
  },
  contactTitle: {
    color: '#3f51b5',
    fontSize: '1rem',
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(1),
    fontFamily: '"Urbanist", sans-serif',
    fontOpticalSizing: 'auto',
    fontWeight: 500,
  },
  addressTitle: {
    color: '#3f51b5',
    fontSize: '1rem',
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(1),
    fontFamily: '"Urbanist", sans-serif',
    fontOpticalSizing: 'auto',
    fontWeight: 500,
  },
  formControlLabel: {
    marginLeft: theme.spacing(2),
  },
  textField: {
    fontFamily: '"Urbanist", sans-serif',
    fontOpticalSizing: 'auto',
    fontWeight: 500,
    marginLeft: theme.spacing(2),
    width: '92%',
  },
  addressField: {
    fontFamily: '"Urbanist", sans-serif',
    fontOpticalSizing: 'auto',
    fontWeight: 500,
    marginLeft: theme.spacing(2),
    width: '96%',
  },
}));

const validateAlphabets = (value) => /^[A-Za-z\s]*$/.test(value);
const validateNumbers = (value) => /^[0-9]{0,10}$/.test(value);
const validateOtherQualification = (value) => /^[A-Za-z\s.,-]*$/.test(value);
const validateEmail = (value) => value.endsWith('@gmail.com');

export default function GuardianInfoForm({ formData, setFormData }) {
  const classes = useStyles();
  const [address, setAddress] = useState(() => {
    const initialAddress = formData.guardianInfo.address || {
      line1: '',
      line2: '',
      landmark: '',
      locality: '',
      city: '',
      district: '',
      state: '',
      country: 'India',
      pincode: '',
      addressType: ''
    };
    // Clean up any undefined values
    Object.keys(initialAddress).forEach(key => {
      if (initialAddress[key] === undefined) {
        initialAddress[key] = '';
      }
    });
    return initialAddress;
  });
  const [errors, setErrors] = useState({});
  const [otherQualification, setOtherQualification] = useState(formData.guardianInfo.otherQualification || '');
  const [occupations, setOccupations] = useState([]);
  const [filteredOccupations, setFilteredOccupations] = useState([]);
  const [occupationSearch, setOccupationSearch] = useState('');
  const [qualifications, setQualifications] = useState([]);
  const [loadingQualifications, setLoadingQualifications] = useState(false);
  const [qualificationError, setQualificationError] = useState(null);
  const [addressTypes, setAddressTypes] = useState(['School', 'Office', 'Residential', 'Other']);

  useEffect(() => {
    const fetchQualifications = async () => {
      setLoadingQualifications(true);
      setQualificationError(null);
      try {
        const response = await axios.get(`${BaseUrl}/qualifications`);
        setQualifications(response.data);
      } catch (error) {
        console.error('Error fetching qualifications:', error);
        setQualificationError('Failed to load qualifications');
      } finally {
        setLoadingQualifications(false);
      }
    };
    fetchQualifications();
  }, []);

  useEffect(() => {
    const fetchOccupations = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/occupations`);
        setOccupations(response.data);
        setFilteredOccupations(response.data);
      } catch (error) {
        console.error('Error fetching occupations:', error);
      }
    };
    fetchOccupations();
  }, []);

  useEffect(() => {
    if (occupationSearch) {
      const filtered = occupations.filter(occ => 
        occ.occupation_name.toLowerCase().includes(occupationSearch.toLowerCase())
      );
      setFilteredOccupations(filtered);
    } else {
      setFilteredOccupations(occupations);
    }
  }, [occupationSearch, occupations]);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      guardianInfo: {
        ...prevData.guardianInfo,
        address,
      },
    }));
  }, [address, setFormData]);

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
  
    if (value === '' && ['line1', 'city', 'district', 'state', 'pincode', 'addressType'].includes(id)) {
      isValid = false;
      errorMessage = 'This field is required';
    }
  
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
  
    if (isValid) {
      setErrors(prevErrors => ({ ...prevErrors, [id]: '' }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, [id]: errorMessage }));
    }
  };
    // console.log('Updated Address:', address);

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

  const handleOccupationSelect = (event, value) => {
    setFormData((prevData) => ({
      ...prevData,
      guardianInfo: {
        ...prevData.guardianInfo,
        ParentOccupation: value ? value.occupation_name : '',
      },
    }));
  };

  const handleKeyPress = (event) => {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  };

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
            className={classes.textField}
            error={!!errors.GuardianName}
            helperText={errors.GuardianName}
          />
        </Grid>
        <Grid item xs={12} md={6}>
        <Autocomplete
          id="ParentOccupation"
          options={filteredOccupations}
          getOptionLabel={(option) => option.occupation_name}
          value={occupations.find(occ => occ.occupation_name === formData.guardianInfo.ParentOccupation) || null}
          onChange={handleOccupationSelect}
          onInputChange={(event, newInputValue) => {
            setOccupationSearch(newInputValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              required
              label="Parent Occupation"
              className={classes.textField}
              error={!!errors.ParentOccupation}
              helperText={errors.ParentOccupation}
            />
          )}
          noOptionsText="No occupations found"
          filterOptions={(options, state) => options}
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
            className={classes.textField}
            disabled={loadingQualifications}
            error={!!qualificationError || !!errors.ParentQualification}
            helperText={qualificationError || errors.ParentQualification}
          >
            {loadingQualifications ? (
              <MenuItem disabled>Loading qualifications...</MenuItem>
            ) : qualificationError ? (
              <MenuItem disabled>{qualificationError}</MenuItem>
            ) : (
              qualifications.map((qualification) => (
                <MenuItem 
                  key={qualification.qualification_id} 
                  value={qualification.qualification_name}
                >
                  {qualification.qualification_name}
                </MenuItem>
              ))
            )}
            <MenuItem value="Other">Other</MenuItem>
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
            className={classes.textField}
            error={!!errors.EmergencyContact}
            helperText={errors.EmergencyContact}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom className={classes.addressTitle}>
        Address Information :
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            id="line1"
            label="Address Line 1"
            fullWidth
            autoComplete="address-line1"
            value={address.line1}
            onChange={handleAddressChange}
            className={classes.addressField}
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
            className={classes.addressField}
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
            className={classes.textField}
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
            className={classes.textField}
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
            value={address.district}
            onChange={handleAddressChange}
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
            value={address.state}
            onChange={handleAddressChange}
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
            value={address.pincode}
            onChange={handleAddressChange}
            className={classes.textField}
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
            className={classes.textField}
            error={!!errors.country}
            helperText={errors.country}
          />
        </Grid>
        <Grid item xs={12} md={6}>
  <TextField
    select
    required
    id="addressType"
    name="addressType"
    label="Address Type"
    fullWidth
    value={address.addressType || ''}
    onChange={(e) => {
      setAddress(prev => ({ ...prev, addressType: e.target.value }));
    }}
    className={classes.textField}
    error={!!errors.addressType}
    helperText={errors.addressType}
  >
    {addressTypes.map((type) => (
      <MenuItem key={type} value={type}>
        {type}
      </MenuItem>
    ))}
  </TextField>
</Grid>
      </Grid>
    </React.Fragment>
  );
}