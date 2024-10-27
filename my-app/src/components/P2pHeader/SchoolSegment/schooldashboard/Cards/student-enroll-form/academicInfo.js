import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

export default function AcademicInfoForm({ formData, setFormData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      academicInfo: {
        ...prevData.academicInfo,
        [name]: value,
      },
    }));
  };

  const bloodGroups = ['A+', 'A-', 'O+', 'O-', 'AB+', 'AB-', 'Rh+', 'Rh-'];

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Academic Info
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            select
            required
            id="PreviousClass"
            name="PreviousClass"
            label="Previous Class"
            fullWidth
            autoComplete="previous-class"
            value={formData.academicInfo.PreviousClass || ''}
            onChange={handleChange}
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
            required
            id="PreviousPercentage"
            name="PreviousPercentage"
            label="Percentage of Previous Class"
            fullWidth
            autoComplete="previous-percentage"
            value={formData.academicInfo.PreviousPercentage || ''}
            onChange={handleChange}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom>
        Medical Info
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
            id="MedicalDisability"
            name="MedicalDisability"
            label="Allergies or Other"
            fullWidth
            autoComplete="allergies"
            value={formData.academicInfo.MedicalDisability || ''}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}