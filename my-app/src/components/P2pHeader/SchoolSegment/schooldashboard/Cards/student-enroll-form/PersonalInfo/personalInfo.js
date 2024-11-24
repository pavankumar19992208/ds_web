import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import FormControl from '@mui/material/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import { storage } from '../../../../../../../components/connections/firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import './personalInfo.css';

const useStyles = makeStyles((theme) => ({
  formContainer: {
    // Removed overflow and maxHeight to fit content naturally
  },
  basicInfoMargin: {
    marginBottom: theme.spacing(-3), // Adjust the value as needed
  },
  educationalInfoMargin: {
    marginBottom: theme.spacing(-3), // Adjust the value as needed
    marginTop: theme.spacing(2),
  },
  additionalInfoMargin: {
    marginBottom: theme.spacing(-3), // Adjust the value as needed
    marginTop: theme.spacing(0),
  },
  coloredTypography: {
    color: '#3f51b5', // Set the color to the primary color of the theme
  },
  fieldMargin: {
    marginLeft: theme.spacing(2), // Add left margin to all fields
    marginRight: theme.spacing(2), // Add right margin to all fields
  },
  reducedWidth: {
    width: '92%', // Reduce the width of the fields
  },
  typographyMargin: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(-2),
  },
  languagesMargin: {
    marginBottom: theme.spacing(2),
  },
}));

const validateAlphabets = (value) => /^[A-Za-z\s]+$/.test(value);
const validateNumbers = (value) => /^[0-9]{0,12}$/.test(value);

