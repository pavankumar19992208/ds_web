import React, { useContext, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { GlobalStateContext } from '../../../../../../../GlobalStateContext'; // Adjust the import path as needed

const useStyles = makeStyles((theme) => ({
  formContainer: {},
  mainContainer: {
    overflow: 'auto',
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
  menuItem: {
    backgroundColor: '#f0f0f0',
    '&:hover': {
      backgroundColor: '#d0d0d0',
    },
  },
}));

const positions = [
  { value: 'Teacher', label: 'Teacher' },
  { value: 'Assistant Teacher', label: 'Assistant Teacher' },
  { value: 'Head of the Department', label: 'Head of the Department' },
];

const StaffProfessionalInfo = ({ formData, setFormData }) => {
  const classes = useStyles();
  const { globalData } = useContext(GlobalStateContext);
  const [formValues, setFormValues] = useState({
    ...formData.professionalInfo,
    position: formData.professionalInfo.position || [],
  });
  const [selectedSubjects, setSelectedSubjects] = useState(formData.professionalInfo.subjectSpecialization || []);
  const [errors, setErrors] = useState({});

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

    // Show error if the field is empty
    if (!value) {
      error = 'This field is required';
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    const updatedFormValues = { ...formValues, [name]: value };
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

  const handleSubjectChange = (event) => {
    const { value, checked } = event.target;
    let updatedSubjects = [...selectedSubjects];

    if (checked) {
      updatedSubjects.push(value);
    } else {
      updatedSubjects = updatedSubjects.filter((subject) => subject !== value);
    }

    setSelectedSubjects(updatedSubjects);
    setFormData((prevData) => ({
      ...prevData,
      professionalInfo: {
        ...prevData.professionalInfo,
        subjectSpecialization: updatedSubjects,
      },
    }));
  };

  return (
    <div className={classes.mainContainer}>
      <form className={classes.formContainer}>
        <Grid container spacing={3} className={classes.gridContainer}>
          <Grid item xs={12} sm={12}>
            <FormControl component="fieldset" className={`${classes.field} urbanist-font`} style={{marginBottom:'0px'}}>
              <label style={{marginBottom:'12px'}}>Position / Role :</label>
              <FormGroup>
                <Grid container spacing={1}>
                  {positions.map((option) => (
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
          <Grid item xs={12} sm={12}>
            <FormControl component="fieldset" className={`${classes.field} urbanist-font`} >
              <label>Subject Specialization :</label>
              <FormGroup style={{marginTop:'20px'}}>
                <Grid container spacing={0.2}>
                  {globalData?.subjects?.map((subject) => (
                    <Grid item xs={4} key={subject}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedSubjects.includes(subject)}
                            onChange={handleSubjectChange}
                            value={subject}
                          />
                        }
                        label={subject}
                      />
                    </Grid>
                  ))}
                </Grid>
              </FormGroup>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              id="grade"
              select
              label="Grade"
              name="grade"
              value={formValues.grade}
              onChange={handleChange}
              fullWidth
              required
              className={`${classes.field} urbanist-font`}
            >
              {globalData?.grades?.map((option) => (
                <MenuItem key={option.value} value={option.value} className={classes.menuItem}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
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
              id="qualification"
              label="Qualification"
              name="qualification"
              value={formValues.qualification}
              onChange={handleChange}
              fullWidth
              required
              className={`${classes.field} urbanist-font`}
              error={!!errors.qualification}
              helperText={errors.qualification}
            />
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
    </div>
  );
};

export default StaffProfessionalInfo;