import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
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
    marginLeft: 16,
    width: '92%',
  },
}));

const employmentTypes = [
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Contractual', label: 'Contractual' },
  { value: 'Other', label: 'Other' },
];

const StaffEmploymentInfo = ({ formData, setFormData }) => {
  const classes = useStyles();
  const [formValues, setFormValues] = useState(formData.employmentInfo || {
    joiningDate: '',
    employmentType: '',
    otherEmploymentType: '',
    previousSchool: '',
  });
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = '';
    if (name === 'previousSchool') {
      if (!/^[a-zA-Z\s]+$/.test(value)) {
        error = 'Only alphabets are allowed';
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
      employmentInfo: updatedFormValues,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const finalFormValues = { ...formValues };
    if (formValues.employmentType === 'Other') {
      finalFormValues.employmentType = formValues.otherEmploymentType;
    }
    setFormData((prevData) => ({
      ...prevData,
      employmentInfo: finalFormValues,
    }));
  };

  return (
    <div className={classes.mainContainer}>
      <form className={classes.formContainer} onSubmit={handleSubmit}>
        <Grid container spacing={3} className={classes.gridContainer}>
          <Grid item xs={12} sm={6}>
            <TextField
              id="joiningDate"
              label="Joining Date"
              name="joiningDate"
              type="date"
              value={formValues.joiningDate}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
              className={`${classes.field} urbanist-font`}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="employmentType"
              select
              label="Employment Type"
              name="employmentType"
              value={formValues.employmentType}
              onChange={handleChange}
              fullWidth
              required
              className={`${classes.field} urbanist-font`}
            >
              {employmentTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            {formValues.employmentType === 'Other' && (
              <TextField
                id="otherEmploymentType"
                label="Specify Employment Type"
                name="otherEmploymentType"
                value={formValues.otherEmploymentType}
                onChange={handleChange}
                fullWidth
                required
                className={`${classes.field} urbanist-font`}
              />
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="previousSchool"
              label="Previous School (if applicable)"
              name="previousSchool"
              value={formValues.previousSchool}
              onChange={handleChange}
              fullWidth
              className={`${classes.field} urbanist-font`}
              error={!!errors.previousSchool}
              helperText={errors.previousSchool}
            />
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default StaffEmploymentInfo;