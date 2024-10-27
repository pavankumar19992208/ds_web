import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';
import { storage } from '../../../../../../components/connections/firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import './personalInfo.css';

const useStyles = makeStyles((theme) => ({
  formContainer: {
    overflow: 'auto', // Allow scrolling within the form
    maxHeight: '80vh', // Set a maximum height to ensure scrolling
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
  }
}));

export default function DetailsForm({ formData, setFormData }) {
  const classes = useStyles();
  const [languages, setLanguages] = useState(formData.personalInfo.languages || ['']);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      personalInfo: {
        ...prevData.personalInfo,
        [name]: value,
      },
    }));
  };

  const handleFileChange = async (event) => {
    const { name, files } = event.target;
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileData = e.target.result;
        const storageRef = ref(storage, `photos/${file.name}`);
        try {
          await uploadString(storageRef, fileData, 'data_url');
          const downloadURL = await getDownloadURL(storageRef);
          setFormData((prevData) => ({
            ...prevData,
            personalInfo: {
              ...prevData.personalInfo,
              [name]: downloadURL,
            },
          }));
          console.log(`Photo uploaded: ${file.name} - URL: ${downloadURL}`);
        } catch (error) {
          console.error("Error uploading photo: ", error);
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
      <Typography className='heading1' variant="h6" gutterBottom>
        Student information
      </Typography>
      <Grid container spacing={3} className={classes.formContainer}>
        {/* Section 1 */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom className={classes.basicInfoMargin}>
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
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="Photo"
            name="Photo"
            label="Upload Photo"
            type="file"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleFileChange}
          />
        </Grid>

        {/* Section 2 */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom className={classes.educationalInfoMargin}>
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
          >
            {[...Array(10).keys()].map(i => (
              <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="PreviousSchool"
            name="PreviousSchool"
            label="Previous School Name"
            fullWidth
            value={formData.personalInfo.PreviousSchool || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
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
                className={classes.languageInput}
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
          <Typography variant="subtitle1" gutterBottom className={classes.additionalInfoMargin}>
            Additional Information :
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="Religion"
            name="Religion"
            label="Religion"
            fullWidth
            value={formData.personalInfo.Religion || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="Category"
            name="Category"
            label="Category"
            fullWidth
            value={formData.personalInfo.Category || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="Nationality"
            name="Nationality"
            label="Nationality"
            fullWidth
            value={formData.personalInfo.Nationality || ''}
            onChange={handleChange}
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
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}