import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  formContainer: {},
  mainContainer: {
    overflow: 'auto',
    maxHeight: '100vh',
  },
  gridContainer: {
    maxWidth: '100%',
    margin: '32px auto',
  },
  field: {
    marginLeft: theme.spacing(2),
    width: '92%',
  },
}));

const StaffEmergencyContactInfo = ({ formData, setFormData }) => {
  const classes = useStyles();
  const [formValues, setFormValues] = useState(formData.emergencyContactInfo || {
    emergencyContactName: '',
    emergencyContactNumber: '',
    relationshipToTeacher: '',
  });
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = '';
    if (['emergencyContactName', 'relationshipToTeacher'].includes(name)) {
      if (!/^[a-zA-Z\s]+$/.test(value)) {
        error = 'Only alphabets are allowed';
      }
    } else if (name === 'emergencyContactNumber') {
      if (!/^\d+$/.test(value)) {
        error = 'Only numbers are allowed';
      }
    }
    return error;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    let error = validateField(name, value);

    // Show error if the field is empty
    if (!value) {
      error = 'This field is required';
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    const updatedFormValues = { ...formValues, [name]: value };
    setFormValues(updatedFormValues);
    setFormData((prevData) => ({
      ...prevData,
      emergencyContactInfo: updatedFormValues,
    }));
  };

  return (
    <div className={classes.mainContainer}>
      <form className={classes.formContainer}>
        <Grid container spacing={3} className={classes.gridContainer}>
          <Grid item xs={12} sm={6}>
            <TextField
              id="emergencyContactName"
              label="Emergency Contact Name"
              name="emergencyContactName"
              value={formValues.emergencyContactName}
              onChange={handleChange}
              fullWidth
              required
              className={`${classes.field} urbanist-font`}
              error={!!errors.emergencyContactName}
              helperText={errors.emergencyContactName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="emergencyContactNumber"
              label="Emergency Contact Number"
              name="emergencyContactNumber"
              value={formValues.emergencyContactNumber}
              onChange={handleChange}
              fullWidth
              required
              type="tel"
              className={`${classes.field} urbanist-font`}
              error={!!errors.emergencyContactNumber}
              helperText={errors.emergencyContactNumber}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="relationshipToTeacher"
              label="Relationship to Teacher"
              name="relationshipToTeacher"
              value={formValues.relationshipToTeacher}
              onChange={handleChange}
              fullWidth
              required
              className={`${classes.field} urbanist-font`}
              error={!!errors.relationshipToTeacher}
              helperText={errors.relationshipToTeacher}
            />
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default StaffEmergencyContactInfo;