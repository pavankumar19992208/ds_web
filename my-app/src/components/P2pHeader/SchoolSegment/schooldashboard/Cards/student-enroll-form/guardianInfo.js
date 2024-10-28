import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles, useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  personalTitle: {
    color: '#3f51b5',
    fontSize: '1rem',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
  },
  contactTitle: {
    color: '#3f51b5',
    fontSize: '1rem',
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(1),
  },
  addressTitle: {
    color: '#3f51b5',
    fontSize: '1rem',
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(1),
  },
  formControlLabel: {
    marginLeft: theme.spacing(2),
  },
  textField: {
    marginLeft: theme.spacing(2),
    width: '92%',
  },
}));

export default function GuardianInfoForm({ formData, setFormData }) {
  const classes = useStyles();
  const [sameAddress, setSameAddress] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(formData.guardianInfo.currentAddress || {
    line1: '',
    line2: '',
    city: '',
    district: '',
    state: '',
    pincode: ''
  });
  const [permanentAddress, setPermanentAddress] = useState(formData.guardianInfo.permanentAddress || {
    line1: '',
    line2: '',
    city: '',
    district: '',
    state: '',
    pincode: ''
  });

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      guardianInfo: {
        ...prevData.guardianInfo,
        currentAddress,
        permanentAddress,
      },
    }));
  }, [currentAddress, permanentAddress, setFormData]);

  const handleCheckboxChange = (event) => {
    setSameAddress(event.target.checked);
    if (event.target.checked) {
      setPermanentAddress(currentAddress);
    }
  };

  const handleCurrentAddressChange = (event) => {
    const { id, value } = event.target;
    setCurrentAddress((prev) => ({ ...prev, [id]: value }));
    if (sameAddress) {
      setPermanentAddress((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      guardianInfo: {
        ...prevData.guardianInfo,
        [name]: value,
      },
    }));
  };

  const qualifications = ['Matriculation', '12th or Diploma', 'Graduation', 'Post Graduation', 'Other'];

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom className={classes.personalTitle}>
        Parent Information :
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="FatherName"
            name="FatherName"
            label="Father's Name"
            fullWidth
            autoComplete="fathers-name"
            value={formData.guardianInfo.FatherName || ''}
            onChange={handleInputChange}
            className={classes.textField}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="MotherName"
            name="MotherName"
            label="Mother's Name"
            fullWidth
            autoComplete="mothers-name"
            value={formData.guardianInfo.MotherName || ''}
            onChange={handleInputChange}
            className={classes.textField}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="GuardianName"
            name="GuardianName"
            label="Guardian (Optional)"
            fullWidth
            autoComplete="guardian"
            value={formData.guardianInfo.GuardianName || ''}
            onChange={handleInputChange}
            className={classes.textField}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="ParentOccupation"
            name="ParentOccupation"
            label="Parent Occupation"
            fullWidth
            autoComplete="parent-occupation"
            value={formData.guardianInfo.ParentOccupation || ''}
            onChange={handleInputChange}
            className={classes.textField}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            select
            required
            id="ParentQualification"
            name="ParentQualification"
            label="Parent Qualification"
            fullWidth
            autoComplete="parent-qualification"
            value={formData.guardianInfo.ParentQualification || ''}
            onChange={handleInputChange}
            className={classes.textField}
          >
            {qualifications.map((qualification) => (
              <MenuItem key={qualification} value={qualification}>
                {qualification}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom className={classes.contactTitle}>
        Contact Information :
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="MobileNumber"
            name="MobileNumber"
            label="Phone Number"
            fullWidth
            autoComplete="phone-number"
            value={formData.guardianInfo.MobileNumber || ''}
            onChange={handleInputChange}
            className={classes.textField}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="Email"
            name="Email"
            label="Email"
            fullWidth
            autoComplete="email"
            value={formData.guardianInfo.Email || ''}
            onChange={handleInputChange}
            className={classes.textField}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="EmergencyContact"
            name="EmergencyContact"
            label="Emergency Contact Number"
            fullWidth
            autoComplete="emergency-contact-number"
            value={formData.guardianInfo.EmergencyContact || ''}
            onChange={handleInputChange}
            className={classes.textField}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom className={classes.addressTitle}>
        Current Address :
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            id="line1"
            label="Line 1"
            fullWidth
            autoComplete="address-line1"
            value={currentAddress.line1}
            onChange={handleCurrentAddressChange}
            className={classes.textField}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="line2"
            label="Line 2"
            fullWidth
            autoComplete="address-line2"
            value={currentAddress.line2}
            onChange={handleCurrentAddressChange}
            className={classes.textField}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="city"
            label="City"
            fullWidth
            autoComplete="address-city"
            value={currentAddress.city}
            onChange={handleCurrentAddressChange}
            className={classes.textField}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="district"
            label="District"
            fullWidth
            autoComplete="address-district"
            value={currentAddress.district}
            onChange={handleCurrentAddressChange}
            className={classes.textField}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="state"
            label="State"
            fullWidth
            autoComplete="address-state"
            value={currentAddress.state}
            onChange={handleCurrentAddressChange}
            className={classes.textField}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="pincode"
            label="Pincode"
            fullWidth
            autoComplete="address-pincode"
            value={currentAddress.pincode}
            onChange={handleCurrentAddressChange}
            className={classes.textField}
          />
        </Grid>
      </Grid>

      <FormControlLabel
        control={
          <Checkbox
            checked={sameAddress}
            onChange={handleCheckboxChange}
            color="primary"
          />
        }
        label="Current address is same as permanent address"
        className={classes.formControlLabel}
      />

      <Typography variant="h6" gutterBottom className={classes.addressTitle}>
        Permanent Address :
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            id="line1"
            label="Line 1"
            fullWidth
            autoComplete="address-line1"
            value={permanentAddress.line1}
            onChange={(e) => setPermanentAddress({ ...permanentAddress, line1: e.target.value })}
            className={classes.textField}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="line2"
            label="Line 2"
            fullWidth
            autoComplete="address-line2"
            value={permanentAddress.line2}
            onChange={(e) => setPermanentAddress({ ...permanentAddress, line2: e.target.value })}
            className={classes.textField}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="city"
            label="City"
            fullWidth
            autoComplete="address-city"
            value={permanentAddress.city}
            onChange={(e) => setPermanentAddress({ ...permanentAddress, city: e.target.value })}
            className={classes.textField}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="district"
            label="District"
            fullWidth
            autoComplete="address-district"
            value={permanentAddress.district}
            onChange={(e) => setPermanentAddress({ ...permanentAddress, district: e.target.value })}
            className={classes.textField}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="state"
            label="State"
            fullWidth
            autoComplete="address-state"
            value={permanentAddress.state}
            onChange={(e) => setPermanentAddress({ ...permanentAddress, state: e.target.value })}
            className={classes.textField}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="pincode"
            label="Pincode"
            fullWidth
            autoComplete="address-pincode"
            value={permanentAddress.pincode}
            onChange={(e) => setPermanentAddress({ ...permanentAddress, pincode: e.target.value })}
            className={classes.textField}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}