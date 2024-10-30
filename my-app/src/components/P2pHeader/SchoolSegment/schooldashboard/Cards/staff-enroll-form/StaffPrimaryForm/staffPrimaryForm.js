import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import StaffPersonalInfo from '../StaffPersonalInfo/staffPersonalInfo';
import ProfessionalDetailsForm from '../StaffProfessionalInfo/staffProfessionalInfo'; // Import ProfessionalDetailsForm
import EmploymentDetailsForm from '../StaffEmployementInfo/staffEmployementInfo'; // Import EmploymentDetailsForm
import EmergencyContactForm from '../StaffEmergencyContactInfo/staffEmergencyContactInfo'; // Import EmergencyContactForm
import DocumentsUploadForm from '../StaffDocumentsUpload/staffDocumentUpload'; // Import DocumentsUploadForm
import AdditionalFieldsForm from '../StaffAdditionalInfo/staffAdditionalInfo'; // Import AdditionalFieldsForm
import Sidebar from '../../../Sidebar/Sidebar'; // Import Sidebar
import Navbar from '../../../Navbar/Navbar'; // Import Navbar

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  layout: {
    display: 'flex',
    flexDirection: 'row', // Ensure Sidebar and form are in a row
    justifyContent: 'center', // Center horizontally
    alignItems: 'flex-start', // Center vertically
    height: '100vh', // Full viewport height
    width: '100%', // Full viewport width
    padding: theme.spacing(2),
    overflow: 'auto',
    position:'absolute',
  },
  paper: {
    width: '100%',
    maxWidth: '1000px', // Increase max width of the form
    margin: '24px',
    padding: '16px',
    marginTop: '80px',
    overFlow: 'auto',
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
    backgroundColor: '#ff8040', // Change button color
    color: 'white', // Change text color
    '&:hover': {
      backgroundColor: '#faaa72', // Change button color on hover
    },
  },
}));

const steps = [
  'Personal details',
  'Professional Details',
  'Employment Details',
  'Emergency Contact Info',
  'Documents Upload',
  'Additional Fields'
];

function getStepContent(step) {
  switch (step) {
    case 0:
      return <StaffPersonalInfo />;
    case 1:
      return <ProfessionalDetailsForm />;
    case 2:
      return <EmploymentDetailsForm />;
    case 3:
      return <EmergencyContactForm />;
    case 4:
      return <DocumentsUploadForm />;
    case 5:
      return <AdditionalFieldsForm />;
    default:
      throw new Error('Unknown step');
  }
}

export default function StaffPrimaryForm() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleEnrollMore = () => {
    setActiveStep(0);
  };

  return (
    <React.Fragment>
      <Navbar /> {/* Add Navbar */}
      <main className={classes.layout}>
        <Sidebar visibleItems={['home', 'updateEnrollment']} hideProfile={true} showTitle={false} />
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            Teacher's Enroll Form
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <React.Fragment>
            {activeStep === steps.length ? (
              <React.Fragment>
                <Typography variant="h5" gutterBottom>
                  Submitted successfully
                </Typography>
                <Typography variant="subtitle1">
                  Enjoy your journey
                </Typography>
                <div className={classes.buttons}>
                  <Button
                    variant="contained"
                    onClick={handleEnrollMore}
                    className={classes.button}
                  >
                    Enroll More
                  </Button>
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {getStepContent(activeStep)}
                <div className={classes.buttons}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} className={classes.button}>
                      Back
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    className={classes.button}
                  >
                    {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                  </Button>
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        </Paper>
      </main>
    </React.Fragment>
  );
}