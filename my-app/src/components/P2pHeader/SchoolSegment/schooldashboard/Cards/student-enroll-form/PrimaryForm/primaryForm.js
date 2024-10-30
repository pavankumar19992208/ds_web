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
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DetailsForm from '../PersonalInfo/personalInfo';
import GuardianInfoForm from '../GuardianInfo/guardianInfo';
import AcademicInfoForm from '../AcademicInfo/academicInfo';
import DocumentsUpload from '../DocumentsUpload/documentsUpload';
import PaymentForm from '../PaymentForm/stPayment';
import Sidebar from '../../../Sidebar/Sidebar';
import Navbar from '../../../Navbar/Navbar';
import './primaryForm.css';
import { GlobalStateContext } from '../../../../../../../GlobalStateContext';
import { storage } from '../../../../../../connections/firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import IconButton from '@material-ui/core/IconButton';
import BaseUrl from '../../../../../../../config';

const useStyles = makeStyles((theme) => ({
  formContainer: {
    overflow: 'visible', // Ensure the container grows based on its content
    maxHeight: 'none', // Remove the maximum height restriction
    height: 'auto', // Ensure the height adjusts automatically
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
  nextButton: {
    backgroundColor: '#0E5E9D',
    color: '#fff',
    fontWeight: '500',
    '&:hover': {
      backgroundColor: '#0E5E9D60',
      color:'#374441',
    },
  },
  reviewTitle: {
    color: theme.palette.primary.main,
    fontSize: '1.5rem',
    textAlign: 'center',
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(3),
  },
  reviewSectionTitle: {
    color: 'red',
    fontSize: '1.2rem',
  },
}));

const steps = ['Student Info', 'Guardian Info', 'Academic \n & Medical Details', 'Upload Documents', 'Payment', 'Review \n & Submit'];
const personalInfoKeys = ['StudentName', 'DOB', 'Gender', 'Photo', 'Grade', 'PreviousSchool', 'languages', 'Religion', 'Category', 'Nationality', 'AadharNumber', 'Password'];
const guardianInfoKeys = ['MotherName', 'FatherName', 'GuardianName', 'MobileNumber', 'Email', 'EmergencyContact', 'ParentOccupation', 'ParentQualification'];
const academicInfoKeys = ['PreviousPercentage', 'BloodGroup', 'MedicalDisability'];
const requiredDocuments = ['aadhar', 'tc', 'rationcard', 'income', 'birth'];

function getStepContent(step, formData, setFormData, handleDocumentClick, expandedDoc, setExpandedDoc, classes) {
  switch (step) {
    case 0:
      return <DetailsForm formData={formData} setFormData={setFormData} className="formContainer" />;
    case 1:
      return <GuardianInfoForm formData={formData} setFormData={setFormData} />;
    case 2:
      return <AcademicInfoForm formData={formData} setFormData={setFormData} />;
    case 3:
      return <DocumentsUpload formData={formData} setFormData={setFormData} />;
    case 4:
      return <PaymentForm formData={formData} setFormData={setFormData} />;
    case 5:
      const { PaymentMethod, Amount, TransactionId, BankTransfer } = formData.paymentInfo;
      return (
        <div>
          <Typography variant="h6" gutterBottom className={classes.reviewTitle}>
            Review Your Details
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" className={classes.reviewSectionTitle}>Personal details</Typography>
              <Table>
                <TableBody>
                  {personalInfoKeys.map((key) => (
                    <TableRow key={key}>
                      <TableCell>{key}</TableCell>
                      <TableCell>
                        {key === 'Photo' ? (
                          <div>
                            <Typography>{formData.personalInfo.PhotoName}</Typography>
                            <IconButton onClick={() => setExpandedDoc(expandedDoc === key ? null : key)}>
                              {expandedDoc === key ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </IconButton>
                            {expandedDoc === key && (
                              <img src={formData.personalInfo.Photo} alt="User's uploaded photo" style={{ width: '100%' }} />                            )}
                          </div>
                        ) : (
                          typeof formData.personalInfo[key] === 'object' ? JSON.stringify(formData.personalInfo[key]) : formData.personalInfo[key] || ''
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" className={classes.reviewSectionTitle}>Guardian Info</Typography>
              <Table>
                <TableBody>
                  {guardianInfoKeys.map((key) => (
                    <TableRow key={key}>
                      <TableCell>{key}</TableCell>
                      <TableCell>
                        {typeof formData.guardianInfo[key] === 'object' ? JSON.stringify(formData.guardianInfo[key]) : formData.guardianInfo[key] || ''}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>
            {formData.guardianInfo.currentAddress && Object.keys(formData.guardianInfo.currentAddress).length > 0 && (
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" className={classes.reviewSectionTitle}>Current Address</Typography>
                <Table>
                  <TableBody>
                    {Object.entries(formData.guardianInfo.currentAddress).map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell>{key}</TableCell>
                        <TableCell>{value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Grid>
            )}
            {formData.guardianInfo.permanentAddress && Object.keys(formData.guardianInfo.permanentAddress).length > 0 && (
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" className={classes.reviewSectionTitle}>Permanent Address</Typography>
                <Table>
                  <TableBody>
                    {Object.entries(formData.guardianInfo.permanentAddress).map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell>{key}</TableCell>
                        <TableCell>{value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" className={classes.reviewSectionTitle}>Academic & Medical Info</Typography>
              <Table>
                <TableBody>
                  {academicInfoKeys.map((key) => (
                    <TableRow key={key}>
                      <TableCell>{key}</TableCell>
                      <TableCell>
                        {typeof formData.academicInfo[key] === 'object' ? JSON.stringify(formData.academicInfo[key]) : formData.academicInfo[key] || ''}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" className={classes.reviewSectionTitle}>Uploaded Documents</Typography>
              <Table>
                <TableBody>
                  {formData.documents.map((doc, index) => (
                    <React.Fragment key={index}>
                      <TableRow>
                        <TableCell>{doc.name}</TableCell>
                        <TableCell>{doc.type}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => setExpandedDoc(expandedDoc === index ? null : index)}>
                            {expandedDoc === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        </TableCell>
                      </TableRow>
                      {expandedDoc === index && (
                        <TableRow>
                          <TableCell colSpan={3}>
                            <img src={doc.data} alt={doc.name} style={{ width: '100%' }} />
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" className={classes.reviewSectionTitle}>Payment Info</Typography>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Payment Method</TableCell>
                    <TableCell>{PaymentMethod}</TableCell>
                  </TableRow>
                  {PaymentMethod === 'cash' && (
                    <TableRow>
                      <TableCell>Amount</TableCell>
                      <TableCell>{Amount}</TableCell>
                    </TableRow>
                  )}
                  {PaymentMethod === 'upi' && (
                    <TableRow>
                      <TableCell>Transaction ID</TableCell>
                      <TableCell>{TransactionId}</TableCell>
                    </TableRow>
                  )}
                  {PaymentMethod === 'bankTransfer' && (
                    <TableRow>
                      <TableCell>Bank Transfer</TableCell>
                      <TableCell>{BankTransfer}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Grid>
          </Grid>
        </div>
      );
    default:
      throw new Error('Unknown step');
  }
}

export default function EnrollForm() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const { globalData } = useContext(GlobalStateContext);
  const [formData, setFormData] = useState({
    personalInfo: {
      StudentName: '',
      DOB: '',
      Gender: '',
      Photo: '',
      Grade: '',
      PreviousSchool: '',
      languages: [''],
      Religion: '',
      Category: '',
      Nationality: '',
      AadharNumber: '',
      Password: '',
    },
    guardianInfo: {
      MotherName: '',
      FatherName: '',
      ParentOccupation: '',
      ParentQualification: '',
      currentAddress: {
        line1: '',
        line2: '',
        city: '',
        district: '',
        state: '',
        pincode: ''
      },
      permanentAddress: {
        line1: '',
        line2: '',
        city: '',
        district: '',
        state: '',
        pincode: ''
      },
      EmergencyContact: '',
      MobileNumber: ''
    },
    academicInfo: {},
    documents: [],
    paymentInfo: {}, // Add paymentInfo to formData
  });
  const [open, setOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showDocuments, setShowDocuments] = useState(false);
  const [expandedDoc, setExpandedDoc] = useState(null);

  const validateStep = () => {
    if (activeStep === 0) {
      const { StudentName, DOB, Gender, Grade, AadharNumber } = formData.personalInfo;
      return StudentName && DOB && Gender && Grade && AadharNumber;
    } else if (activeStep === 1) {
      const { MotherName, FatherName, ParentOccupation, ParentQualification, currentAddress, permanentAddress, EmergencyContact, MobileNumber } = formData.guardianInfo;
      return MotherName && FatherName && ParentOccupation && ParentQualification && EmergencyContact && MobileNumber &&
        currentAddress.line1 && currentAddress.city && currentAddress.district && currentAddress.state && currentAddress.pincode &&
        permanentAddress.line1 && permanentAddress.city && permanentAddress.district && permanentAddress.state && permanentAddress.pincode;
    } else if (activeStep === 3) {
      return requiredDocuments.every(docType => formData.documents.some(doc => doc.type === docType));
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) {
      alert('Please fill all required fields.');
      return;
    }
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleStepClick = (step) => {
    if (step <= activeStep || validateStep()) {
      setActiveStep(step);
    } else {
      alert('Please fill all required fields.');
    }
  };

  const handleEnrollMore = () => {
    setActiveStep(0);
    setFormData({
      personalInfo: {
        StudentName: '',
        DOB: '',
        Gender: '',
        Photo: '',
        Grade: '',
        PreviousSchool: '',
        languages: [''],
        Religion: '',
        Category: '',
        Nationality: '',
        AadharNumber: '',
        Password: '',
      },
      guardianInfo: {
        MotherName: '',
        FatherName: '',
        ParentOccupation: '',
        ParentQualification: '',
        currentAddress: {
          line1: '',
          line2: '',
          city: '',
          district: '',
          state: '',
          pincode: ''
        },
        permanentAddress: {
          line1: '',
          line2: '',
          city: '',
          district: '',
          state: '',
          pincode: ''
        },
        EmergencyContact: '',
        MobileNumber: ''
      },
      academicInfo: {},
      documents: [],
      paymentInfo: {}, // Reset paymentInfo
    });
  };

    const handleSubmit = async () => {
    console.log('Form submitted:', formData);
  
    // Upload documents to Firebase and collect URLs
    const uploadedDocuments = [];
    for (const doc of formData.documents) {
      const storageRef = ref(storage, `documents/${doc.type}/${doc.name}`);
      try {
        await uploadString(storageRef, doc.data, 'data_url');
        const downloadURL = await getDownloadURL(storageRef);
        uploadedDocuments.push({
          name: doc.name,
          type: doc.type,
          url: downloadURL,
        });
        console.log(`Document uploaded: ${doc.type} - ${doc.name} - URL: ${downloadURL}`);
      } catch (error) {
        console.error("Error uploading document: ", error);
      }
    }
  
    // Prepare PaymentDetails based on selected payment method
    const { PaymentMethod, Amount, TransactionId, BankTransfer } = formData.paymentInfo;
    let PaymentDetails = { PaymentMethod };
    if (PaymentMethod === 'cash') {
      PaymentDetails = { ...PaymentDetails, Amount };
    } else if (PaymentMethod === 'upi') {
      PaymentDetails = { ...PaymentDetails, TransactionId };
    } else if (PaymentMethod === 'bankTransfer') {
      PaymentDetails = { ...PaymentDetails, BankTransfer };
    }
  
    // Prepare payload
    const payload = {
      SchoolId: globalData.data.SCHOOL_ID,
      StudentName: formData.personalInfo.StudentName,
      DOB: formData.personalInfo.DOB,
      Gender: formData.personalInfo.Gender,
      Photo: formData.personalInfo.Photo, // Use the URL of the uploaded photo
      Grade: formData.personalInfo.Grade,
      PreviousSchool: formData.personalInfo.PreviousSchool,
      LanguagesKnown: formData.personalInfo.languages,
      Religion: formData.personalInfo.Religion,
      Category: formData.personalInfo.Category,
      MotherName: formData.guardianInfo.MotherName,
      FatherName: formData.guardianInfo.FatherName,
      Nationality: formData.personalInfo.Nationality,
      AadharNumber: formData.personalInfo.AadharNumber,
      GuardianName: formData.guardianInfo.GuardianName,
      MobileNumber: formData.guardianInfo.MobileNumber,
      Email: formData.guardianInfo.Email,
      EmergencyContact: formData.guardianInfo.EmergencyContact,
      CurrentAddress: formData.guardianInfo.currentAddress,
      PermanentAddress: formData.guardianInfo.permanentAddress,
      PreviousPercentage: formData.academicInfo.PreviousPercentage,
      BloodGroup: formData.academicInfo.BloodGroup,
      MedicalDisability: formData.academicInfo.MedicalDisability,
      Documents: uploadedDocuments.reduce((acc, doc) => {
        acc[doc.type] = doc.url;
        return acc;
      }, {}),
      PaymentDetails,
      Password: formData.personalInfo.Password,
      ParentOccupation: formData.guardianInfo.ParentOccupation,
      ParentQualification: formData.guardianInfo.ParentQualification,
    };
  
    // Log payload to console
    console.log('Payload to be sent:', payload);
  
    // Send formData and uploadedDocuments to backend
    try {
      const response = await fetch(`${BaseUrl}/registerstudent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error('Form submission failed');
      }
  
      const data = await response.json();
      console.log('Form data sent to backend successfully:', data);
  
      // Clear local storage after successful submission
      localStorage.removeItem('uploadedDocuments');
    } catch (error) {
      console.error('Error sending form data to backend:', error);
    }
  };

  const handleDocumentClick = (doc) => {
    setSelectedDoc(doc);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDoc(null);
  };

  return (
    <React.Fragment>
      <Navbar schoolName={globalData.data.SCHOOL_NAME} schoolLogo={globalData.data.SCHOOL_LOGO} />
      <main className="layout">
        <Sidebar visibleItems={['home', 'updateEnrollment']} hideProfile={true} showTitle={false} />
        <Paper className="paper">
          <Typography component="h1" variant="h4" align="center">
            Student's Enroll Form
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} style={{ marginTop: '20px', marginBottom: '12px' }}>
              <Typography variant="h6" style={{ fontSize: '1rem' }}>{globalData.data.SCHOOL_NAME}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} style={{ textAlign: 'right', marginTop: '16px' }}>
              <Typography variant="h6" style={{ fontSize: '1rem' }}>School ID : {globalData.data.SCHOOL_ID}</Typography>
            </Grid>
          </Grid>
          <Stepper activeStep={activeStep} className="stepper">
            {steps.map((label, index) => (
              <Step key={label} onClick={() => handleStepClick(index)}>
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
                    className={classes.button}
                  >
                    Enroll More
                  </Button>
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {getStepContent(activeStep, formData, setFormData, handleDocumentClick, expandedDoc, setExpandedDoc, classes)}
                <div className="buttons">
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} className={classes.button}>
                      Back
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                    className={`${classes.button} ${classes.nextButton}`}
                  >
                    {activeStep === steps.length - 1 ? 'Verify and Submit' : 'Next'}
                  </Button>
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        </Paper>
      </main>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Document Content</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedDoc ? (
              <div>
                <Typography variant="h6">{selectedDoc.name}</Typography>
                <img src={selectedDoc.data} alt={selectedDoc.name} style={{ width: '100%' }} />
              </div>
            ) : (
              'No document selected'
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}