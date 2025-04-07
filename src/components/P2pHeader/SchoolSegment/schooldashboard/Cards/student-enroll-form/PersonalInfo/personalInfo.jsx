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
  const [otherGender, setOtherGender] = useState(formData.personalInfo.otherGender || '');
  const [languages, setLanguages] = useState([]);
  const [languageEntries, setLanguageEntries] = useState(
    formData.personalInfo.languagesKnown || [{ language_id: '', language_type: '' }]
  );
  const [religions, setReligions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [nationalities, setNationalities] = useState([]);


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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/categories`);
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const addLanguageEntry = () => {
    if (languageEntries.length < 3) {
      const newEntries = [...languageEntries, { language_id: '', language_type: '' }];
      updateFormDataLanguages(newEntries);
    }
  };

  const removeLanguageEntry = (index) => {
    if (languageEntries.length > 1) {
      const newEntries = [...languageEntries];
      newEntries.splice(index, 1);
      updateFormDataLanguages(newEntries);
    }
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

  useEffect(() => {
    if (formData.personalInfo.languagesKnown && formData.personalInfo.languagesKnown.length > 0) {
      setLanguageEntries(formData.personalInfo.languagesKnown);
    } else {
      setLanguageEntries([{ language_id: '', language_type: '' }]);
    }
  }, [formData.personalInfo.languagesKnown]);

  const updateFormDataLanguages = (entries) => {
    setLanguageEntries(entries);
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        languagesKnown: entries
      }
    }));
  };

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
    
    // Validate mother tongue uniqueness
    if (field === 'language_type' && value === 'mother_tongue') {
      for (let i = 0; i < newEntries.length; i++) {
        if (i !== index && newEntries[i].language_type === 'mother_tongue') {
          newEntries[i].language_type = 'secondary_language';
        }
      }
    }
    
    updateFormDataLanguages(newEntries);
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
            id="student_name"
            name="student_name"
            label="Student Full Name"
            fullWidth
            autoComplete="name"
            value={formData.personalInfo.student_name || ''}
            onChange={handleChange}
            // onKeyDown={handleKeyDown}
            // onBlur={handleBlur}
            className={`${classes.fieldMargin} ${classes.reducedWidth} urbanist-font`}
            error={!!errors.student_name}
            helperText={errors.student_name}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="dob"
            name="dob"
            label="Date of Birth"
            type="date"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={formData.personalInfo.dob || ''}
            onChange={handleChange}
            // onKeyDown={handleKeyDown}
            // onBlur={handleBlur}
            className={`${classes.fieldMargin} ${classes.reducedWidth} urbanist-font`}
            error={!!errors.dob}
            helperText={errors.dob}
          />
        </Grid>
        {/* >>> */}
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="gender"
            name="gender"
            label="Gender"
            select
            fullWidth
            value={formData.personalInfo.gender || ''}
            onChange={handleChange}
            // onKeyDown={handleKeyDown}
            // onBlur={handleBlur}
            className={`${classes.fieldMargin} ${classes.reducedWidth} urbanist-font`}
            error={!!errors.gender}
            helperText={errors.gender}
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
            id="photo"
            name="photo"
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
            id="grade"
            name="grade"
            label="Class"
            select
            fullWidth
            value={formData.personalInfo.grade || ''}
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
            id="previous_school"
            name="previous_school"
            label="Previous School Name"
            fullWidth
            value={formData.personalInfo.previous_school || ''}
            onChange={handleChange}
            // onKeyDown={handleKeyDown}
            // onBlur={handleBlur}
            className={`${classes.fieldMargin} ${classes.reducedWidth} urbanist-font`}
            error={!!errors.previous_school}
            helperText={errors.previous_school}
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
              required
              fullWidth
              label="Language"
              value={entry.language_id || ''}
              onChange={(e) => handleLanguageChange(index, 'language_id', Number(e.target.value))}
              className={`${classes.fieldMargin} ${classes.reducedWidth} urbanist-font`}
              error={!!errors[`language_${index}`]}
              helperText={errors[`language_${index}`]}
            >
              <MenuItem value="">Select Language</MenuItem>
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
              required
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
          
          {languageEntries.length < 3 && (
            <Button 
              variant="outlined" 
              startIcon={<AddCircleOutline />}
              onClick={addLanguageEntry}
              style={{ marginLeft: '16px' }}
            >
              Add Language
            </Button>
          )}
</Grid>
      
        <Grid item xs={12} sm={6}>
  <TextField
id="religion"
name="religion"
label="Religion"
select
fullWidth
value={formData.personalInfo.religion || ''}
onChange={(e) => {
  const selectedReligion = religions.find(r => r.religion_name === e.target.value);
  setFormData(prev => ({
    ...prev,
    personalInfo: {
      ...prev.personalInfo,
      religion: e.target.value,
      religion_id: selectedReligion ? selectedReligion.religion_id : null
    }
  }));
}}
className={`${classes.fieldMargin} ${classes.reducedWidth} urbanist-font`}
error={!!errors.religion}
helperText={errors.religion}
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
  id="category"
  name="category"
  label="Category"
  select
  fullWidth
  value={formData.personalInfo.category || ''}
  onChange={(e) => {
    const selectedCategory = categories.find(c => c.category_name === e.target.value);
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        category: selectedCategory ? selectedCategory.category_name : '',
        category_id: selectedCategory ? selectedCategory.category_id : null
      }
    }));
  }}
  className={`${classes.fieldMargin} ${classes.reducedWidth} urbanist-font`}
  error={!!errors.category}
  helperText={errors.category}
>
  {categories.map((category) => (
    <MenuItem key={category.category_id} value={category.category_name}>
      {category.category_name} ({category.category_type})
    </MenuItem>
  ))}
</TextField>
</Grid>
<Grid item xs={12} sm={6}>
<TextField
  id="nationality"
  name="nationality"
  label="Nationality"
  select
  fullWidth
  value={formData.personalInfo.nationality || ''}
  onChange={(e) => {
    const selectedNationality = nationalities.find(n => n.nationality_name === e.target.value);
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        nationality: e.target.value,
        nationality_id: selectedNationality ? selectedNationality.nationality_id : null
      }
    }));
  }}
  className={`${classes.fieldMargin} ${classes.reducedWidth} urbanist-font`}
  error={!!errors.nationality}
  helperText={errors.nationality}
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
            id="aadhar_number"
            name="aadhar_number"
            label="Aadhar Number"
            type="text" // Ensure the type is set to text
            fullWidth
            value={formData.personalInfo.aadhar_number || ''}
            onChange={handleChange}
            // onKeyDown={handleKeyDown}
            // onBlur={handleBlur}
            className={`${classes.fieldMargin} ${classes.reducedWidth} urbanist-font`}
            error={!!errors.aadhar_number}
            helperText={errors.aadhar_number}
            inputProps={{ maxLength: 12, pattern: "[0-9]*" }} // Restrict input to numbers only
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}