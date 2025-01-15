import React from 'react';
import { Container, Grid, Paper, Typography, TextField, Button } from '@mui/material';
import TeacherAttributes from './TeacherAttributes';
import StudentAttributes from './StudentAttributes';

const EventPlanning = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Event Planning
      </Typography>
      <Paper style={{ padding: 16 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField label="Event Name" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Event Date" type="date" InputLabelProps={{ shrink: true }} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TeacherAttributes />
          </Grid>
          <Grid item xs={12}>
            <StudentAttributes />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary">Save Event</Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default EventPlanning;