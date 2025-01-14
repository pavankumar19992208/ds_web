import React, { useState, useContext, useEffect } from 'react';
import { TextField, Button, Grid, Container, Typography, Autocomplete, List, ListItem, ListItemText } from '@mui/material';
import { GlobalStateContext } from "../../../../../../GlobalStateContext";
import BaseUrl from '../../../../../../config';
import Sidebar from '../../Sidebar/Sidebar';
import Navbar from '../../Navbar/Navbar';

const PayrollForm = () => {
  const { globalData } = useContext(GlobalStateContext);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [subjectsByClass, setSubjectsByClass] = useState({});
  const [teachers, setTeachers] = useState([]);
  const [teacherDetails, setTeacherDetails] = useState({});

  const handleTeacherChange = async (event, newValue) => {
    setSelectedTeacher(newValue);
  
    if (newValue) {
        try {
            const response = await fetch(`${BaseUrl}/teachers/${newValue.userid}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
  
            if (!response.ok) {
                const text = await response.text();
                console.error('Error fetching teacher details:', text);
                throw new Error('Failed to fetch teacher details');
            }
  
            const data = await response.json();
            setTeacherDetails(data);
            const subjectsByClass = data.subjectSpecialization || {};
            setSubjectsByClass(subjectsByClass);
        } catch (error) {
            console.error('Error fetching teacher details:', error);
            setTeacherDetails({});
            setSubjectsByClass({});
        }
    } else {
        setTeacherDetails({});
        setSubjectsByClass({});
    }
  };

   useEffect(() => {
      const fetchTeachers = async () => {
        try {
          const response = await fetch(`${BaseUrl}/teachers`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
  
          if (!response.ok) {
            const text = await response.text();
            console.error('Error fetching teachers:', text);
            throw new Error('Failed to fetch teachers');
          }
  
          const data = await response.json();
          if (data && Array.isArray(data.teachers)) {
            setTeachers(data.teachers.map(teacher => ({ label: teacher.Name, userid: teacher.teacherid })));
          } else {
            console.error('Teachers data is not available or not an array');
            setTeachers([]); // Set an empty array to avoid undefined issues
          }
        } catch (error) {
          console.error('Error fetching teachers:', error);
          setTeachers([]); // Set an empty array to avoid undefined issues
        }
      };
  
      fetchTeachers();
    }, [globalData.data.SCHOOL_ID]);

  return (
    <div style={{ margin: '10vh auto' }}>
      <Navbar
        schoolName={globalData.data.SCHOOL_NAME}
        schoolLogo={globalData.data.SCHOOL_LOGO}
      />
      <Sidebar
        visibleItems={["home"]}
        hideProfile={true}
        showTitle={false}
      />
      <Container>
        <Typography variant="h4" gutterBottom>
          Add / Update Payroll
        </Typography>
        <form noValidate autoComplete="off" style={{ margin: '5vh 0' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={teachers}
                getOptionLabel={(option) => option.label}
                value={selectedTeacher}
                onChange={handleTeacherChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    id="staffName"
                    name="staffName"
                    label="Staff Name"
                    fullWidth
                    variant="outlined"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="staffId"
                name="staffId"
                label="Staff ID"
                fullWidth
                variant="outlined"
                value={teacherDetails.teacherid || ''}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="experience"
                name="experience"
                label="Experience"
                fullWidth
                variant="outlined"
                value={teacherDetails.experience || ''}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="qualifications"
                name="qualifications"
                label="Qualifications"
                fullWidth
                variant="outlined"
                value={teacherDetails.qualification || ''}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            {Object.entries(subjectsByClass).map(([className, subjects], index) => (
              <Grid item xs={12} key={index}>
                <Typography variant="h8">
                  {className}: {subjects.join(', ')}
                </Typography>
              </Grid>
            ))}
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="salary"
                name="salary"
                label="Salary"
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="bankName"
                name="bankName"
                label="Bank Name"
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="bankAccount"
                name="bankAccount"
                label="Bank Account"
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </div>
  );
};

export default PayrollForm;