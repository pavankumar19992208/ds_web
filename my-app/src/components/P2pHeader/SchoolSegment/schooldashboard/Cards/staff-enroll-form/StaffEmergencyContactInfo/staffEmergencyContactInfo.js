import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
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

const StaffEmergencyContactInfo = () => {
  const classes = useStyles();
  const [formValues, setFormValues] = useState({
    emergencyContactName: '',
    emergencyContactNumber: '',
    relationshipToTeacher: '',
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
        Emergency Contact Information
      </Typography> */}
      <form className={classes.formContainer} onSubmit={handleSubmit}>
        <Grid container spacing={3} className={classes.gridContainer}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Emergency Contact Name"
              name="emergencyContactName"
              value={formValues.emergencyContactName}
              onChange={handleChange}
              fullWidth
              required
              className={classes.field}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Emergency Contact Number"
              name="emergencyContactNumber"
              value={formValues.emergencyContactNumber}
              onChange={handleChange}
              fullWidth
              required
              type="tel"
              className={classes.field}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Relationship to Teacher"
              name="relationshipToTeacher"
              value={formValues.relationshipToTeacher}
              onChange={handleChange}
              fullWidth
              required
              className={classes.field}
            />
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default StaffEmergencyContactInfo;