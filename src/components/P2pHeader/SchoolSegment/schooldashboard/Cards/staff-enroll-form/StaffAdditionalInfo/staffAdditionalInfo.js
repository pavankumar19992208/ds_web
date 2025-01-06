import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { makeStyles } from '@mui/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ListItemText from '@mui/material/ListItemText';

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
  field: {
    marginLeft: 16,
    width: '92%',
  },
}));

const languages = ['Hindi', 'Telugu', 'English', 'Other'];

const StaffAdditionalInfo = ({ formData, setFormData }) => {
  const classes = useStyles();
  const [selectedLanguages, setSelectedLanguages] = useState(formData.additionalInfo.languagesKnown || []);
  const [otherLanguage, setOtherLanguage] = useState(formData.additionalInfo.otherLanguage || '');

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      additionalInfo: {
        ...prevData.additionalInfo,
        [name]: value,
      },
    }));
  };

  const handleLanguageChange = (event) => {
    const { value } = event.target;
    setSelectedLanguages(value);

    if (!value.includes('Other')) {
      setOtherLanguage('');
    }

    setFormData((prevData) => ({
      ...prevData,
      additionalInfo: {
        ...prevData.additionalInfo,
        languagesKnown: value.includes('Other') && otherLanguage ? [...value, otherLanguage] : value,
        otherLanguage: value.includes('Other') ? otherLanguage : '',
      },
    }));
  };

  const handleOtherLanguageChange = (event) => {
    const { value } = event.target;
    setOtherLanguage(value);

    setFormData((prevData) => ({
      ...prevData,
      additionalInfo: {
        ...prevData.additionalInfo,
        otherLanguage: value,
        languagesKnown: selectedLanguages.includes('Other') ? [...selectedLanguages.filter(lang => lang !== 'Other'), value] : selectedLanguages,
      },
    }));
  };

  return (
    <div className={classes.mainContainer}>
      <form className={classes.formContainer}>
        <Grid container spacing={3} className={classes.gridContainer}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="standard" className={`${classes.field} urbanist-font`}>
              <InputLabel className={`${classes.field} urbanist-font`} required id="languagesKnown-label">Languages Known</InputLabel>
              <Select
                labelId="languagesKnown-label"
                id="languagesKnown"
                multiple
                value={selectedLanguages}
                onChange={handleLanguageChange}
                className={`${classes.field} urbanist-font`}
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
                fullWidth
                className={`${classes.field} urbanist-font`}
              />
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="interests"
              label="Interests"
              name="interests"
              value={formData.additionalInfo.interests}
              onChange={handleChange}
              fullWidth
              className={`${classes.field} urbanist-font`}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="standard" className={`${classes.field} urbanist-font`}>
              <InputLabel className={`${classes.field} urbanist-font`} id="availabilityOfExtraCirricularActivities-label">Availability of ExtraCirricular Activities</InputLabel>
              <Select
                labelId="availabilityOfExtraCirricularActivities-label"
                id="availabilityOfExtraCirricularActivities"
                name="availabilityOfExtraCirricularActivities"
                value={formData.additionalInfo.availabilityOfExtraCirricularActivities}
                onChange={handleChange}
                className={`${classes.field} urbanist-font`}
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default StaffAdditionalInfo;