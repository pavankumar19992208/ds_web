import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutline from '@mui/icons-material/RemoveCircleOutline';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import { makeStyles } from '@mui/styles';
import Tooltip from '@mui/material/Tooltip';
import { storage } from '../../../../../../connections/firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import BaseUrl from '../../../../../../../config';
import axios from 'axios';
import './personalInfo.css';

const useStyles = makeStyles((theme) => ({
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

export const validateAlphabets = (value) => /^[A-Za-z\s]+$/.test(value);
export const validateNumbers = (value) => /^[0-9]{0,12}$/.test(value);

export default function DetailsForm({ formData, setFormData }) {
  const classes = useStyles();
  const [fileName, setFileName] = useState(formData.personalInfo.PhotoName || '');
  const [errors, setErrors] = useState({});
  const [selectedLanguages, setSelectedLanguages] = useState(
    formData.personalInfo.languagesKnown || []
  );
  const [otherLanguage, setOtherLanguage] = useState(formData.personalInfo.otherLanguage || '');
  const [otherGender, setOtherGender] = useState(formData.personalInfo.otherGender || '');
  const [languages, setLanguages] = useState([]); // State to store fetched languages
  const [languageEntries, setLanguageEntries] = useState(
    formData.personalInfo.languagesKnown || [{ language_id: '', language_type: '' }]
  );
  const [religions, setReligions] = useState([]);

  useEffect(() => {
    const fetchReligions = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/religions`);
        setReligions(response.data.religions);
      } catch (error) {
        console.error("Error fetching religions:", error);
      }
    };
    fetchReligions();
  }, []);

  const [nationalities, setNationalities] = useState([]);

  useEffect(() => {
    const fetchNationalities = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/nationalities`);
        setNationalities(response.data.nationalities);
      } catch (error) {
        console.error("Error fetching nationalities:", error);
      }
    };
    fetchNationalities();
  }, []);

  const addLanguageEntry = () => {
    setLanguageEntries([...languageEntries, { language_id: '', language_type: '' }]);
  };

  const removeLanguageEntry = (index) => {
    const newEntries = [...languageEntries];
    newEntries.splice(index, 1);
    setLanguageEntries(newEntries);
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        languagesKnown: newEntries
      }
    }));
  };
  

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/languages`);
        setLanguages(response.data.languages);
        console.log('Languages fetched from API:', response.data.languages);
      } catch (error) {
        console.error("Error fetching languages:", error);
        // You can access more detailed error info:
        if (error.response) {
          // The request was made and the server responded with a status code
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.error("No response received:", error.request);
        } else {
          // Something happened in setting up the request
          console.error("Request setup error:", error.message);
        }
      }
    };
    fetchLanguages();
  }, []);

  useEffect(() => {
    setFileName(formData.personalInfo.PhotoName || '');
  }, [formData.personalInfo.PhotoName]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    let isValid = true;
    let errorMessage = '';
    if (name === 'Category' && value && !['SC', 'ST', 'OBC', 'GEN', 'EWS', 'PWD'].includes(value)) {
      isValid = false;
      errorMessage = 'Please select a valid category';
    }

    if (['StudentName', 'PreviousSchool', 'Religion', 'Category', 'Nationality'].includes(name)) {
      isValid = validateAlphabets(value) || value === '';
      errorMessage = 'Invalid alphabetic input';
    } else if (name === 'AadharNumber') {
      isValid = /^[0-9]*$/.test(value); // Ensure only numbers are entered
      if (!isValid) {
        errorMessage = 'Aadhar number must contain only digits';
      } else if (value.length !== 12) {
        isValid = false;
        errorMessage = 'Aadhar number must be 12 digits';
      }
    } else if (name === 'DOB') {
      const currentDate = new Date().toISOString().split('T')[0];
      if (value > currentDate) {
        isValid = false;
        errorMessage = 'Date of Birth cannot be in the future';
      }
    }

    // Check if the field is required and empty
    if (['StudentName', 'DOB', 'Gender', 'Grade', 'AadharNumber'].includes(name) && value === '') {
      isValid = false;
      errorMessage = 'This field is required';
    }

    setFormData((prevData) => ({
      ...prevData,
      personalInfo: {
        ...prevData.personalInfo,
        [name]: value,
      },
    }));

    if (isValid) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: errorMessage,
      }));
    }
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

const handleLanguageChange = (index, field, value) => {
  const newEntries = [...languageEntries];
  newEntries[index][field] = value;
  setLanguageEntries(newEntries);
  setFormData(prev => ({
    ...prev,
    personalInfo: {
      ...prev.personalInfo,
      languagesKnown: newEntries
    }
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

  const handleOtherGenderChange = (event) => {
    const { value } = event.target;
    if (validateAlphabets(value) || value === '') {
      setOtherGender(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        otherGender: '',
      }));

      setFormData((prevData) => ({
        ...prevData,
        personalInfo: {
          ...prevData.personalInfo,
          otherGender: value,
        },
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        otherGender: 'Invalid alphabetic input',
      }));
    }
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
            // onKeyDown={handleKeyDown}
            // onBlur={handleBlur}
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
            // onKeyDown={handleKeyDown}
            // onBlur={handleBlur}
            className={`${classes.fieldMargin} ${classes.reducedWidth} urbanist-font`}
            error={!!errors.DOB}
            helperText={errors.DOB}
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
            // onKeyDown={handleKeyDown}
            // onBlur={handleBlur}
            className={`${classes.fieldMargin} ${classes.reducedWidth} urbanist-font`}
            error={!!errors.Gender}
            helperText={errors.Gender}
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
              // onBlur={handleBlur}
              // onKeyDown={handleKeyDown}
              fullWidth
              value={otherGender}
              onChange={handleOtherGenderChange}
              className={`${classes.fieldMargin} ${classes.reducedWidth} urbanist-font`}
              error={!!errors.otherGender}
              helperText={errors.otherGender}
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
            // onKeyDown={handleKeyDown}
            // onBlur={handleBlur}
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
            // onKeyDown={handleKeyDown}
            // onBlur={handleBlur}
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

  {languageEntries.map((entry, index) => (
    <Grid container spacing={2} key={index} style={{ marginBottom: '16px' }}>
      <Grid item xs={6}>
        <TextField
          select
          fullWidth
          label="Language"
          value={entry.language_id || ''}
          onChange={(e) => handleLanguageChange(index, 'language_id', Number(e.target.value))}
          className={`${classes.fieldMargin} ${classes.reducedWidth} urbanist-font`}
        >
          {languages.map((language) => (
            <MenuItem key={language.language_id} value={language.language_id}>
              {language.language_name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={5}>
        <TextField
          select
          fullWidth
          label="Language Type"
          value={entry.language_type || ''}
          onChange={(e) => handleLanguageChange(index, 'language_type', e.target.value)}
          className={`${classes.fieldMargin} ${classes.reducedWidth} urbanist-font`}
        >
          <MenuItem value="mother_tongue">Mother Tongue</MenuItem>
          <MenuItem value="secondary_language">Secondary Language</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={1} style={{ display: 'flex', alignItems: 'center' }}>
        {index > 0 && (
          <IconButton onClick={() => removeLanguageEntry(index)}>
            <RemoveCircleOutline color="error" />
          </IconButton>
        )}
      </Grid>
    </Grid>
  ))}
  
  <Button 
    variant="outlined" 
    startIcon={<AddCircleOutline />}
    onClick={addLanguageEntry}
    style={{ marginLeft: '16px' }}
  >
    Add Language
  </Button>
</Grid>
      
        <Grid item xs={12} sm={6}>
  <TextField
    id="Religion"
    name="Religion"
    label="Religion"
    select
    fullWidth
    value={formData.personalInfo.Religion || ''}
    onChange={handleChange}
    className={`${classes.fieldMargin} ${classes.reducedWidth} urbanist-font`}
    error={!!errors.Religion}
    helperText={errors.Religion}
  >
    {religions.map((religion) => (
      <MenuItem key={religion.religion_id} value={religion.religion_name}>
        {religion.religion_name}
      </MenuItem>
    ))}
  </TextField>
</Grid>
        <Grid item xs={12} sm={6}>
  <TextField
    id="Category"
    name="Category"
    label="Category"
    select
    fullWidth
    value={formData.personalInfo.Category || ''}
    onChange={handleChange}
    className={`${classes.fieldMargin} ${classes.reducedWidth} urbanist-font`}
    error={!!errors.Category}
    helperText={errors.Category}
  >
    <MenuItem value="SC">SC (Scheduled Caste)</MenuItem>
    <MenuItem value="ST">ST (Scheduled Tribe)</MenuItem>
    <MenuItem value="OBC">OBC (Other Backward Class)</MenuItem>
    <MenuItem value="GEN">GEN (General)</MenuItem>
    <MenuItem value="EWS">EWS (Economically Weaker Section)</MenuItem>
    <MenuItem value="PWD">PWD (Person with Disability)</MenuItem>
  </TextField>
</Grid>
<Grid item xs={12} sm={6}>
  <TextField
    id="Nationality"
    name="Nationality"
    label="Nationality"
    select
    fullWidth
    value={formData.personalInfo.Nationality || ''}
    onChange={handleChange}
    className={`${classes.fieldMargin} ${classes.reducedWidth} urbanist-font`}
    error={!!errors.Nationality}
    helperText={errors.Nationality}
  >
    {nationalities.map((nationality) => (
      <MenuItem key={nationality.nationality_id} value={nationality.nationality_name}>
        {nationality.nationality_name}
      </MenuItem>
    ))}
  </TextField>
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
            // onKeyDown={handleKeyDown}
            // onBlur={handleBlur}
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