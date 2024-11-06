import React, { useState, useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Navbar from '../../Navbar/Navbar';
import Sidebar from '../../Sidebar/Sidebar';
import { GlobalStateContext } from '../../../../../../GlobalStateContext';
import './schoolInternalData.css';
import BaseUrl from '../../../../../../config';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles((theme) => ({
  formContainer: {},
  mainContainer: {
    overflow: 'auto',
    maxHeight: '100vh',
  },
  gridContainer: {
    maxWidth: '100%',
    margin: '32px auto',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(3),
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
  gradeLevelsTitle: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(-3),
    color: '#3f51b5',
    fontSize: '1rem',
  },
  academicYearTitle: {
    marginTop: theme.spacing(2),
    color: '#3f51b5',
    fontSize: '1rem',
  },
  schoolTimingTitle: {
    marginTop: theme.spacing(2),
    color: '#3f51b5',
    fontSize: '1rem',
  },
  extraCircularProgramsTitle: {
    marginTop: theme.spacing(2),
    color: '#3f51b5',
    fontSize: '1rem',
  },
  feeStructureTitle: {
    marginTop: theme.spacing(2),
    color: '#3f51b5',
    fontSize: '1rem',
  },
  totalAmount: {
    marginTop: theme.spacing(2),
    fontWeight: 'bold',
  },
  field: {
    marginLeft: theme.spacing(2),
    width: '92%',
  },
  feeTypeTitle: {
    marginLeft: theme.spacing(0.5),
    width: '90%',
  },
}));

const SchoolInternalData = () => {
  const classes = useStyles();
  const { globalData, setGlobalData } = useContext(GlobalStateContext);
  const [state, setState] = useState('');
  const [schoolType, setSchoolType] = useState('');
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
  const [otherExamPattern, setOtherExamPattern] = useState('');
  const [assessmentCriteria, setAssessmentCriteria] = useState('');
  const [otherAssessmentCriteria, setOtherAssessmentCriteria] = useState('');
  const [feeStructure, setFeeStructure] = useState([{ feeType: '', amount: '' }]);

  const handleStateChange = (event) => {
    setState(event.target.value);
  };

  const handleSubjectChange = (index, value) => {
    const newSubjects = [...subjects];
    newSubjects[index] = value;
    setSubjects(newSubjects);
  };

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

  const calculateTotalAmount = () => {
    return feeStructure.reduce((total, fee) => {
      const amount = parseFloat(fee.amount) || 0;
      return total + amount;
    }, 0);
  };

  const handleSubmit = async () => {
    const totalAmount = calculateTotalAmount();
    const payload = {
      SchoolId: globalData.data.SCHOOL_ID,
      State: state,
      SchoolType: schoolType,
      Curriculum: curriculum,
      OtherCurriculum: otherCurriculum,
      GradeLevelFrom: gradeLevel1,
      GradeLevelTo: gradeLevel2,
      Subjects: subjects,
      Medium: medium,
      AcademicYearStart: academicYearStart,
      AcademicYearEnd: academicYearEnd,
      ExtraPrograms: extraPrograms,
      SchoolTimingFrom: schoolTimingFrom,
      SchoolTimingTo: schoolTimingTo,
      ExamPattern: examPattern,
      OtherExamPattern: otherExamPattern,
      AssessmentCriteria: assessmentCriteria,
      OtherAssessmentCriteria: otherAssessmentCriteria,
      FeeStructure: feeStructure,
      TotalAmount: totalAmount,
    };

    console.log('Payload to be sent:', payload);

    try {
      const response = await fetch(`${BaseUrl}/schoolInternalData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Form submission failed');
      }

      const data = await response.json();
      console.log('Form data sent to backend successfully:', data);

      // Update global state with subjects
      setGlobalData((prevData) => ({
        ...prevData,
        subjects: payload.Subjects,
      }));
    } catch (error) {
      console.error('Error sending form data to backend:', error);
    }
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

  return (
    <React.Fragment>
      <Navbar schoolName={globalData.data.SCHOOL_NAME} schoolLogo={globalData.data.SCHOOL_LOGO} />
      <main className={`${classes.mainContainer} layout`}>
        <Sidebar visibleItems={['home']} hideProfile={true} showTitle={false} />
        <Paper className="paper">
          <Typography component="h1" variant="h4" align="center">
            School Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} style={{ marginTop: '24px' }}>
              <Typography variant="h6" style={{ fontSize: '1rem' }}>{globalData.data.SCHOOL_NAME}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} style={{ textAlign: 'right', marginTop: '24px' }}>
              <Typography variant="h6" style={{ fontSize: '1rem' }}>School ID: {globalData.data.SCHOOL_ID}</Typography>
            </Grid>
          </Grid>

          <Grid container spacing={3} className={`${classes.formContainer} ${classes.gridContainer}`}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="schoolType"
                name="schoolType"
                label="Type of School"
                select
                fullWidth
                value={schoolType}
                onChange={(e) => setSchoolType(e.target.value)}
                className={classes.field}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="primary">Primary</MenuItem>
                <MenuItem value="highSchool">High School</MenuItem>
                <MenuItem value="higherSecondary">Higher Secondary</MenuItem>
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
                className={classes.field}
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
                  id="otherCurriculum"
                  name="otherCurriculum"
                  label="Specify Other Curriculum"
                  fullWidth
                  value={otherCurriculum}
                  onChange={(e) => setOtherCurriculum(e.target.value)}
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
                className={classes.field}
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
                id="examPattern"
                name="examPattern"
                label="Examination Pattern"
                select
                fullWidth
                value={examPattern}
                onChange={(e) => setExamPattern(e.target.value)}
                className={classes.field}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="semester">Semester Based</MenuItem>
                <MenuItem value="annual">Annual Continuous Assessment</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
              {examPattern === 'other' && (
                <TextField
                  required
                  id="otherExamPattern"
                  name="otherExamPattern"
                  label="Specify Other Exam Pattern"
                  fullWidth
                  value={otherExamPattern}
                  onChange={(e) => setOtherExamPattern(e.target.value)}
                />
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="assessmentCriteria"
                name="assessmentCriteria"
                label="Assessment Criteria"
                select
                fullWidth
                value={assessmentCriteria}
                onChange={(e) => setAssessmentCriteria(e.target.value)}
                className={classes.field}
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
                  id="otherAssessmentCriteria"
                  name="otherAssessmentCriteria"
                  label="Specify Other Assessment Criteria"
                  fullWidth
                  value={otherAssessmentCriteria}
                  onChange={(e) => setOtherAssessmentCriteria(e.target.value)}
                />
              )}
            </Grid>

            <Grid item xs={12} sm={12}>
              <Typography variant="h6" className={classes.extraCircularProgramsTitle}>Subjects Taught :</Typography>
              {subjects.map((subject, index) => (
                <Grid container spacing={1} key={index}>
                  <Grid item xs={9}>
                    <TextField
                      required
                      id={`subject${index}`}
                      name={`subject${index}`}
                      label={`Subject ${index + 1}`}
                      fullWidth
                      value={subject}
                      onChange={(e) => handleSubjectChange(index, e.target.value)}
                      className={classes.field}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton onClick={() => deleteSubject(index)} disabled={subjects.length === 1}>
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton onClick={addSubject}>
                      <AddIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" className={classes.gradeLevelsTitle}>Grades Levels Offered :</Typography>
            </Grid>
            <Grid container item xs={12} spacing={3}>
              <Grid item xs={6}>
                <TextField
                  required
                  id="gradeLevel1"
                  name="gradeLevel1"
                  label="Grade From"
                  select
                  fullWidth
                  value={gradeLevel1}
                  onChange={(e) => setGradeLevel1(e.target.value)}
                  className={classes.field}
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
                  id="gradeLevel2"
                  name="gradeLevel2"
                  label="Grade To"
                  select
                  fullWidth
                  value={gradeLevel2}
                  onChange={(e) => setGradeLevel2(e.target.value)}
                  className={classes.field}
                >
                  <MenuItem value="">Select</MenuItem>
                  {gradeLevels.map((level, index) => (
                    <MenuItem key={index} value={level}>{level}</MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" className={classes.academicYearTitle}>Academic Year :</Typography>
            </Grid>
            <Grid container item xs={12} spacing={3}>
              <Grid item xs={6}>
                <TextField
                  required
                  id="academicYearStart"
                  name="academicYearStart"
                  label="Academic Year Start"
                  type="date"
                  fullWidth
                  value={academicYearStart}
                  onChange={(e) => setAcademicYearStart(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  className={classes.field}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  id="academicYearEnd"
                  name="academicYearEnd"
                  label="Academic Year End"
                  type="date"
                  fullWidth
                  value={academicYearEnd}
                  onChange={(e) => setAcademicYearEnd(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  className={classes.field}
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" className={classes.schoolTimingTitle}>School Timing :</Typography>
            </Grid>
            <Grid container item xs={12} spacing={3}>
              <Grid item xs={6}>
                <TextField
                  required
                  id="schoolTimingFrom"
                  name="schoolTimingFrom"
                  label="School Timing From"
                  type="time"
                  fullWidth
                  value={schoolTimingFrom}
                  onChange={(e) => setSchoolTimingFrom(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  className={classes.field}
                />
              </Grid>
                <Grid item xs={6}>
                  <TextField
                    required
                    id="schoolTimingTo"
                    name="schoolTimingTo"
                    label="School Timing To"
                    type="time"
                    fullWidth
                    value={schoolTimingTo}
                    onChange={(e) => setSchoolTimingTo(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    className={classes.field}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" className={classes.extraCircularProgramsTitle}>Extra Curricular Programs :</Typography>
                {extraPrograms.map((program, index) => (
                  <Grid container spacing={1} key={index}>
                    <Grid item xs={9}>
                      <TextField
                        required
                        id={`extraProgram${index}`}
                        name={`extraProgram${index}`}
                        label={`Program ${index + 1}`}
                        fullWidth
                        value={program}
                        onChange={(e) => handleExtraProgramChange(index, e.target.value)}
                        className={classes.field}
                      />
                      
                    </Grid>
                    <Grid item xs={1}>
                      <IconButton onClick={() => deleteExtraProgram(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                    <Grid item xs={1}>
                      <IconButton onClick={addExtraProgram}>
                        <AddIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
  
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" className={classes.feeStructureTitle}>Fee Structure :</Typography>
                {feeStructure.map((fee, index) => (
                  <Grid container spacing={1} key={index}>
                    <Grid item xs={4}>
                      <TextField
                        required
                        id={`feeType${index}`}
                        name={`feeType${index}`}
                        label="Fee Type"
                        fullWidth
                        value={fee.feeType}
                        onChange={(e) => handleFeeStructureChange(index, 'feeType', e.target.value)}
                        className={classes.feeTypeTitle}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        required
                        id={`amount${index}`}
                        name={`amount${index}`}
                        label="Amount"
                        fullWidth
                        value={fee.amount}
                        onChange={(e) => handleFeeStructureChange(index, 'amount', e.target.value)}
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        error={isNaN(fee.amount)}
                        helperText={isNaN(fee.amount) ? 'Please enter a valid number' : ''}
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
                <Typography variant="h6" className={classes.totalAmount}>
                  Total Amount: ₹{calculateTotalAmount()}
                </Typography>
              </Grid>
            </Grid>
            <div className={classes.buttons}>
              <Button variant="contained" color="primary" className={classes.button} onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          </Paper>
        </main>
      </React.Fragment>
    );
};

export default SchoolInternalData;