import React, { useContext, useState, useEffect } from 'react';
import { GlobalStateContext } from '../../../../../../GlobalStateContext';
import Navbar from '../../Navbar/Navbar';
import Sidebar from '../../Sidebar/Sidebar';
import { Grid, Card, CardContent, Typography, Checkbox, FormControlLabel, Select, MenuItem, Box, IconButton, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import './subjectAllocation.css';

const SubjectAllocation = () => {
  const { globalData } = useContext(GlobalStateContext);
  const [selectedGrade, setSelectedGrade] = useState('Select Grade');
  const [selectedSubject, setSelectedSubject] = useState('Select Subject');
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState({});
  const [allottedTeachers, setAllottedTeachers] = useState({});

  const handleGradeChange = (event) => {
    setSelectedGrade(event.target.value);
  };

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
  };

  const handleTeacherChange = (event, grade, subject) => {
    const teacherName = event.target.value;
    if (Object.keys(allottedTeachers).length >= 6 && !allottedTeachers[grade]) {
      alert('You can only allot teachers to 6 classes at a time');
      return;
    }
    setSelectedTeacher((prev) => ({
      ...prev,
      [grade]: {
        ...prev[grade],
        [subject]: teacherName,
      },
    }));
    setAllottedTeachers((prev) => ({
      ...prev,
      [grade]: {
        ...prev[grade],
        [subject]: teacherName,
      },
    }));
  };

  const handleDeleteSubjectTeacher = (grade, subject) => {
    setAllottedTeachers((prev) => {
      const updatedGrade = { ...prev[grade] };
      delete updatedGrade[subject];
      if (Object.keys(updatedGrade).length === 0) {
        const { [grade]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [grade]: updatedGrade };
    });
  };

  const handleCloseCard = (grade) => {
    setAllottedTeachers((prev) => {
      const { [grade]: _, ...rest } = prev;
      return rest;
    });
  };

  useEffect(() => {
    if (selectedGrade !== 'Select Grade' && selectedSubject !== 'Select Subject') {
      const fetchedTeachers = [
        { id: 1, name: 'Teacher A' },
        { id: 2, name: 'Teacher B' },
        { id: 3, name: 'Teacher C' },
      ];
      setTeachers(fetchedTeachers);
    } else {
      setTeachers([]);
    }
  }, [selectedGrade, selectedSubject]);

  return (
    <div className="subject-allocation-container">
      <Navbar schoolName={globalData.data.SCHOOL_NAME} schoolLogo={globalData.data.SCHOOL_LOGO} />
      <div className="subject-allocation-content">
        <Sidebar visibleItems={['home', 'attachDocument', 'subjectAllocation', 'attendanceTracking', 'leaveApprovals', 'academicPerformance', 'teacherAlert', 'eventPlanning', 'careerGuidance', 'inventoryManagement']} />
        <main className="content">
          <div className="button-container">
            <Select className="custom-select" value={selectedGrade} onChange={handleGradeChange} displayEmpty>
              <MenuItem value="Select Grade">Select Grade</MenuItem>
              {Array.from({ length: 12 }, (_, i) => (
                <MenuItem key={i + 1} value={`Class-${i + 1}`}>{`Class-${i + 1}`}</MenuItem>
              ))}
            </Select>
            <Select className="custom-select" value={selectedSubject} onChange={handleSubjectChange} displayEmpty>
              <MenuItem value="Select Subject">Select Subject</MenuItem>
              {['Math', 'Science', 'English', 'History', 'Geography'].map((subject, index) => (
                <MenuItem key={index} value={subject}>{subject}</MenuItem>
              ))}
            </Select>
          </div>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4} sx={{ mt: 4 }}>
              {teachers.length > 0 && (
                <div className="teacher-list">
                  <h3>Available Teachers</h3>
                  <ul>
                    {teachers.map((teacher) => (
                      <li key={teacher.id}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              value={teacher.name}
                              checked={selectedTeacher[selectedGrade]?.[selectedSubject] === teacher.name}
                              onChange={(e) => handleTeacherChange(e, selectedGrade, selectedSubject)}
                            />
                          }
                          label={teacher.name}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={2} className="allotted-teachers-cards">
                {Object.keys(allottedTeachers).map((grade) => (
                  <Grid item xs={12} sm={6} md={4} key={grade}>
                    <Card className="allotted-teacher-card custom-card" sx={{ width: 240, height: 268 }}>
                      <CardContent>
                        <Box className='grade' display="flex" justifyContent="space-between" alignItems="center">
                          <Typography className='grade-text' variant="h5">{grade}</Typography>
                          <IconButton onClick={() => handleCloseCard(grade)}>
                            <CloseIcon className='icons' />
                          </IconButton>
                        </Box>
                        <Box mt={2}>
                          {Object.keys(allottedTeachers[grade]).map((subject) => (
                            <Box className='subjects' key={subject} display="flex" alignItems="center" justifyContent="space-between">
                              <Typography className='subjects-text'>{subject}: {allottedTeachers[grade][subject]}</Typography>
                              <IconButton onClick={() => handleDeleteSubjectTeacher(grade, subject)}>
                                <DeleteIcon className='icons'/>
                              </IconButton>
                            </Box>
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
          <Box position="absolute" bottom={16} left={16}>
            <Button className="custom-submit-button" >
              Submit
            </Button>
          </Box>
        </main>
      </div>
      <div className="school-id-box">
        School ID: {globalData.data.SCHOOL_ID}
      </div>
    </div>
  );
};

export default SubjectAllocation;