import React, { useContext, useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Chip from '@material-ui/core/Chip';
import Box from '@material-ui/core/Box';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import { GlobalStateContext } from '../../../../../../../GlobalStateContext';
import BaseUrl from '../../../../../../../config';
import HashLoader from 'react-spinners/HashLoader';
import Autocomplete from '@material-ui/lab/Autocomplete'; // Import Autocomplete component

const useStyles = makeStyles((theme) => ({
  formContainer: {},
  mainContainer: {
    overflow: 'hidden',
    maxHeight: '100vh',
  },
  gridContainer: {
    maxWidth: '100%',
    margin: '16px auto',
  },
  field: {
    marginLeft: theme.spacing(2),
    width: '92%',
  },
  gradeSpecialization: {
    marginBottom: '10px',
  },
  gradeField: {
    marginLeft: theme.spacing(3.5),
    width: '90%',
  },
  menuItem: {
    backgroundColor: '#f0f0f0',
    '&:hover': {
      backgroundColor: '#d0d0d0',
    },
  },
  chip: {
    height: '20px',
  },
  chipBox: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
  },
  addIconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'left',
    },
    transformOrigin: {
      vertical: 'top',
      horizontal: 'left',
    },
  },
};

const StaffProfessionalInfo = ({ formData, setFormData }) => {
  const classes = useStyles();
  const { globalData } = useContext(GlobalStateContext);
  const [schoolInfo, setSchoolInfo] = useState({ Subjects: [], Grades: [], Positions: [] });
  const qualifications = ['Matriculation', '12th or Diploma', 'Graduation', 'Post Graduation', 'Other'];
  const [formValues, setFormValues] = useState({
    ...formData.professionalInfo,
    position: formData.professionalInfo.position || [],
    grades: formData.professionalInfo.grades && formData.professionalInfo.grades.length > 0 ? formData.professionalInfo.grades : [{ value: '', subjects: [] }],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchoolInfo = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BaseUrl}/schoolinfo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ SchoolId: globalData.data.SCHOOL_ID }),
        });

        if (!response.ok) {
          const text = await response.text();
          console.error('Error fetching school info:', text);
          throw new Error('Failed to fetch school info');
        }

        const data = await response.json();
        console.log('Fetched school info:', data);

        const Grades = [];
        const gradeLevelFrom = parseInt(data.data.GradeLevelFrom.match(/\d+/)[0], 10);
        const gradeLevelTo = parseInt(data.data.GradeLevelTo.match(/\d+/)[0], 10);

        for (let i = gradeLevelFrom; i <= gradeLevelTo; i++) {
          Grades.push({ value: i, label: `Class ${i}` });
        }

        const Positions = [
          ...data.data.TeachingStaff.map((staff) => ({ value: staff, label: staff })),
          ...data.data.NonTeachingStaff.map((staff) => ({ value: staff, label: staff })),
        ];

        setSchoolInfo({ 
          Subjects: data.data.Subjects, 
          Grades, 
          Positions 
        });
      } catch (error) {
        console.error('Error fetching school info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolInfo();
  }, [globalData.data.SCHOOL_ID]);

  const validateField = (name, value) => {
    let error = '';
    if (['certifications', 'qualification'].includes(name)) {
      if (!/^[a-zA-Z\s]+$/.test(value)) {
        error = 'Only alphabets are allowed';
      }
    }
    return error;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    let error = validateField(name, value);

    if (!value) {
      error = 'This field is required';
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    const updatedValue = name === 'experience' ? parseInt(value, 10) : value;

    const updatedFormValues = { ...formValues, [name]: updatedValue };
    setFormValues(updatedFormValues);
    setFormData((prevData) => ({
      ...prevData,
      professionalInfo: updatedFormValues,
    }));
  };

  const handlePositionChange = (event) => {
    const { value, checked } = event.target;
    let updatedPositions = [...formValues.position];

    if (checked) {
      updatedPositions.push(value);
    } else {
      updatedPositions = updatedPositions.filter((position) => position !== value);
    }

    setFormValues((prevValues) => ({
      ...prevValues,
      position: updatedPositions,
    }));
    setFormData((prevData) => ({
      ...prevData,
      professionalInfo: {
        ...prevData.professionalInfo,
        position: updatedPositions,
      },
    }));
  };

  const handleGradeChange = (event, index) => {
    const { value } = event.target;
    const updatedGrades = formValues.grades.map((grade, i) => (i === index ? { ...grade, value } : grade));
    setFormValues((prevValues) => ({
      ...prevValues,
      grades: updatedGrades,
    }));
    setFormData((prevData) => ({
      ...prevData,
      professionalInfo: {
        ...prevData.professionalInfo,
        grades: updatedGrades,
      },
    }));
  };

  const handleSubjectChange = (event, grade) => {
    const { value } = event.target;
    const updatedGrades = formValues.grades.map((g) => (g.value === grade ? { ...g, subjects: value } : g));

    setFormValues((prevValues) => ({
      ...prevValues,
      grades: updatedGrades,
    }));
    setFormData((prevData) => ({
      ...prevData,
      professionalInfo: {
        ...prevData.professionalInfo,
        grades: updatedGrades,
      },
    }));
  };

  const addGrade = () => {
    const newGrade = { value: '', subjects: [] };
    setFormValues((prevValues) => ({
      ...prevValues,
      grades: [...prevValues.grades, newGrade],
    }));
  };

  const deleteGrade = (index) => {
    const updatedGrades = formValues.grades.filter((_, i) => i !== index);
    setFormValues((prevValues) => ({
      ...prevValues,
      grades: updatedGrades,
    }));
  };

  return (
    <div className={classes.mainContainer}>
      {loading && (
        <div className="loaderContainer">
          <HashLoader color="#ffffff" size={50} />
        </div>
      )}
      {!loading && (
        <form className={classes.formContainer}>
          <Grid container spacing={3} className={classes.gridContainer}>
            <Grid item xs={12} sm={12}>
              <FormControl component="fieldset" className="urbanist-font" style={{ marginBottom: '0px' }}>
                <label style={{ marginBottom: '12px' }}>Position / Role :</label>
                <FormGroup>
                  <Grid container spacing={1} className={`${classes.field} urbanist-font`}>
                    {schoolInfo.Positions.map((option) => (
                      <Grid item key={option.value}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formValues.position.includes(option.value)}
                              onChange={handlePositionChange}
                              value={option.value}
                            />
                          }
                          label={option.label}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </FormGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} className={classes.addIconContainer}>
              <label style={{ marginBottom: '12px' }} className='urbanist-font' gutterBottom>
                Grade-wise Subject Selection:
              </label>
              <IconButton onClick={addGrade}>
                <AddIcon />
              </IconButton>
            </Grid>

            {formValues.grades.map((grade, index) => (
              <Grid container spacing={3} key={index} className={classes.gradeSpecialization}>
                <Grid item xs={12} sm={6}  >
                  <TextField
                    id={`grade-${index}`}
                    select
                    label="Grade"
                    name={`grade-${index}`}
                    value={grade.value}
                    onChange={(e) => handleGradeChange(e, index)}
                    fullWidth
                    required
                    className={`${classes.gradeField} urbanist-font`} 
                  >
                    {schoolInfo.Grades.map((option) => (
                      <MenuItem key={option.value} value={option.value} className={classes.menuItem}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} style={{ display: 'flex', alignItems: 'center' }}>
                  <FormControl className={classes.field}>
                    <Autocomplete
                      multiple
                      id={`subject-${index}`}
                      options={schoolInfo.Subjects}
                      value={grade.subjects || []}
                      onChange={(event, newValue) => handleSubjectChange({ target: { value: newValue } }, grade.value)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="standard"
                          label="Subjects"
                          placeholder="Select subjects"
                        />
                      )}
                      renderTags={(selected, getTagProps) =>
                        selected.map((value, index) => (
                          <Chip key={value} label={value} {...getTagProps({ index })} className={classes.chip} />
                        ))
                      }
                    />
                  </FormControl>
                  <IconButton onClick={() => deleteGrade(index)} disabled={formValues.grades.length === 1}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}

            <Grid item xs={12} sm={6}>
              <TextField
                id="experience"
                label="Years of Teaching Experience"
                name="experience"
                value={formValues.experience}
                onChange={handleChange}
                fullWidth
                type="number"
                className={`${classes.field} urbanist-font`}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                id="qualification"
                label="Qualification"
                name="qualification"
                value={formValues.qualification}
                onChange={handleChange}
                fullWidth
                required
                className={`${classes.field} urbanist-font`}
              >
                {qualifications.map((qualification) => (
                  <MenuItem key={qualification} value={qualification}>
                    {qualification}
                  </MenuItem>
                ))}
              </TextField>
              {formValues.qualification === 'Other' && (
                <TextField
                  id="otherQualification"
                  name="otherQualification"
                  label="Please specify"
                  fullWidth
                  value={formValues.otherQualification || ''}
                  onChange={handleChange}
                  className={`${classes.field} urbanist-font`}
                  error={!!errors.otherQualification}
                  helperText={errors.otherQualification}
                />
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                id="certifications"
                label="Certifications (Teaching / Training)"
                name="certifications"
                value={formValues.certifications}
                onChange={handleChange}
                fullWidth
                className={`${classes.field} urbanist-font`}
                error={!!errors.certifications}
                helperText={errors.certifications}
              />
            </Grid>
          </Grid>
        </form>
      )}
    </div>
  );
};

export default StaffProfessionalInfo;