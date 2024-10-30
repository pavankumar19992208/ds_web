import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  formContainer: {},
  mainContainer: {
    overflow: 'auto',
    maxHeight: '100vh',
    // paddingTop: theme.spacing(-30), // Reduced top padding
  },
  gridContainer: {
    maxWidth: '100%',
    margin: '16px auto', // Reduced top margin
  },
  field: {
    marginLeft: theme.spacing(2),
    width: '92%',
  },
  menuItem: {
    backgroundColor: '#f0f0f0',
    '&:hover': {
      backgroundColor: '#d0d0d0',
    },
  },
}));

const positions = [
  { value: 'Teacher', label: 'Teacher' },
  { value: 'Assistant Teacher', label: 'Assistant Teacher' },
  { value: 'Head of the Department', label: 'Head of the Department' },
];

const grades = Array.from({ length: 10 }, (_, i) => ({ value: i + 1, label: `Class ${i + 1}` }));

const StaffProfessionalInfo = () => {
  const classes = useStyles();
  const [formValues, setFormValues] = useState({
    position: '',
    subjectSpecialization: '',
    grade: '',
    experience: '',
    qualification: '',
    certifications: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <div className={classes.mainContainer}>
      {/* <Typography component="h1" variant="h4" align="center">
        Staff Professional Information
      </Typography> */}
      <form className={classes.formContainer}>
        <Grid container spacing={3} className={classes.gridContainer}>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Position / Role"
              name="position"
              value={formValues.position}
              onChange={handleChange}
              fullWidth
              required
              className={classes.field}
            >
              {positions.map((option) => (
                <MenuItem key={option.value} value={option.value} className={classes.menuItem}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Subject Specialization"
              name="subjectSpecialization"
              value={formValues.subjectSpecialization}
              onChange={handleChange}
              fullWidth
              required
              className={classes.field}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Grade"
              name="grade"
              value={formValues.grade}
              onChange={handleChange}
              fullWidth
              required
              className={classes.field}
            >
              {grades.map((option) => (
                <MenuItem key={option.value} value={option.value} className={classes.menuItem}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Years of Teaching Experience"
              name="experience"
              value={formValues.experience}
              onChange={handleChange}
              fullWidth
              required
              type="number"
              className={classes.field}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Qualification"
              name="qualification"
              value={formValues.qualification}
              onChange={handleChange}
              fullWidth
              required
              className={classes.field}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Certifications (Teaching / Training)"
              name="certifications"
              value={formValues.certifications}
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

export default StaffProfessionalInfo;