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

  const handleChange = (e) => {
    const { name, value } = e.target;
    let isValid = true;
    let errorMessage = '';

    if (name === 'PreviousPercentage') {
      isValid = validatePercentage(value);
      errorMessage = 'Invalid percentage input';
    }

    if (isValid) {
      setFormData((prevData) => ({
        ...prevData,
        academicInfo: {
          ...prevData.academicInfo,
          [name]: value,
        },
      }));
    } else {
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
            id="PreviousClass"
            name="PreviousClass"
            label="Previous Class"
            fullWidth
            autoComplete="previous-class"
            value={formData.academicInfo.PreviousClass || ''}
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
            id="PreviousPercentage"
            name="PreviousPercentage"
            label="Percentage of Previous Class (Optional)"
            fullWidth
            autoComplete="previous-percentage"
            value={formData.academicInfo.PreviousPercentage || ''}
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
            id="BloodGroup"
            name="BloodGroup"
            label="Blood Group"
            fullWidth
            autoComplete="blood-group"
            value={formData.academicInfo.BloodGroup || ''}
            onChange={handleChange}
            className={classes.textField}
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
  id="MedicalDisability"
  name="MedicalDisability"
  label="Medical Disability (Optional)"
  fullWidth
  autoComplete="medicaldisability"
  value={formData.academicInfo.MedicalDisability || ''} // Ensure empty string is handled
  onChange={handleChange}
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