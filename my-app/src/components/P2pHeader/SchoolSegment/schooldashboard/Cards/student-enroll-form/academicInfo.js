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
            name="previousClass"
            label="Previous Class"
            fullWidth
            autoComplete="previous-class"
            value={formData.academicInfo.previousClass || ''}
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
            name="previousPercentage"
            label="Percentage of Previous Class"
            fullWidth
            autoComplete="previous-percentage"
            value={formData.academicInfo.previousPercentage || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            type="file"
            name="uploadTransferCertificate"
            label="Upload Transfer Certificate Document"
            fullWidth
            InputLabelProps={{ shrink: true }}
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
            required
            name="bloodGroup"
            label="Blood Group"
            fullWidth
            autoComplete="blood-group"
            value={formData.academicInfo.bloodGroup || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            name="allergies"
            label="Allergies or Other"
            fullWidth
            autoComplete="allergies"
            value={formData.academicInfo.allergies || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            select
            required
            name="severity"
            label="Severity"
            fullWidth
            autoComplete="severity"
            value={formData.academicInfo.severity || ''}
            onChange={handleChange}
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="moderate">Moderate</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </TextField>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}