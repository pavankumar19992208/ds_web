import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import BaseUrl from '../../../../../../../config';

const useStyles = makeStyles((theme) => ({
  academicTitle: {
    color: '#3f51b5',
    fontSize: '1rem',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    fontFamily: '"Urbanist", sans-serif',
    fontOpticalSizing: 'auto',
    fontWeight: 500 ,
  },
  medicalTitle: {
    color: '#3f51b5',
    fontSize: '1rem',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(1),
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

const validateAlphabets = (value) => /^[A-Za-z\s]+$/.test(value);
const validatePercentage = (value) => /^[0-9]{0,3}$/.test(value);

export default function AcademicInfoForm({ formData, setFormData }) {
  const classes = useStyles();
  const [disabilities, setDisabilities] = useState([]);
  const [loadingDisabilities, setLoadingDisabilities] = useState(false);
  const [disabilityError, setDisabilityError] = useState(null);

   // Fetch disabilities from API
   useEffect(() => {
    const fetchDisabilities = async () => {
      setLoadingDisabilities(true);
      setDisabilityError(null);
      try {
        const response = await axios.get(`${BaseUrl}/disabilities`);
        setDisabilities(response.data);
      } catch (error) {
        console.error('Error fetching disabilities:', error);
        setDisabilityError('Failed to load disabilities');
      } finally {
        setLoadingDisabilities(false);
      }
    };
    fetchDisabilities();
  }, []);

  const [errors, setErrors] = useState({
    blood_group: '',
    previous_percentage: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let isValid = true;
    let errorMessage = '';
  
    if (name === 'previous_percentage') {
      isValid = validatePercentage(value);
      errorMessage = 'Invalid percentage input';
    }
  
    // Update form data
    setFormData((prevData) => ({
      ...prevData,
      academicInfo: {
        ...prevData.academicInfo,
        [name]: value,
      },
    }));
  
    // Clear any existing error when field is changed
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  
    if (!isValid) {
      alert(errorMessage);
    }
  };

  const bloodGroups = ['A+', 'A-', 'O+', 'O-', 'B+', 'B-', 'AB+', 'AB-', 'Rh+', 'Rh-'];

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom className={classes.academicTitle}>
        Academic Info :
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            select
            id="previous_class"
            name="previous_class"
            label="Previous Class"
            fullWidth
            autoComplete="previous-class"
            value={formData.academicInfo.previous_class || ''}
            onChange={handleChange}
            className={classes.textField}
          >
            {[...Array(10).keys()].map((num) => (
              <MenuItem key={num + 1} value={num + 1}>
                {num + 1}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="previous_percentage"
            name="previous_percentage"
            label="Percentage of Previous Class (Optional)"
            fullWidth
            autoComplete="previous-percentage"
            value={formData.academicInfo.previous_percentage || ''}
            onChange={handleChange}
            className={classes.textField}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom className={classes.medicalTitle}>
        Medical Info :
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            select
            required
            id="blood_group"
            name="blood_group"
            label="Blood Group"
            fullWidth
            autoComplete="blood-group"
            value={formData.academicInfo.blood_group || ''}
            onChange={handleChange}
            className={classes.textField}
            error={!!errors.blood_group}
            helperText={errors.blood_group}
          >
            {bloodGroups.map((group) => (
              <MenuItem key={group} value={group}>
                {group}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={6}>
        <TextField
  select
  id="medical_disability"
  name="medical_disability"
  label="Medical Disability (Optional)"
  fullWidth
  autoComplete="medicaldisability"
  value={formData.academicInfo.medical_disability || ''}
  onChange={(e) => {
    const selectedDisability = disabilities.find(d => d.disability_name === e.target.value);
    setFormData(prev => ({
      ...prev,
      academicInfo: {
        ...prev.academicInfo,
        medical_disability: selectedDisability ? selectedDisability.disability_name : '',
        disability_id: selectedDisability ? selectedDisability.disability_id : null
      }
    }));
  }}
  className={classes.textField}
  disabled={loadingDisabilities}
  error={!!disabilityError}
  helperText={disabilityError}
>
  {loadingDisabilities ? (
    <MenuItem disabled>Loading disabilities...</MenuItem>
  ) : disabilityError ? (
    <MenuItem disabled>{disabilityError}</MenuItem>
  ) : (
    [
      <MenuItem key="none" value="">
        None
      </MenuItem>,
      ...disabilities.map((disability) => (
        <MenuItem 
          key={disability.disability_id} 
          value={disability.disability_name}
        >
          {disability.disability_name} ({disability.category})
        </MenuItem>
      ))
    ]
  )}
</TextField>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}