import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  formContainer: {
    overflow: 'auto', // Allow scrolling within the form
    maxHeight: '80vh', // Set a maximum height to ensure scrolling
  },
}));

export default function DetailsForm({ formData, setFormData }) {
  const classes = useStyles();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      personalInfo: {
        ...prevData.personalInfo,
        [name]: value,
      },
    }));
  };

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prevData) => ({
          ...prevData,
          personalInfo: {
            ...prevData.personalInfo,
            [name]: e.target.result,
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Student information
      </Typography>
      <Grid container spacing={3} className={classes.formContainer}>
        {/* Section 1 */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Basic Information :
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="fullName"
            name="fullName"
            label="Full name"
            fullWidth
            autoComplete="name"
            value={formData.personalInfo.fullName || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="dob"
            name="dob"
            label="Date of Birth"
            type="date"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={formData.personalInfo.dob || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="gender"
            name="gender"
            label="Gender"
            select
            fullWidth
            value={formData.personalInfo.gender || ''}
            onChange={handleChange}
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="photo"
            name="photo"
            label="Upload Photo"
            type="file"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleFileChange}
          />
        </Grid>

        {/* Section 2 */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Educational Information :
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="class"
            name="class"
            label="Class"
            select
            fullWidth
            value={formData.personalInfo.class || ''}
            onChange={handleChange}
          >
            {[...Array(10).keys()].map(i => (
              <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="previousSchool"
            name="previousSchool"
            label="Previous School Name"
            fullWidth
            value={formData.personalInfo.previousSchool || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="languagesKnown"
            name="languagesKnown"
            label="Languages Known"
            fullWidth
            value={formData.personalInfo.languagesKnown || ''}
            onChange={handleChange}
          />
        </Grid>

        {/* Section 3 */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Additional Information :
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="religion"
            name="religion"
            label="Religion"
            fullWidth
            value={formData.personalInfo.religion || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="category"
            name="category"
            label="Category"
            fullWidth
            value={formData.personalInfo.category || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="nationality"
            name="nationality"
            label="Nationality"
            fullWidth
            value={formData.personalInfo.nationality || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="aadharNumber"
            name="aadharNumber"
            label="Aadhar Number"
            fullWidth
            value={formData.personalInfo.aadharNumber || ''}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}