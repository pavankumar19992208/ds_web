import React, {} from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';

export default function AcademicInfoForm() {
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
            id="previousClass"
            label="Previous Class"
            fullWidth
            autoComplete="previous-class"
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
            id="previousPercentage"
            label="Percentage of Previous Class"
            fullWidth
            autoComplete="previous-percentage"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            type="file"
            id="uploadPercentage"
            label="Upload Percentage Document"
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      <Divider style={{ margin: '20px 0' }} />

      <Typography variant="h6" gutterBottom>
        Medical Info
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="bloodGroup"
            label="Blood Group"
            fullWidth
            autoComplete="blood-group"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="allergies"
            label="Allergies or Other"
            fullWidth
            autoComplete="allergies"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            select
            required
            id="severity"
            label="Severity"
            fullWidth
            autoComplete="severity"
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