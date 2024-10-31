import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

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
    const error = validateField(name, value);

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    if (!error) {
      setFormValues({ ...formValues, [name]: value });
      setFormData({ ...formData, emergencyContactInfo: { ...formValues, [name]: value } });
    }
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
              className={classes.field}
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
              className={classes.field}
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
              className={classes.field}
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