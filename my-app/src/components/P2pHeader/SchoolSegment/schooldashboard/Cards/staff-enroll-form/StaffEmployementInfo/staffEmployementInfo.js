import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
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
    const error = validateField(name, value);

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    if (!error) {
      setFormValues({ ...formValues, [name]: value });
      setFormData({ ...formData, employmentInfo: { ...formValues, [name]: value } });
    }
  };

  return (
    <div className={classes.mainContainer}>
      <form className={classes.formContainer}>
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
              className={classes.field}
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
              className={classes.field}
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
                label="Specify Other Employment Type"
                name="otherEmploymentType"
                value={formValues.otherEmploymentType}
                onChange={handleChange}
                fullWidth
                required
                className={classes.field}
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
              className={classes.field}
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