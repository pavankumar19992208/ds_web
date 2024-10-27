import React, { useState } from 'react';
import { Box, Container, FormControl, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Typography, Grid } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const subjects = ['Hindi', 'Telugu', 'English', 'Maths', 'Science', 'Social'];

const initialMarks = {
  Hindi: '',
  Telugu: '',
  English: '',
  Maths: '',
  Science: '',
  Social: ''
};

const CareerGuidance = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [marks, setMarks] = useState({
    6: { ...initialMarks },
    7: { ...initialMarks },
    8: { ...initialMarks },
    9: { ...initialMarks },
    10: { ...initialMarks }
  });

  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
  };

  const handleMarksChange = (subject, value) => {
    setMarks((prevMarks) => ({
      ...prevMarks,
      [selectedClass]: {
        ...prevMarks[selectedClass],
        [subject]: value
      }
    }));
  };

  const calculateRecommendedCourse = () => {
    if (!selectedClass) return '';

    const totalMarks = subjects.reduce((acc, subject) => acc + (parseFloat(marks[selectedClass][subject]) || 0), 0);
    const averageMarks = totalMarks / subjects.length;

    if (averageMarks >= 90) {
      return 'MPC';
    } else if (averageMarks >= 80) {
      return 'BiPC';
    } else if (averageMarks >= 70) {
      return 'MEC';
    } else {
      return 'CEC';
    }
  };

  const recommendedCourse = calculateRecommendedCourse();

  const data = {
    labels: subjects,
    datasets: [
      {
        data: selectedClass ? subjects.map((subject) => marks[selectedClass][subject] || 0) : [],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ]
      }
    ]
  };

  return (
    <Container maxWidth="md" sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Career Guidance
      </Typography>
      <FormControl fullWidth sx={{ marginBottom: 3 }}>
        <InputLabel id="class-select-label">Select Class</InputLabel>
        <Select
          labelId="class-select-label"
          id="class-select"
          value={selectedClass}
          label="Select Class"
          onChange={handleClassChange}
        >
          <MenuItem value={6}>6th</MenuItem>
          <MenuItem value={7}>7th</MenuItem>
          <MenuItem value={8}>8th</MenuItem>
          <MenuItem value={9}>9th</MenuItem>
          <MenuItem value={10}>10th</MenuItem>
        </Select>
      </FormControl>
      {selectedClass && marks[selectedClass] && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TableContainer component={Paper} sx={{ marginBottom: 3 }}>
              <Table sx={{ minWidth: 350 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Subject</TableCell>
                    <TableCell align="right">Marks</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subjects.map((subject) => (
                    <TableRow key={subject}>
                      <TableCell component="th" scope="row">
                        {subject}
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          type="number"
                          value={marks[selectedClass][subject]}
                          onChange={(e) => handleMarksChange(subject, e.target.value)}
                          inputProps={{ min: 0, max: 100 }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ width: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Overall Performance
              </Typography>
              <Pie data={data} />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ padding: 2, backgroundColor: '#f5f5f5', borderRadius: 1, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Recommended Course
              </Typography>
              <Typography variant="body1">
                Based on your marks, we recommend you to pursue: <strong>{recommendedCourse}</strong>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default CareerGuidance;