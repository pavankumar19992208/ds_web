import React, { useState, useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DetailsForm from './personalInfo';
import GuardianInfoForm from './guardianInfo';
import AcademicInfoForm from './academicInfo';
import DocumentsUpload from './documentsUpload';
import PaymentForm from './stPayment'; // Import the PaymentForm component
import Sidebar from '../../Sidebar/Sidebar'; // Import Sidebar
import Navbar from '../../Navbar/Navbar'; // Import Navbar
import './primaryForm.css'; // Import the CSS file
import { GlobalStateContext } from '../../../../../../GlobalStateContext';
const steps = ['Personal Info', 'Guardian Info', 'Academic \n & Medical Details', 'Upload Documents', 'Payment','Review \n & Submit'];

function getStepContent(step, formData, setFormData) {
  switch (step) {
    case 0:
      return <DetailsForm formData={formData} setFormData={setFormData} />;
    case 1:
      return <GuardianInfoForm formData={formData} setFormData={setFormData} />;
    case 2:
      return <AcademicInfoForm formData={formData} setFormData={setFormData} />;
    case 3:
      return <DocumentsUpload formData={formData} setFormData={setFormData} />;
    case 4:
      return <PaymentForm formData={formData} setFormData={setFormData} />;
    case 5:
      return (
        <div>
          <Typography variant="h6" gutterBottom>
            Review Your Details
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell colSpan={2}>Field</TableCell>
                  <TableCell colSpan={2}>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={4}>
                    <Typography variant="subtitle1">Personal Info</Typography>
                  </TableCell>
                </TableRow>
                {Object.entries(formData.personalInfo).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell colSpan={2}>{key}</TableCell>
                    <TableCell colSpan={2}>
                      {key === 'photo' ? (
                        <img src={value} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                      ) : (
                        value
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={4}>
                    <Typography variant="subtitle1">Guardian Info</Typography>
                  </TableCell>
                </TableRow>
                {Object.entries(formData.guardianInfo).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell colSpan={2}>{key}</TableCell>
                    <TableCell colSpan={2}>{value}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={4}>
                    <Typography variant="subtitle1">Academic & Medical Info</Typography>
                  </TableCell>
                </TableRow>
                {Object.entries(formData.academicInfo).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell colSpan={2}>{key}</TableCell>
                    <TableCell colSpan={2}>{value}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={4}>
                    <Typography variant="subtitle1">Uploaded Documents</Typography>
                  </TableCell>
                </TableRow>
                {formData.documents.map((doc, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={2}>{doc.name}</TableCell>
                    <TableCell colSpan={2}>
                      <img src={doc.data} alt={doc.name} style={{ maxWidth: '100%', maxHeight: '200px' }} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      );
    default:
      throw new Error('Unknown step');
  }
}

export default function EnrollForm() {
  const [activeStep, setActiveStep] = useState(0);
  const { globalData } = useContext(GlobalStateContext);
  const [formData, setFormData] = useState({
    personalInfo: {},
    guardianInfo: {},
    academicInfo: {},
    documents: [],
  });

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleEnrollMore = () => {
    setActiveStep(0);
    setFormData({
      personalInfo: {},
      guardianInfo: {},
      academicInfo: {},
      documents: [],
    });
  };

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log('Form submitted:', formData);
  };

  return (
    <React.Fragment>
      <Navbar schoolName={globalData.data.SCHOOL_NAME} schoolLogo={globalData.data.SCHOOL_LOGO} />
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
                {getStepContent(activeStep, formData, setFormData)}
                <div className="buttons">
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} className="button">
                      Back
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                    className="button"
                  >
                    {activeStep === steps.length - 1 ? 'Verify and Submit' : 'Next'}
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