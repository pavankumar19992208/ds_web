import React, { useState, useContext, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';
import Navbar from '../../Navbar/Navbar';
import Sidebar from '../../Sidebar/Sidebar';
import { GlobalStateContext } from '../../../../../../GlobalStateContext';
import './schoolInternalData.css';
import BaseUrl from '../../../../../../config';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import LinearProgress from '@mui/material/LinearProgress'; // Import LinearProgress
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  formContainer: {},

  gridContainer: {
    maxWidth: '100%',
    margin: '32px auto',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    margin: '24px auto',
  },
  button: {
    margin: '24px 0 0 8px',
  },
  schoolProfileTitle: {
    margin: '0 0 -24px',
    color: '#3f51b5',
    fontSize: '1rem',    
  },
  gradeLevelsTitle: {
    margin: '16px 0 -24px',
    color: '#3f51b5',
    fontSize: '1rem',
  },
  totalSectionsTitle: {
    margin: '16px 0 -24px',
    color: '#3f51b5',
    fontSize: '1rem',
  },
  academicYearTitle: {
    marginTop: 16,
    color: '#3f51b5',
    fontSize: '1rem',
  },
  schoolTimingTitle: {
    marginTop: 16,
    color: '#3f51b5',
    fontSize: '1rem',
  },
  extraCircularProgramsTitle: {
    marginTop: 16,
    color: '#3f51b5',
    fontSize: '1rem',
  },
  feeStructureTitle: {
    marginTop: 16,
    color: '#3f51b5',
    fontSize: '1rem',
  },
  staffRolesTitle: {
    marginTop: 16,
    marginBottom: -24,
    color: '#3f51b5',
    fontSize: '1rem',
  },
  staffRolesHeading: {
    marginTop: 16,
    color: '#3f51b5',
    fontSize: '0.9rem',
  },
  totalAmount: {
    marginTop: 16,
    fontWeight: 'bold',
  },
  field: {
    marginLeft: 16,
    width: '92%',
  },
  feeTypeTitle: {
    marginLeft: 4,
    width: '90%',
  },
}));