export default function DetailsForm({ formData, setFormData }) {
  const classes = useStyles();
  const [fileName, setFileName] = useState(formData.personalInfo.PhotoName || '');
  const [errors, setErrors] = useState({});
  const [selectedLanguages, setSelectedLanguages] = useState(formData.personalInfo.languagesKnown || []);
  const [otherLanguage, setOtherLanguage] = useState(formData.personalInfo.otherLanguage || '');
  const [otherGender, setOtherGender] = useState(formData.personalInfo.otherGender || '');
  const languages = ['Hindi', 'Telugu', 'English', 'Other'];

  useEffect(() => {
    setFileName(formData.personalInfo.PhotoName || '');
  }, [formData.personalInfo.PhotoName]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    let isValid = true;
  
    if (['StudentName', 'PreviousSchool', 'Religion', 'Category', 'Nationality'].includes(name)) {
      isValid = validateAlphabets(value) || value === '';
    } else if (name === 'AadharNumber') {
      isValid = /^[0-9]*$/.test(value); // Ensure only numbers are entered
      if (value.length > 12) {
        isValid = false;
      }
    }
  
    if (isValid || name === 'AadharNumber') {
      setFormData((prevData) => ({
        ...prevData,
        personalInfo: {
          ...prevData.personalInfo,
          [name]: typeof value === 'string' ? value.slice(0, 12) : value, // Ensure value is a string before slicing
        },
      }));
      if (name === 'AadharNumber' && value.length !== 12) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: 'Aadhar number must be 12 digits',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: '',
        }));
      }
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: `Invalid ${name === 'AadharNumber' ? 'Aadhar number (must be 12 digits)' : 'alphabetic'} input`,
      }));
    }
  
    // Clear errors for all other fields
    Object.keys(errors).forEach((key) => {
      if (key !== name) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [key]: '',
        }));
      }
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      const { name } = event.target;
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const handleFileChange = async (event) => {
    const { name, files } = event.target;
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileData = e.target.result;
        if (fileData.startsWith('data:image/')) {
          const storageRef = ref(storage, `photos/${file.name}`);
          try {
            await uploadString(storageRef, fileData, 'data_url');
            const downloadURL = await getDownloadURL(storageRef);
            setFormData((prevData) => ({
              ...prevData,
              personalInfo: {
                ...prevData.personalInfo,
                [name]: downloadURL,
                PhotoName: file.name,
              },
            }));
            setFileName(file.name);
            console.log(`Photo uploaded: ${file.name} - URL: ${downloadURL}`);
          } catch (error) {
            console.error("Error uploading photo: ", error);
          }
        } else {
          console.error("Invalid file format. Please upload an image.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLanguageChange = (event) => {
    const { value } = event.target;
    setSelectedLanguages(value);
  
    if (!value.includes('Other')) {
      setOtherLanguage('');
    }
  
    const updatedLanguages = value.includes('Other') && otherLanguage ? [...value, otherLanguage] : value;
  
    setFormData((prevData) => ({
      ...prevData,
      personalInfo: {
        ...prevData.personalInfo,
        languagesKnown: updatedLanguages,
        otherLanguage: value.includes('Other') ? otherLanguage : '',
      },
    }));
  };

  const handleOtherLanguageChange = (event) => {
    const { value } = event.target;
    if (validateAlphabets(value) || value === '') {
      setOtherLanguage(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        otherLanguage: '',
      }));

      setFormData((prevData) => ({
        ...prevData,
        personalInfo: {
          ...prevData.personalInfo,
          otherLanguage: value,
          languagesKnown: selectedLanguages.includes('Other') ? [...selectedLanguages.filter(lang => lang !== 'Other'), value] : selectedLanguages,
        },
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        otherLanguage: 'Invalid alphabetic input',
      }));
    }
  };

  const handleOtherLanguageBlur = () => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      otherLanguage: '',
    }));
  };

  const handleOtherGenderChange = (event) => {
    const { value } = event.target;
    setOtherGender(value);
    setFormData((prevData) => ({
      ...prevData,
      personalInfo: {
        ...prevData.personalInfo,
        otherGender: value,
      },
    }));
  };

  return (
    <React.Fragment>
      <Grid container spacing={3} className={classes.formContainer}>
        {/* Section 1 */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom className={`${classes.basicInfoMargin} ${classes.coloredTypography} ${classes.typographyMargin} urbanist-font`}>
            Basic Information :
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="StudentName"
            name="StudentName"
            label="Student Full Name"
            fullWidth
            autoComplete="name"
            value={formData.personalInfo.StudentName || ''}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className={`${classes.fieldMargin} ${classes.reducedWidth} urbanist-font`}
            error={!!errors.StudentName}
            helperText={errors.StudentName}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="DOB"
            name="DOB"
            label="Date of Birth"
            type="date"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={formData.personalInfo.DOB || ''}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className={`${classes.fieldMargin} ${classes.reducedWidth} urbanist-font`}
          />
        </Grid>
        {/* >>> */}
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="Gender"
            name="Gender"
            label="Gender"
            select
            fullWidth
            value={formData.personalInfo.Gender || ''}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className={`${classes.fieldMargin} ${classes.reducedWidth} urbanist-font`}
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>
          {formData.personalInfo.Gender === 'other' && (
            <TextField
              id="otherGender"
              name="otherGender"
              label="Please specify"
              fullWidth
              value={otherGender}
              onChange={handleOtherGenderChange}
              className={`${classes.fieldMargin} ${classes.reducedWidth} urbanist-font`}
            />
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="Photo"
            name="Photo"
            label="Upload Photo"
            type="file"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleFileChange}
            className={`${classes.fieldMargin} ${classes.reducedWidth} urbanist-font`}
          />
          {fileName && <Typography variant="body2" className={classes.coloredTypography}>{fileName}</Typography>}
        </Grid>

        {/* Section 2 */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom className={`${classes.educationalInfoMargin} ${classes.coloredTypography} ${classes.typographyMargin} urbanist-font`}>
            Educational Information :
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="Grade"
            name="Grade"
            label="Class"
            select
            fullWidth
            value={formData.personalInfo.Grade || ''}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className={`${classes.fieldMargin} ${classes.reducedWidth} urbanist-font`}
          >
            {[...Array(10).keys()].map(i => (
              <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="PreviousSchool"
            name="PreviousSchool"
            label="Previous School Name"
            fullWidth
            value={formData.personalInfo.PreviousSchool || ''}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className={`${classes.fieldMargin} ${classes.reducedWidth} urbanist-font`}
            error={!!errors.PreviousSchool}
            helperText={errors.PreviousSchool}
          />
        </Grid>
        {/* Section 3 */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom className={`${classes.additionalInfoMargin} ${classes.coloredTypography} ${classes.typographyMargin} urbanist-font`}>
            Additional Information :
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="standard" className={`${classes.field} urbanist-font`}>
            <InputLabel className={`${classes.fieldMargin} ${classes.reducedWidth} urbanist-font`} id="languagesKnown-label">Languages Known</InputLabel>
            <Select
              labelId="languagesKnown-label"
              id="languagesKnown"
              multiple
              value={selectedLanguages}
              onChange={handleLanguageChange}
              className={`${classes.fieldMargin} ${classes.reducedWidth} urbanist-font`}
              renderValue={(selected) => selected.join(', ')}
            >
              {languages.map((language) => (
                <MenuItem
                  key={language}
                  value={language}
                  style={{
                    backgroundColor: selectedLanguages.includes(language) ? '#0E5E9D60' : 'transparent',
                  }}
                >
                  <ListItemText primary={language} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedLanguages.includes('Other') && (
            <TextField
              id="otherLanguage"
              label="Other Language"
              name="otherLanguage"
              value={otherLanguage}
              onChange={handleOtherLanguageChange}
              onKeyDown={handleKeyDown}
              onBlur={handleOtherLanguageBlur}
              fullWidth
              className={`${classes.fieldMargin} ${classes.reducedWidth} urbanist-font`}
              error={!!errors.otherLanguage}
              helperText={errors.otherLanguage}
            />
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="Religion"
            name="Religion"
            label="Religion"
            fullWidth
            value={formData.personalInfo.Religion || ''}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className={`${classes.fieldMargin} ${classes.reducedWidth} urbanist-font`}
            error={!!errors.Religion}
            helperText={errors.Religion}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="Category"
            name="Category"
            label="Category"
            fullWidth
            value={formData.personalInfo.Category || ''}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className={`${classes.fieldMargin} ${classes.reducedWidth} urbanist-font`}
            error={!!errors.Category}
            helperText={errors.Category}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="Nationality"
            name="Nationality"
            label="Nationality"
            fullWidth
            value={formData.personalInfo.Nationality || ''}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className={`${classes.fieldMargin} ${classes.reducedWidth} urbanist-font`}
            error={!!errors.Nationality}
            helperText={errors.Nationality}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="AadharNumber"
            name="AadharNumber"
            label="Aadhar Number"
            type="text" // Ensure the type is set to text
            fullWidth
            value={formData.personalInfo.AadharNumber || ''}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onKeyPress={(event) => {
              if (!/[0-9]/.test(event.key)) {
                event.preventDefault();
              }
            }}
            className={`${classes.fieldMargin} ${classes.reducedWidth} urbanist-font`}
            error={!!errors.AadharNumber}
            helperText={errors.AadharNumber}
            inputProps={{ maxLength: 12, pattern: "[0-9]*" }} // Restrict input to numbers only
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}