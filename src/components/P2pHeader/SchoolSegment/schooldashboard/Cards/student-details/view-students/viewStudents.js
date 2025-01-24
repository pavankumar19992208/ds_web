import React, { useState } from 'react';
import { MenuItem, Select, FormControl, InputLabel, Divider } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import './viewStudents.css';

const ViewStudents = () => {
  const [selectedClass, setSelectedClass] = useState(''); // State to manage selected class

  const students = [
    { rollNumber: 1, name: 'Student 1', class: '10', section: 'A', performance: '85%' },
    { rollNumber: 2, name: 'Student 2', class: '10', section: 'B', performance: '90%' },
    { rollNumber: 3, name: 'Student 3', class: '10', section: 'A', performance: '74%' },
    { rollNumber: 4, name: 'Student 4', class: '10', section: 'A', performance: '50%' },
    { rollNumber: 5, name: 'Student 5', class: '10', section: 'A', performance: '69%' },
    { rollNumber: 6, name: 'Student 6', class: '10', section: 'A', performance: '87%' },
  ]; // Example data

  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
  };

  const classStrength = students.filter(student => student.class === selectedClass).length;
  const schoolStrength = students.length;

  return (
    <div className='view-students-container'>
      <div className='header-container'>
        <FormControl variant="outlined" className="select-class-dropdown">
          <InputLabel id="select-class-label">Select Class</InputLabel>
          <Select
            labelId="select-class-label"
            value={selectedClass}
            onChange={handleClassChange}
            label="Select Class"
            style={{ borderRadius: 10, height: 50 }} // Adjust the height here
          >
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value={'10'}>Class 10</MenuItem>
            <MenuItem value={'class2'}>Class 2</MenuItem>
            <MenuItem value={'class3'}>Class 3</MenuItem>
            {/* Add more classes as needed */}
          </Select>
        </FormControl>
        <div className='strength-container'>
          <span>Class Strength: {classStrength}</span>
          <Divider orientation="vertical" flexItem />
          <span>School Strength: {schoolStrength}</span>
        </div>
      </div>

      <TableContainer component={Paper} style={{ marginTop: 20, borderRadius: 10 }}>
        <Table>
          <TableHead style={{ backgroundColor: '#f0f0f0' }}>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold' }}>Roll Number</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Class</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Section</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Performance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student, index) => (
              <TableRow key={index}>
                <TableCell>{student.rollNumber}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.class}</TableCell>
                <TableCell>{student.section}</TableCell>
                <TableCell>{student.performance}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ViewStudents;