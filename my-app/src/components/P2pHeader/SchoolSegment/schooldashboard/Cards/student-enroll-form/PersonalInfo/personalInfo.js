import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';
import { storage } from '../../../../../../../components/connections/firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import './personalInfo.css';

const useStyles = makeStyles((theme) => ({
  formContainer: {
    // Removed overflow and maxHeight to fit content naturally
  },
  languageField: {
    display: 'flex',
    alignItems: 'center',
  },
  languageInput: {
    flexGrow: 1,
    marginRight: theme.spacing(1),
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
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
  languagesMargin:{
    marginBottom: theme.spacing(2),
  },
}));

const validateAlphabets = (value) => /^[A-Za-z\s]+$/.test(value);
const validateNumbers = (value) => /^[0-9]+$/.test(value);

export default function DetailsForm({ formData, setFormData }) {
  const classes = useStyles();
  const [languages, setLanguages] = useState(formData.personalInfo.languages || ['']);
  const [fileName, setFileName] = useState(formData.personalInfo.PhotoName || '');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFileName(formData.personalInfo.PhotoName || '');
  }, [formData.personalInfo.PhotoName]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    let isValid = true;

    if (['StudentName', 'PreviousSchool', 'Religion', 'Category', 'Nationality'].includes(name)) {
      isValid = validateAlphabets(value) || value === '';
    } else if (name === 'AadharNumber') {
      isValid = validateNumbers(value) || value === '';
    }

    if (isValid) {
      setFormData((prevData) => ({
        ...prevData,
        personalInfo: {
          ...prevData.personalInfo,
          [name]: value,
        },
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: `Invalid ${name === 'AadharNumber' ? 'number' : 'alphabetic'} input`,
      }));
    }
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

  const handleLanguageChange = (index, event) => {
    const newLanguages = [...languages];
    newLanguages[index] = event.target.value;
    setLanguages(newLanguages);
    setFormData((prevData) => ({
      ...prevData,
      personalInfo: {
        ...prevData.personalInfo,
        languages: newLanguages,
      },
    }));
  };

  const addLanguageField = () => {
    setLanguages([...languages, '']);
  };

  const deleteLanguageField = (index) => {
    if (languages.length > 1) {
      const newLanguages = languages.filter((_, i) => i !== index);
      setLanguages(newLanguages);
      setFormData((prevData) => ({
        ...prevData,
        personalInfo: {
          ...prevData.personalInfo,
          languages: newLanguages,
        },
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
            onKeyDown={handleKeyDown}
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
            className={`${classes.fieldMargin} ${classes.reducedWidth} urbanist-font`}
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>
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
            className={`${classes.fieldMargin} ${classes.reducedWidth} urbanist-font`}
            error={!!errors.PreviousSchool}
            helperText={errors.PreviousSchool}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom className={`${classes.coloredTypography} ${classes.languagesMargin} urbanist-font`}>
            Languages Known :
          </Typography>
          {languages.map((language, index) => (
            <div key={index} className={classes.languageField}>
              <TextField
                required
                id={`LanguagesKnown-${index}`}
                name={`LanguagesKnown-${index}`}
                label={`Language ${index + 1}`}
                fullWidth
                value={language}
                onChange={(event) => handleLanguageChange(index, event)}
                onKeyDown={handleKeyDown}
                className={`${classes.languageInput} ${classes.fieldMargin} ${classes.reducedWidth} urbanist-font`}
              />
            </div>
          ))}
          <div className={classes.iconContainer}>
            <IconButton onClick={addLanguageField} color="primary">
              <AddIcon />
            </IconButton>
            <IconButton
              onClick={() => deleteLanguageField(languages.length - 1)}
              color="secondary"
              disabled={languages.length === 1}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        </Grid>

        {/* Section 3 */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom className={`${classes.additionalInfoMargin} ${classes.coloredTypography} ${classes.typographyMargin} urbanist-font`}>
            Additional Information :
          </Typography>
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
            fullWidth
            value={formData.personalInfo.AadharNumber || ''}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className={`${classes.fieldMargin} ${classes.reducedWidth} urbanist-fonts`}
            error={!!errors.AadharNumber}
            helperText={errors.AadharNumber}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}