const SchoolInternalData = () => {
  const classes = useStyles();
  const { globalData, setGlobalData } = useContext(GlobalStateContext);
  const [state, setState] = useState('');
  const [schoolType, setSchoolType] = useState('');
  const [schoolTypes, setSchoolTypes] = useState([]);
  const [curriculum, setCurriculum] = useState('');
  const [otherCurriculum, setOtherCurriculum] = useState('');
  const [gradeLevel1, setGradeLevel1] = useState('');
  const [gradeLevel2, setGradeLevel2] = useState('');
  const [subjects, setSubjects] = useState(['']);
  const [medium, setMedium] = useState('');
  const [academicYearStart, setAcademicYearStart] = useState('');
  const [academicYearEnd, setAcademicYearEnd] = useState('');
  const [extraPrograms, setExtraPrograms] = useState(['']);
  const [schoolTimingFrom, setSchoolTimingFrom] = useState('');
  const [schoolTimingTo, setSchoolTimingTo] = useState('');
  const [examPattern, setExamPattern] = useState('');
  const [examPatterns, setExamPatterns] = useState([]);
  const [otherExamPattern, setOtherExamPattern] = useState('');
  const [assessmentCriteria, setAssessmentCriteria] = useState('');
  const [otherAssessmentCriteria, setOtherAssessmentCriteria] = useState('');
  const [feeStructure, setFeeStructure] = useState([{ feeType: '', amount: '' }]);
  const [sections, setSections] = useState('');
  const [loading, setLoading] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [error, setError] = useState(null);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [teachingRoles, setTeachingRoles] = useState([]);
  const [nonTeachingRoles, setNonTeachingRoles] = useState([]);
  const [teachingStaff, setTeachingStaff] = useState([]);
  const [nonTeachingStaff, setNonTeachingStaff] = useState([]);
  const [activities, setActivities] = useState([]);
  const handleStateChange = (event) => {
    setState(event.target.value);
  };

  // const handleSubjectChange = (index, value) => {
  //   const newSubjects = [...subjects];
  //   newSubjects[index] = value;
  //   setSubjects(newSubjects);
  // };

  const [numberOfTerms, setNumberOfTerms] = useState('');

  const addSubject = () => {
    setSubjects([...subjects, '']);
  };

  const deleteSubject = (index) => {
    if (subjects.length > 1) {
      const newSubjects = subjects.filter((_, i) => i !== index);
      setSubjects(newSubjects);
    }
  };

  const handleExtraProgramChange = (index, value) => {
    const newPrograms = [...extraPrograms];
    newPrograms[index] = value;
    setExtraPrograms(newPrograms);
  };

  const addExtraProgram = () => {
    setExtraPrograms([...extraPrograms, '']);
  };

  const deleteExtraProgram = (index) => {
    if (extraPrograms.length > 1) {
      const newPrograms = extraPrograms.filter((_, i) => i !== index);
      setExtraPrograms(newPrograms);
    }
  };

  const handleFeeStructureChange = (index, field, value) => {
    const newFeeStructure = [...feeStructure];
    newFeeStructure[index][field] = value;
    setFeeStructure(newFeeStructure);
  };

  const addFeeStructure = () => {
    setFeeStructure([...feeStructure, { feeType: '', amount: '' }]);
  };

  const deleteFeeStructure = (index) => {
    if (feeStructure.length > 1) {
      const newFeeStructure = feeStructure.filter((_, i) => i !== index);
      setFeeStructure(newFeeStructure);
    }
  };

  // const handleTeachingStaffChange = (index, value) => {
  //   const newTeachingStaff = [...teachingStaff];
  //   newTeachingStaff[index] = value;
  //   setTeachingStaff(newTeachingStaff);
  // };

  const addTeachingStaff = () => {
    setTeachingStaff([...teachingStaff, '']);
  };

  const deleteTeachingStaff = (index) => {
    if (teachingStaff.length > 1) {
      const newTeachingStaff = teachingStaff.filter((_, i) => i !== index);
      setTeachingStaff(newTeachingStaff);
    }
  };

  // const handleNonTeachingStaffChange = (index, value) => {
  //   const newNonTeachingStaff = [...nonTeachingStaff];
  //   newNonTeachingStaff[index] = value;
  //   setNonTeachingStaff(newNonTeachingStaff);
  // };

  const addNonTeachingStaff = () => {
    setNonTeachingStaff([...nonTeachingStaff, '']);
  };

  const deleteNonTeachingStaff = (index) => {
    if (nonTeachingStaff.length > 1) {
      const newNonTeachingStaff = nonTeachingStaff.filter((_, i) => i !== index);
      setNonTeachingStaff(newNonTeachingStaff);
    }
  };


  const calculateTotalAmount = () => {
    return feeStructure.reduce((total, fee) => {
      const amount = parseFloat(fee.amount) || 0;
      return total + amount;
    }, 0);
  };

  const validateForm = () => {
    if (!schoolType || !curriculum || !medium || !academicYearStart || !academicYearEnd || !schoolTimingFrom || !schoolTimingTo || !examPattern || !assessmentCriteria || !numberOfTerms || !gradeLevel1 || !gradeLevel2) {
      alert('Please fill out all required fields.');
      return false;
    }

    if (curriculum === 'stateboard' && !state) {
      alert('Please select a state.');
      return false;
    }

    if (curriculum === 'other' && !otherCurriculum) {
      alert('Please specify the other curriculum.');
      return false;
    }

    if (examPattern === 'other' && !otherExamPattern) {
      alert('Please specify the other exam pattern.');
      return false;
    }

    if (assessmentCriteria === 'other' && !otherAssessmentCriteria) {
      alert('Please specify the other assessment criteria.');
      return false;
    }

    if (subjects.some(subject => !subject)) {
      alert('Please fill out all subjects.');
      return false;
    }

    if (feeStructure.some(fee => !fee.feeType || !fee.amount)) {
      alert('Please fill out all fee structures.');
      return false;
    }

    if (teachingStaff.some(staff => !staff)) {
      alert('Please fill out all teaching staff.');
      return false;
    }

    if (nonTeachingStaff.some(staff => !staff)) {
      alert('Please fill out all non-teaching staff.');
      return false;
    }

    return true;
  };

  const generateClassList = (from, to) => {
    const gradeLevels = [
      'Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
      'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'
    ];
    const fromIndex = gradeLevels.indexOf(from);
    const toIndex = gradeLevels.indexOf(to);
    return gradeLevels.slice(fromIndex, toIndex + 1);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);  
      // Prepare complete payload
      const payload = {
        school_id: globalData.data.school_id,
        school_type: schoolType,
        curriculum: curriculum,
        medium: medium,
        assessment_criteria: assessmentCriteria,
        academic_year_start: academicYearStart,
        academic_year_end: academicYearEnd,
        school_timing_from: schoolTimingFrom,
        school_timing_to: schoolTimingTo,
        exam_pattern: examPattern,
        // Include other_exam_pattern only if "other" is selected
        ...(examPattern === 'other' && { other_exam_pattern: otherExamPattern }),
        // Include state only if curriculum is "stateboard"
        ...(curriculum === 'stateboard' && { state: state }),
        // Include other_curriculum only if curriculum is "other"
        ...(curriculum === 'other' && { other_curriculum: otherCurriculum }),
        ...(assessmentCriteria === 'other' && { other_assessment_criteria: otherAssessmentCriteria }),
      };
  
      console.log("Final payload:", payload);
  
      // Send the payload to the backend
      const response = await axios.post(`${BaseUrl}/schooldata`, payload);
  
      if (response.data) {
        setSuccessDialogOpen(true);
        console.log("Submission successful:", response.data);
      }
    } catch (error) {
      console.error("Submission error:", {
        error: error.message,
        response: error.response?.data,
      });
      alert(`Submission failed: ${error.response?.data?.detail || error.message}`);
    } finally {
      setLoading(false);
    }
  };
    
  // Helper function to generate grades offered array
  const getGradesOffered = () => {
    const grades = [];
    const fromIndex = gradeLevels.indexOf(gradeLevel1);
    const toIndex = gradeLevels.indexOf(gradeLevel2);
    
    if (fromIndex >= 0 && toIndex >= 0 && fromIndex <= toIndex) {
      for (let i = fromIndex; i <= toIndex; i++) {
        grades.push(gradeLevels[i]);
      }
    }
    
    return grades;
  };

  const handleSuccessClose = () => {
    setSuccessDialogOpen(false);
  };


  const statesOfIndia = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  const gradeLevels = [
    'Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
    'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'
  ];

  // useEffect(() => {
  //   const fetchSchoolData = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await fetch(`${BaseUrl}/schoolinfo`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ SchoolId: globalData.data.SCHOOL_ID }),
  //       });

  //       if (!response.ok) {
  //         throw new Error('Failed to fetch school data');
  //       }

  //       const data = await response.json();
  //       const schoolData = data.data;

  //       setState(schoolData.State);
  //       setSchoolType(schoolData.SchoolType);
  //       setCurriculum(schoolData.Curriculum);
  //       setOtherCurriculum(schoolData.OtherCurriculum);
  //       setGradeLevel1(schoolData.GradeLevelFrom);
  //       setGradeLevel2(schoolData.GradeLevelTo);
  //       setSubjects(schoolData.Subjects);
  //       setMedium(schoolData.Medium);
  //       setAcademicYearStart(schoolData.AcademicYearStart);
  //       setAcademicYearEnd(schoolData.AcademicYearEnd);
  //       setExtraPrograms(schoolData.ExtraPrograms);
  //       // setSchoolTimingFrom(schoolData.SchoolTimingFrom);
  //       // setSchoolTimingTo(schoolData.SchoolTimingTo);
  //       setExamPattern(schoolData.ExamPattern);
  //       setOtherExamPattern(schoolData.OtherExamPattern);
  //       setAssessmentCriteria(schoolData.AssessmentCriteria);
  //       setOtherAssessmentCriteria(schoolData.OtherAssessmentCriteria);
  //       setFeeStructure(schoolData.FeeStructure);
  //       setTeachingStaff(schoolData.TeachingStaff);
  //       setNonTeachingStaff(schoolData.NonTeachingStaff);
  //       setSections(schoolData.SectionsCount);
  //     } catch (error) {
  //       console.error('Error fetching school data:', error);
  //     }
  //   };

  //   fetchSchoolData();
  // }, [globalData.data.school_id]);

  useEffect(() => {
    const fetchSchoolTypes = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${BaseUrl}/active-school-types`);
        if (response.data && response.data.school_types) {
          setSchoolTypes(response.data.school_types);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        setError("Failed to load school types");
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchSchoolTypes();
  }, []);

  useEffect(() => {
    const fetchExamPatterns = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/active-exam-patterns`);
        setExamPatterns(response.data.exam_patterns);
      } catch (error) {
        console.error('Error fetching exam patterns:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExamPatterns();
  }, []);
  
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/active-subjects`);
        setAvailableSubjects(response.data.subjects);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleSubjectChange = (event) => {
    setSelectedSubjects(event.target.value);
  };

  const handleDeleteSubject = (subjectToDelete) => () => {
    setSelectedSubjects(selectedSubjects.filter(subject => subject.id !== subjectToDelete.id));
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/staff-roles`);
        setTeachingRoles(response.data.teaching_roles);
        setNonTeachingRoles(response.data.non_teaching_roles);
      } catch (error) {
        console.error('Error fetching staff roles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/active-activities`);
        setActivities(response.data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };
  
    fetchActivities();
  }, []);

  const handleTeachingStaffChange = (event, value) => {
    setTeachingStaff(value);
  };

  const handleNonTeachingStaffChange = (event, value) => {
    setNonTeachingStaff(value);
  };

  const handleDeleteTeachingStaff = (roleToDelete) => () => {
    setTeachingStaff(teachingStaff.filter(role => role.id !== roleToDelete.id));
  };

  const handleDeleteNonTeachingStaff = (roleToDelete) => () => {
    setNonTeachingStaff(nonTeachingStaff.filter(role => role.id !== roleToDelete.id));
  };

  // In your render:
  {loading && <div>Loading school types...</div>}
  {error && <div style={{color: 'red'}}>{error}</div>}

  return (
    <div className='data-form'>
    <div className='school-internal-data'>
      <Navbar schoolName={globalData.data.school_name} schoolLogo={globalData.data.school_logo} />
      <Sidebar visibleItems={['home']} hideProfile={true} showTitle={false} />
      <div className="form-paper-container">
        <Paper className="paper">
          {loading && <LinearProgress/>}
          <Typography 
            component="h1" 
            variant="h4" 
            align="center"
            className="school-information-title"
          >
            School Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} style={{ marginTop: '24px' }}>
              <Typography 
                variant="h6" 
                className="school-name"
              >
                {globalData.data.school_name}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} style={{ textAlign: 'right', marginTop: '24px' }}>
              <Typography 
                variant="h6" 
                className="school-id"
              >
                School ID: {globalData.data.school_id}
              </Typography>
            </Grid>
          </Grid>
          
          <Grid container spacing={3} className={`${classes.formContainer} ${classes.gridContainer}`}>
            <Grid item xs={12}>
              <Typography variant="h6" className={`${classes.schoolProfileTitle} urbanist-font`}>School Profile :</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="school_type"
                name="school_type"
                label="Type of School"
                select
                fullWidth
                value={schoolType}
                onChange={(e) => setSchoolType(e.target.value)}
                className={`${classes.field} urbanist-font`}
              >
                <MenuItem value="">Select</MenuItem>
                {schoolTypes.map((type) => (
                  <MenuItem key={type.name} value={type.name}>
                    {`${type.name} (${type.grades})`}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="curriculum"
                name="curriculum"
                label="Curriculum / Syllabus"
                select
                fullWidth
                value={curriculum}
                onChange={(e) => setCurriculum(e.target.value)}
                className={`${classes.field} urbanist-font`}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="stateboard">Stateboard</MenuItem>
                <MenuItem value="ncert">NCERT</MenuItem>
                <MenuItem value="cbse">CBSE</MenuItem>
                <MenuItem value="icse">ICSE</MenuItem>
                <MenuItem value="ib">IB</MenuItem>
                <MenuItem value="cambridge">Cambridge</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
              {curriculum === 'stateboard' && (
                <TextField
                  required
                  id="state"
                  name="state"
                  label="Choose State"
                  select
                  fullWidth
                  value={state}
                  onChange={handleStateChange}
                  className={`${classes.field} urbanist-font`}
                  style={{ marginTop: '16px' }}
                >
                  <MenuItem value="">Select</MenuItem>
                  {statesOfIndia.map((state, index) => (
                    <MenuItem key={index} value={state}>{state}</MenuItem>
                  ))}
                </TextField>
              )}
              {curriculum === 'other' && (
                <TextField
                  required
                  id="other_curriculum"
                  name="other_curriculum"
                  label="Specify Other Curriculum"
                  fullWidth
                  value={otherCurriculum}
                  onChange={(e) => setOtherCurriculum(e.target.value)}
                  className="urbanist-font"
                  style={{ marginTop: '16px' }}
                />
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="medium"
                name="medium"
                label="Medium of Instruction"
                select
                fullWidth
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                className={`${classes.field} urbanist-font`}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="hindi">Hindi</MenuItem>
                <MenuItem value="telugu">Telugu</MenuItem>
                <MenuItem value="english">English</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="exam_pattern"
                name="exam_pattern"
                label="Examination Pattern"
                select
                fullWidth
                value={examPattern}
                onChange={(e) => setExamPattern(e.target.value)}
                className={`${classes.field} urbanist-font`}
                disabled={loading}
              >
                <MenuItem value="">Select</MenuItem>
                {examPatterns.map((pattern) => (
                  <MenuItem key={pattern.id} value={String(pattern.id)}>
                  {`${pattern.name} (${pattern.term}, ${pattern.grading})`}
                  </MenuItem>
                ))}
                <MenuItem value="other">Other (Specify)</MenuItem>
              </TextField>
              
              {examPattern === 'other' && (
                <TextField
                  required
                  id="other_exam_pattern"
                  name="other_exam_pattern"
                  label="Specify Other Exam Pattern"
                  fullWidth
                  value={otherExamPattern}
                  onChange={(e) => setOtherExamPattern(e.target.value)}
                  className="urbanist-font"
                  style={{ marginTop: '16px' }}
                />
              )}
            </Grid>
                        <Grid item xs={12} sm={6}>
              <TextField
                required
                id="assessment_criteria"
                name="assessment_criteria"
                label="Assessment Criteria"
                select
                fullWidth
                value={assessmentCriteria}
                onChange={(e) => setAssessmentCriteria(e.target.value)}
                className={`${classes.field} urbanist-font`}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="percentage">Percentage %</MenuItem>
                <MenuItem value="grades">Grades</MenuItem>
                <MenuItem value="gpa">GPA</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
              {assessmentCriteria === 'other' && (
                <TextField
                  required
                  id="other_assessment_criteria"
                  name="other_assessment_criteria"
                  label="Specify Other Assessment Criteria"
                  fullWidth
                  value={otherAssessmentCriteria}
                  onChange={(e) => setOtherAssessmentCriteria(e.target.value)}
                  className="urbanist-font"
                  style={{ marginTop: '16px' }}
                />
              )}
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <TextField
                required
                id="number_of_terms"
                name="number_of_terms"
                label="Number of Terms"
                type="number"
                fullWidth
                value={numberOfTerms}
                onChange={(e) => setNumberOfTerms(e.target.value)}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                className={`${classes.field} urbanist-font`}
              />
            </Grid> */}
  
            <Grid item xs={12} sm={12}>
              <Typography variant="h6" className={`${classes.extraCircularProgramsTitle} urbanist-font`}>
                Subjects Taught:
              </Typography>
              
              <FormControl fullWidth className={classes.field}>
                <InputLabel id="subjects_label">Select Subjects</InputLabel>
                <Select
                  labelId="subjects_label"
                  id="subjects_select"
                  multiple
                  value={selectedSubjects}
                  onChange={handleSubjectChange}
                  renderValue={(selected) => (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {selected.map((subject) => (
                        <Chip
                          key={subject.id}
                          label={`${subject.name} (${subject.code})`}
                          onDelete={handleDeleteSubject(subject)}
                          onMouseDown={(event) => event.stopPropagation()}
                        />
                      ))}
                    </div>
                  )}
                >
                  {availableSubjects.map((subject) => (
                    <MenuItem 
                      key={subject.id} 
                      value={subject}
                      style={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <span>{subject.name}</span>
                      <span style={{ 
                        fontSize: '0.8rem', 
                        color: '#666',
                        marginLeft: '8px'
                      }}>
                        {subject.code} | {subject.type}
                      </span>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" className={`${classes.staffRolesTitle} urbanist-font`}>
                Staff Roles:
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth className={classes.field}>
                <Autocomplete
                  multiple
                  id="teaching_staff_select"
                  options={teachingRoles}
                  getOptionLabel={(option) => option.name}
                  value={teachingStaff}
                  onChange={handleTeachingStaffChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Teaching Staff Roles"
                      placeholder="Select roles"
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        key={option.id}
                        label={option.name}
                        onDelete={handleDeleteTeachingStaff(option)}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth className={classes.field}>
                <Autocomplete
                  multiple
                  id="non_teaching_staff_select"
                  options={nonTeachingRoles}
                  getOptionLabel={(option) => option.name}
                  value={nonTeachingStaff}
                  onChange={handleNonTeachingStaffChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Non-Teaching Staff Roles"
                      placeholder="Select roles"
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        key={option.id}
                        label={option.name}
                        onDelete={handleDeleteNonTeachingStaff(option)}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                />
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" className={`${classes.gradeLevelsTitle} urbanist-font`}>Grades Levels Offered :</Typography>
            </Grid>
            <Grid container item xs={12} spacing={3}>
              <Grid item xs={6}>
                <TextField
                  required
                  id="grade_level_from"
                  name="grade_level_from"
                  label="Grade From"
                  select
                  fullWidth
                  value={gradeLevel1}
                  onChange={(e) => setGradeLevel1(e.target.value)}
                  className={`${classes.field} urbanist-font`}
                >
                  <MenuItem value="">Select</MenuItem>
                  {gradeLevels.map((level, index) => (
                    <MenuItem key={index} value={level}>{level}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  id="grade_level_to"
                  name="grade_level_to"
                  label="Grade To"
                  select
                  fullWidth
                  value={gradeLevel2}
                  onChange={(e) => setGradeLevel2(e.target.value)}
                  className={`${classes.field} urbanist-font`}
                >
                  <MenuItem value="">Select</MenuItem>
                  {gradeLevels.map((level, index) => (
                    <MenuItem key={index} value={level}>{level}</MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" className={`${classes.totalSectionsTitle} urbanist-font`}>Total Sections for Each Class :</Typography>
            </Grid>
            <Grid container item xs={12} spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  id="total_sections"
                  name="total_sections"
                  label="Total Sections"
                  type="number"
                  fullWidth
                  value={sections || ''}
                  onChange={(e) => setSections(e.target.value)}
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                  className={`${classes.field} urbanist-font`}
                />
              </Grid>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" className={`${classes.academicYearTitle} urbanist-font`}>Academic Year :</Typography>
            </Grid>
            <Grid container item xs={12} spacing={3}>
              <Grid item xs={6}>
                <TextField
                  required
                  id="academic_year_start"
                  name="academic_year_start"
                  label="Academic Year Start"
                  fullWidth
                  value={academicYearStart}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setAcademicYearStart(value);
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    pattern: "\\d{4}",
                    inputMode: "numeric",
                    placeholder: "YYYY",
                    maxLength: 4
                  }}
                  className={`${classes.field} urbanist-font`}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  id="academic_year_end"
                  name="academic_year_end"
                  label="Academic Year End"
                  fullWidth
                  value={academicYearEnd}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setAcademicYearEnd(value);
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    pattern: "\\d{4}",
                    inputMode: "numeric",
                    placeholder: "YYYY",
                    maxLength: 4
                  }}
                  className={`${classes.field} urbanist-font`}
                />
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" className={`${classes.schoolTimingTitle} urbanist-font`}>School Timing :</Typography>
            </Grid>
            <Grid container item xs={12} spacing={3}>
              <Grid item xs={6}>
                <TextField
                  required
                  id="school_timing_from"
                  name="school_timing_from"
                  label="School Timing From"
                  type="time"
                  fullWidth
                  value={schoolTimingFrom}
                  onChange={(e) => setSchoolTimingFrom(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  className={`${classes.field} urbanist-font`}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  id="school_timing_to"
                  name="school_timing_to"
                  label="School Timing To"
                  type="time"
                  fullWidth
                  value={schoolTimingTo}
                  onChange={(e) => setSchoolTimingTo(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  className={`${classes.field} urbanist-font`}
                />
              </Grid>
            </Grid>
                                                <Grid item xs={12} sm={6}>
                          <Typography variant="h6" className={`${classes.extraCircularProgramsTitle} urbanist-font`}>
                            Extra Curricular Programs:
                          </Typography>
                          <FormControl fullWidth className={`${classes.field} urbanist-font`}>
                            <Autocomplete
                              multiple
                              id="extra_programs"
                              options={activities}
                              getOptionLabel={(option) => option.activity_name}
                              value={extraPrograms}
                              onChange={(event, newValue) => setExtraPrograms(newValue)}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="outlined"
                                  label="Select Extra Curricular Programs"
                                  placeholder="Add Programs"
                                />
                              )}
                              renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                  <Chip
                                    key={option.activity_id}
                                    label={option.activity_name}
                                    {...getTagProps({ index })}
                                  />
                                ))
                              }
                            />
                          </FormControl>
                        </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" className={`${classes.feeStructureTitle} urbanist-font`}>Fee Structure :</Typography>
              {feeStructure.map((fee, index) => (
                <Grid container spacing={1} key={index}>
                  <Grid item xs={4}>
                    <TextField
                      required
                      id={`fee_type_${index}`}
                      name={`fee_type_${index}`}
                      label="Fee Type"
                      fullWidth
                      value={fee.feeType}
                      onChange={(e) => handleFeeStructureChange(index, 'feeType', e.target.value)}
                      className={`${classes.feeTypeTitle} urbanist-font`}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      required
                      id={`amount_${index}`}
                      name={`amount_${index}`}
                      label="Amount"
                      fullWidth
                      value={fee.amount}
                      onChange={(e) => handleFeeStructureChange(index, 'amount', e.target.value)}
                      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                      error={isNaN(fee.amount)}
                      helperText={isNaN(fee.amount) ? 'Please enter a valid number' : ''}
                      className="urbanist-font"
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton onClick={() => deleteFeeStructure(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton onClick={addFeeStructure}>
                      <AddIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Typography variant="h6" className={`${classes.totalAmount} urbanist-font`}>
                Total Amount: ₹{calculateTotalAmount()}
              </Typography>
            </Grid>
          </Grid>
          <div className={classes.buttons}>
            <Button variant="contained" color="primary" className={`${classes.button} urbanist-font`} onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </Paper>
      </div>
      <Dialog open={successDialogOpen} onClose={handleSuccessClose}>
        <DialogTitle>Success</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The form has been successfully submitted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSuccessClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  </div>
);
};

export default SchoolInternalData;