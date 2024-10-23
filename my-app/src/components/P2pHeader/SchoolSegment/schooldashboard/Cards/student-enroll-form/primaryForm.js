import React from 'react';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DetailsForm from './personalInfo';
import GuardianInfoForm from './guardianInfo';
import AcademicInfoForm from './academicInfo';
import DocumentsUpload from './documentsUpload';
import Sidebar from '../../Sidebar/Sidebar'; // Import Sidebar
import Navbar from '../../Navbar/Navbar'; // Import Navbar
import './primaryForm.css'; // Import the CSS file

const steps = ['Personal Info', 'Guardian Info', 'Academic & Medical Info', 'Upload Documents'];

function getStepContent(step) {
  switch (step) {
    case 0:
      return <DetailsForm />;
    case 1:
      return <GuardianInfoForm />;
    case 2:
      return <AcademicInfoForm />;
    case 3:
      return <DocumentsUpload />;
    default:
      throw new Error('Unknown step');
  }
}

export default function EnrollForm() {
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
      <main className="layout">
        <Sidebar visibleItems={['home']} hideProfile={true} /> {/* Add Sidebar */}
        <Paper className="paper">
          <Typography component="h1" variant="h4" align="center">
            Student's Enroll Form
          </Typography>
          <Stepper activeStep={activeStep} className="stepper">
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
                <div className="buttons">
                  <Button
                    variant="contained"
                    onClick={handleEnrollMore}
                    className="button"
                  >
                    Enroll More
                  </Button>
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {getStepContent(activeStep)}
                <div className="buttons">
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} className="button">
                      Back
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    className="button"
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