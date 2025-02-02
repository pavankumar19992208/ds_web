import React, { useState, useEffect } from 'react';
import { MenuItem, Select, FormControl, Divider, LinearProgress } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Lottie from 'lottie-react';
import BaseUrl from '../../../../../../../config';
import animationData from '../../../../../../../images/Animation - 1738392036492.json'; // Import your Lottie JSON file

import './viewStudents.css';

const ViewStudents = ({ setLoading }) => {
  const [selectedClass, setSelectedClass] = useState('Select Class'); // State to manage selected class
  const [grades, setGrades] = useState([]); // State to manage grades
  const [students, setStudents] = useState([]);
  const [loading, setLoadingState] = useState(false); // State to manage loading

  useEffect(() => {
    const fetchGrades = async () => {
      setLoadingState(true); // Set loading to true before fetching grades
      try {
        const response = await fetch(`${BaseUrl}/grades`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const text = await response.text();
          console.error('Error fetching grades:', text);
          throw new Error('Failed to fetch grades');
        }

        const data = await response.json();
        setGrades(data.grades || []);
      } catch (error) {
        console.error('Error fetching grades:', error);
      } finally {
        setLoadingState(false); // Set loading to false after fetching grades
      }
    };

    fetchGrades();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      if (selectedClass === 'Select Class') return;

      setLoadingState(true); // Set loading to true before fetching students
      try {
        const response = await fetch(`${BaseUrl}/students/${selectedClass}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const text = await response.text();
          console.error('Error fetching students:', text);
          throw new Error('Failed to fetch students');
        }

        const data = await response.json();
        const formattedStudents = data.students.map(student => ({
          rollNumber: student.StudentId,
          name: student.Name,
          class: student.Grade,
          section: student.Section || 'N/A', // Assuming section might be missing
          performance: student.Performance || 'N/A' // Assuming performance might be missing
        }));
        setStudents(formattedStudents);
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoadingState(false); // Set loading to false after fetching students
      }
    };

    fetchStudents();
  }, [selectedClass, setLoading]);

  const handleClassChange = (event) => {
    const selectedClass = event.target.value;
    setSelectedClass(selectedClass);
    setLoading(true); // Set loading to true when class changes
  };

  const classStrength = students.filter(student => student.class === selectedClass).length;
  const schoolStrength = students.length;

  return (
    <div className='view-students-container'>
      {loading && <LinearProgress />} {/* Display loader bar when loading */}
      <div className='header-container'>
        <FormControl variant="outlined" className="select-class-dropdown">
          <Select className="custom-select" value={selectedClass} onChange={handleClassChange} displayEmpty>
            <MenuItem value="Select Class">Select Class</MenuItem>
            {grades.sort().map((grade, index) => (
              <MenuItem key={index} value={grade}>{grade}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <div className='strength-container'>
          <span>Class Strength: {classStrength}</span>
          <Divider orientation="vertical" flexItem />
          <span>School Strength: {schoolStrength}</span>
        </div>
      </div>

      {selectedClass === 'Select Class' ? (
        <div className="loading-animation">
          <Lottie animationData={animationData} height={200} width={200} />
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default ViewStudents;