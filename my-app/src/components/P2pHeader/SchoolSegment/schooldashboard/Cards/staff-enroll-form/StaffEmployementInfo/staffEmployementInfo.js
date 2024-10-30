import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
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
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(3),
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
    backgroundColor: '#ff8040', // Change button color
    color: 'white', // Change text color
    '&:hover': {
      backgroundColor: '#faaa72', // Change button color on hover
    },
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

const StaffEmploymentInfo = () => {
  const classes = useStyles();
  const [formValues, setFormValues] = useState({
    joiningDate: '',
    employmentType: '',
    otherEmploymentType: '',
    previousSchool: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission
    console.log(formValues);
  };

  return (
    <div className={classes.mainContainer}>
      {/* <Typography component="h1" variant="h4" align="center">
        Staff Employment Information
      </Typography> */}
      <form className={classes.formContainer} onSubmit={handleSubmit}>
        <Grid container spacing={3} className={classes.gridContainer}>
          <Grid item xs={12} sm={6}>
            <TextField
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
              label="Previous School (if applicable)"
              name="previousSchool"
              value={formValues.previousSchool}
              onChange={handleChange}
              fullWidth
              className={classes.field}
            />
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default StaffEmploymentInfo;