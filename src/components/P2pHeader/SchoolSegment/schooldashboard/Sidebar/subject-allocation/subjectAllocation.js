import React, { useContext, useState, useEffect } from 'react';
import { GlobalStateContext } from '../../../../../../GlobalStateContext';
import Navbar from '../../Navbar/Navbar';
import Sidebar from '../../Sidebar/Sidebar';
import BaseUrl from '../../../../../../config';
import { Grid, Card, CardContent, Typography, Select, MenuItem, Box, IconButton, Button, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import './subjectAllocation.css';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const SubjectAllocation = () => {
  const { globalData } = useContext(GlobalStateContext);
  const [selectedSubject, setSelectedSubject] = useState('Select Subject');
  const [selectedClass, setSelectedClass] = useState('Select Class');
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState({});
  const [allottedTeachers, setAllottedTeachers] = useState({});
  const [allottedTeacherIds, setAllottedTeacherIds] = useState({});
  const [tabValue, setTabValue] = useState(0);
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGradeChange = (event) => {
    fetchTeachers(event.target.value, selectedSubject);
  };

  const handleSubjectChange = (event) => {
    const subject = event.target.value;
    console.log(`Selected subject: ${subject}`);
    setSelectedSubject(subject);
    fetchTeachers(selectedClass, subject);
  };

  const handleClassChange = (event) => {
    const grade = event.target.value;
    setSelectedClass(grade);
    fetchTeachers(grade, selectedSubject);
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
    setAllottedTeacherIds((prev) => {
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
    setAllottedTeacherIds((prev) => {
      const { [grade]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const fetchTeachers = async (grade, subject) => {
    if (grade !== 'Select Class' && subject !== 'Select Subject') {
      try {
        console.log(`Fetching teachers for grade: ${grade}, subject: ${subject}`);
        const response = await fetch(`${BaseUrl}/teachers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ SchoolId: globalData.data.SCHOOL_ID, Class: grade, Subject: subject }),
        });
  
        if (!response.ok) {
          const text = await response.text();
          console.error('Error fetching teachers:', text);
          throw new Error('Failed to fetch teachers');
        }
  
        const data = await response.json();
        console.log('Fetched teachers:', data.teachers);
        setTeachers(data.teachers || []);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    } else {
      setTeachers([]);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await fetch(`${BaseUrl}/subjects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ SchoolId: globalData.data.SCHOOL_ID }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Error fetching subjects:', text);
        throw new Error('Failed to fetch subjects');
      }

      const data = await response.json();
      setSubjects(data.subjects || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(`${BaseUrl}/classes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ SchoolId: globalData.data.SCHOOL_ID }),
        });

        if (!response.ok) {
          const text = await response.text();
          console.error('Error fetching classes:', text);
          throw new Error('Failed to fetch classes');
        }

        const data = await response.json();
        setClasses(data.classes || []);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchClasses();
    fetchSubjects();
  }, [globalData.data.SCHOOL_ID]);

  const submitAllottedTeachers = async () => {
    try {
      const response = await fetch(`${BaseUrl}/allottedteachers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ SchoolId: globalData.data.SCHOOL_ID, AllottedTeachers: allottedTeacherIds }),
      });
  
      if (!response.ok) {
        const text = await response.text();
        console.error('Error submitting allotted teachers:', text);
        throw new Error('Failed to submit allotted teachers');
      }
  
      const data = await response.json();
      console.log('Submitted allotted teachers:', data);
    } catch (error) {
      console.error('Error submitting allotted teachers:', error);
    }
  };

  const handleTeacherChange = (event, grade, subject) => {
    const teacherId = event.target.value;
    const teacherName = teachers.find(teacher => teacher.userId === teacherId)?.name || '';
    if (Object.keys(allottedTeachers).length >= 6 && !allottedTeachers[grade]) {
      alert('You can only allot teachers to 6 classes at a time');
      return;
    }
    setSelectedTeacher((prev) => ({
      ...prev,
      [grade]: {
        ...prev[grade],
        [subject]: teacherId,
      },
    }));
    setAllottedTeachers((prev) => ({
      ...prev,
      [grade]: {
        ...prev[grade],
        [subject]: teacherName,
      },
    }));
    setAllottedTeacherIds((prev) => ({
      ...prev,
      [grade]: {
        ...prev[grade],
        [subject]: teacherId,
      },
    }));
  };

  return (
    <div className="subject-allocation-container">
      <Navbar schoolName={globalData.data.SCHOOL_NAME} schoolLogo={globalData.data.SCHOOL_LOGO} />
      <Sidebar visibleItems={['home', 'attachDocument', 'subjectAllocation', 'attendanceTracking', 'leaveApprovals', 'academicPerformance', 'teacherAlert', 'eventPlanning', 'careerGuidance', 'inventoryManagement']} />
        <main className="sa-content">
          <div className="button-container">
            <Select className="custom-select" value={selectedClass} onChange={handleClassChange} displayEmpty>
              <MenuItem value="Select Class">Select Class</MenuItem>
              {classes.map((classItem, index) => (
                <MenuItem key={index} value={classItem}>{classItem}</MenuItem>
              ))}
            </Select>
            <Select className="custom-select" value={selectedSubject} onChange={handleSubjectChange} displayEmpty>
              <MenuItem value="Select Subject">Select Subject</MenuItem>
              {subjects.map((subject, index) => (
                <MenuItem key={index} value={subject}>{subject}</MenuItem>
              ))}
            </Select>
            <Select className="custom-select" value={selectedTeacher?.[selectedSubject] || ''} onChange={(e) => handleTeacherChange(e, selectedClass, selectedSubject)} displayEmpty>
              <MenuItem value="">Select Teacher</MenuItem>
              {teachers.map((teacher, index) => (
                <MenuItem key={index} value={teacher.userId}>{teacher.name}</MenuItem>
              ))}
            </Select>
          </div>
          <Box sx={{ flexGrow: 1, display: 'flex', height: '60vh', marginTop: 10 }}>
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={tabValue}
              onChange={handleTabChange}
              aria-label="Vertical tabs example"
              sx={{ borderRight: 1, borderColor: 'divider' }}
            >
              {Object.keys(allottedTeachers).map((grade, index) => (
                <Tab label={grade} {...a11yProps(index)} key={index} />
              ))}
            </Tabs>
            {Object.keys(allottedTeachers).map((grade, index) => (
              <TabPanel value={tabValue} index={index} key={index}>
                <TableContainer component={Paper} sx={{ marginLeft: '16px' }}>
                  <Table sx={{ width: '64vw' }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ padding: '8px', height: '24px' }}><strong>Subject</strong></TableCell>
                        <TableCell sx={{ padding: '8px', height: '24px' }}><strong>Teacher</strong></TableCell>
                        <TableCell sx={{ padding: '8px', height: '24px' }}><strong>Actions</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.keys(allottedTeachers[grade]).map((subject) => (
                        <TableRow key={subject}>
                          <TableCell sx={{ padding: '8px', height: '30px' }}>{subject}</TableCell>
                          <TableCell sx={{ padding: '8px', height: '30px' }}>{allottedTeachers[grade][subject]}</TableCell>
                          <TableCell sx={{ padding: '8px', height: '30px' }}>
                            <IconButton onClick={() => handleDeleteSubjectTeacher(grade, subject)}>
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>
            ))}
          </Box>
        
            <Button className="custom-submit-button" onClick={submitAllottedTeachers}>
              Submit
            </Button>
    
        </main>
      
      <div className="school-id-box">
        School ID: {globalData.data.SCHOOL_ID}
      </div>
    </div>
  );
};

export default SubjectAllocation;