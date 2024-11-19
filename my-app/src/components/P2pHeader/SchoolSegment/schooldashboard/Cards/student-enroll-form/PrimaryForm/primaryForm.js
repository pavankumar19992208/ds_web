import React, { useState, useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
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
import ReviewForm from '../ReviewForm/reviewForm';
import './primaryForm.css';
import { GlobalStateContext } from '../../../../../../../GlobalStateContext';
import { storage } from '../../../../../../connections/firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { makeStyles } from '@material-ui/core/styles';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Check from '@mui/icons-material/Check';
import { FaAddressCard } from "react-icons/fa6";
import { RiParentFill } from "react-icons/ri";
import { HiMiniAcademicCap } from "react-icons/hi2";
import { RiFolderUploadFill } from "react-icons/ri";
import { MdOutlinePayment } from "react-icons/md";
import { MdRateReview } from "react-icons/md";
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import BaseUrl from '../../../../../../../config';

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#784af4',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#784af4',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
    ...theme.applyStyles('dark', {
      borderColor: theme.palette.grey[800],
    }),
  },
}));

const QontoStepIconRoot = styled('div')(({ theme }) => ({
  color: '#eaeaf0',
  display: 'flex',
  height: 22,
  alignItems: 'center',
  '& .QontoStepIcon-completedIcon': {
    color: '#784af4',
    zIndex: 1,
    fontSize: 18,
  },
  '& .QontoStepIcon-circle': {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
  ...theme.applyStyles('dark', {
    color: theme.palette.grey[700],
  }),
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        color: '#784af4',
      },
    },
  ],
}));

function QontoStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

QontoStepIcon.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  completed: PropTypes.bool,
};

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 15,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
      'linear-gradient(136deg, rgb(255 255 255) 0%, rgb(33 155 196) 50%, rgb(138, 35, 135) 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
      'linear-gradient(136deg, rgb(255 255 255) 0%, rgb(33 155 196) 50%, rgb(138, 35, 135) 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[800],
    }),
  },
}));

const ColorlibStepIconRoot = styled('div')(({ theme }) => ({
  backgroundColor: '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 30,
  height: 30,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.grey[700],
  }),
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        backgroundImage:
        'linear-gradient(136deg, rgb(255 255 255) 0%, rgb(33 155 196) 50%, rgb(138, 35, 135) 100%)',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
      },
    },
    {
      props: ({ ownerState }) => ownerState.completed,
      style: {
        backgroundImage:
        'linear-gradient(136deg, rgb(255 255 255) 0%, rgb(33 155 196) 50%, rgb(138, 35, 135) 100%)',
      },
    },
  ],
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <FaAddressCard />,
    2: <RiParentFill />,
    3: <HiMiniAcademicCap />,
    4: <RiFolderUploadFill />,
    5: <MdOutlinePayment />,
    6: <MdRateReview />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  completed: PropTypes.bool,
  icon: PropTypes.node,
};

const steps = ['Student Info', 'Guardian Info', 'Academic & Medical Details', 'Upload Documents', 'Payment', 'Review & Submit'];

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
    fontFamily: '"Urbanist", sans-serif',
    fontOpticalSizing: 'auto',
    fontWeight: 500 ,
    '&:hover': {
      backgroundColor: '#0E5E9D60',
      color:'#374441',
    },
  },
  reviewTitle: {
    color: theme.palette.primary.main,
    fontSize: '1.5rem',
    textAlign: 'center',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    fontFamily: '"Urbanist", sans-serif',
    fontOpticalSizing: 'auto',
    fontWeight: 500 ,
    textDecoration: 'underline',
  },
  reviewSectionTitle: {
    color: 'red',
    fontSize: '1.2rem',
    fontFamily: '"Urbanist", sans-serif',
    fontOpticalSizing: 'auto',
    fontWeight: 500 ,
  },
  documentsGrid: {
    width: '80%', // Decrease the width of the uploaded documents grid
    overflow: 'hidden', // Eliminate the scrollbar
  },
}));

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
      return <ReviewForm formData={formData} expandedDoc={expandedDoc} setExpandedDoc={setExpandedDoc} classes={classes} />;
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
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

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
    setSuccessDialogOpen(false);
  };

    const handleSubmit = async () => {
    console.log('Form submitted:', formData);
  
    // Upload photo to Firebase and collect URL
    let photoURL = '';
    if (formData.personalInfo.Photo) {
      const photoRef = ref(storage, `photos/${formData.personalInfo.PhotoName}`);
      try {
        await uploadString(photoRef, formData.personalInfo.Photo, 'data_url');
        photoURL = await getDownloadURL(photoRef);
        console.log(`Photo uploaded: ${formData.personalInfo.PhotoName} - URL: ${photoURL}`);
      } catch (error) {
        console.error("Error uploading photo: ", error);
      }
    }
  
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
  
      // Open success dialog
      setSuccessDialogOpen(true);
    } catch (error) {
      console.error('Error sending form data to backend:', error);
    }
  };
  
  // Add the success dialog to the JSX
  return (
    <React.Fragment>
      <Navbar schoolName={globalData.data.SCHOOL_NAME} schoolLogo={globalData.data.SCHOOL_LOGO} />
      <main className="layout">
        <Sidebar visibleItems={['home', 'updateEnrollment']} hideProfile={true} showTitle={false} />
        <Paper className="paper">
          <Typography component="h1" variant="h4" align="center" className='headline'>
            Student's Enroll Form
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} style={{ marginTop: '20px', marginBottom: '12px' }}>
              <Typography variant="h6" className='school-name' style={{ fontSize: '1rem' }}>{globalData.data.SCHOOL_NAME}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} style={{ textAlign: 'right', marginTop: '16px' }}>
              <Typography variant="h6" className='school-id' style={{ fontSize: '1rem' }}>School ID : {globalData.data.SCHOOL_ID}</Typography>
            </Grid>
          </Grid>
          <Stack sx={{ width: '100%' }} spacing={4}>
            <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />} style={{ marginTop: '20px' }}>
              {steps.map((label, index) => (
                <Step key={label} onClick={() => handleStepClick(index)}>
                  <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Stack>
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
                    className={`${classes.button} ${classes.nextButton} urbanist-font`}
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
      <Dialog open={successDialogOpen} onClose={() => setSuccessDialogOpen(false)}>
        <DialogTitle>Success</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The form has been successfully submitted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSuccessDialogOpen(false)} color="primary">
            Close
          </Button>
          <Button onClick={handleEnrollMore} color="primary">
            Enroll More
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}