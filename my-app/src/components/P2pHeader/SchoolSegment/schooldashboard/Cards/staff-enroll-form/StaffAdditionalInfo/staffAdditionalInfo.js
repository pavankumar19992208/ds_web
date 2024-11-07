import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

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
    marginLeft: theme.spacing(2),
    width: '92%',
  },
}));

const StaffAdditionalInfo = ({ formData, setFormData }) => {
  const classes = useStyles();

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

  return (
    <div className={classes.mainContainer}>
      <form className={classes.formContainer}>
        <Grid container spacing={3} className={classes.gridContainer}>
          <Grid item xs={12} sm={6}>
            <TextField
              id="languagesKnown"
              label="Languages Known"
              name="languagesKnown"
              value={formData.additionalInfo.languagesKnown}
              onChange={handleChange}
              fullWidth
              className={classes.field}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="interests"
              label="Interests"
              name="interests"
              value={formData.additionalInfo.interests}
              onChange={handleChange}
              fullWidth
              className={classes.field}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="availabilityOfExtraCirricularActivities"
              label="Availability of ExtraCirricular Activities"
              name="availabilityOfExtraCirricularActivities"
              value={formData.additionalInfo.availabilityOfExtraCirricularActivities}
              onChange={handleChange}
              fullWidth
              className={classes.field}
            />
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default StaffAdditionalInfo;