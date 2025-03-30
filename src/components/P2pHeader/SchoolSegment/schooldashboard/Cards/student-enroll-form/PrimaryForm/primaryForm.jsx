import React, { useState, useContext } from 'react';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DetailsForm from '../PersonalInfo/personalInfo';
import GuardianInfoForm from '../GuardianInfo/guardianInfo';
import AcademicInfoForm from '../AcademicInfo/academicInfo';
import DocumentsUpload from '../DocumentsUpload/documentsUpload';
import Sidebar from '../../../Sidebar/Sidebar';
import Navbar from '../../../Navbar/Navbar';
import ReviewForm from '../ReviewForm/reviewForm';
import './primaryForm.css';
import { GlobalStateContext } from '../../../../../../../GlobalStateContext';
import { storage } from '../../../../../../connections/firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { makeStyles } from '@mui/styles';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Check from '@mui/icons-material/Check';
import { FaAddressCard } from "react-icons/fa6";
import { RiParentFill } from "react-icons/ri";
import { HiMiniAcademicCap } from "react-icons/hi2";
import { RiFolderUploadFill } from "react-icons/ri";
import { MdRateReview } from "react-icons/md";
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import BaseUrl from '../../../../../../../config';
import HashLoader from 'react-spinners/HashLoader';
import { validateAlphabets, validateNumbers } from '../PersonalInfo/personalInfo';

const validateEmail = (value) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value);

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
    5: <MdRateReview />,
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

const steps = ['Student Info', 'Guardian Info', 'Academic & Medical Details', 'Upload Documents', 'Review & Submit'];

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
      return <ReviewForm formData={formData} expandedDoc={expandedDoc} setExpandedDoc={setExpandedDoc} classes={classes} />;
    default:
      throw new Error('Unknown step');
  }
}

export default function StudentEnrollForm() {
  const classes = useStyles();
  const { globalData } = useContext(GlobalStateContext);
  const [activeStep, setActiveStep] = useState(0);
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
      MobileNumber: '',
      Email: '',
    },
    academicInfo: {},
    documents: [],
  });
  const [ setOpen] = useState(false);
  const [ setSelectedDoc] = useState(null);
  const [expandedDoc, setExpandedDoc] = useState(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state
  const [UserId, setUserId] = useState('');
  const [Password, setPassword] = useState('');

  const validateForm = () => {
    const errors = {};

    // Validate personal info
    if (!formData.personalInfo.StudentName) {
      errors.StudentName = 'Student Name is required';
    }
    if (!formData.personalInfo.DOB) {
      errors.DOB = 'Date of Birth is required';
    }
    if (!formData.personalInfo.Gender) {
      errors.Gender = 'Gender is required';
    }
    if (!formData.personalInfo.Grade) {
      errors.Grade = 'Grade is required';
    }
    if (!formData.personalInfo.AadharNumber) {
      errors.AadharNumber = 'Aadhar Number is required';
    }

    // Validate guardian info
    // if (activeStep === 1) {
    //   if (!formData.guardianInfo.MotherName) {
    //     errors.MotherName = 'Mother Name is required';
    //   }
    //   if (!formData.guardianInfo.FatherName) {
    //     errors.FatherName = 'Father Name is required';
    //   }
    //   if (!formData.guardianInfo.ParentOccupation) {
    //     errors.ParentOccupation = 'Parent Occupation is required';
    //   }
    //   if (!formData.guardianInfo.ParentQualification) {
    //     errors.ParentQualification = 'Parent Qualification is required';
    //   }
    //   if (!formData.guardianInfo.EmergencyContact) {
    //     errors.EmergencyContact = 'Emergency Contact is required';
    //   }
    //   if (!formData.guardianInfo.MobileNumber) {
    //     errors.MobileNumber = 'Mobile Number is required';
    //   }
    //   if (!validateEmail(formData.guardianInfo.Email)) {
    //     errors.Email = 'Invalid Email';
    //   }
    //   if (!formData.guardianInfo.currentAddress.line1) {
    //     errors.currentAddressLine1 = 'Current Address Line 1 is required';
    //   }
    //   if (!formData.guardianInfo.currentAddress.city) {
    //     errors.currentAddressCity = 'Current Address City is required';
    //   }
    //   if (!formData.guardianInfo.currentAddress.district) {
    //     errors.currentAddressDistrict = 'Current Address District is required';
    //   }
    //   if (!formData.guardianInfo.currentAddress.state) {
    //     errors.currentAddressState = 'Current Address State is required';
    //   }
    //   if (!formData.guardianInfo.currentAddress.pincode) {
    //     errors.currentAddressPincode = 'Current Address Pincode is required';
    //   }
    // }

    return errors;
  };

  const validatePersonalInfo = () => {
    const errors = {};
    const { StudentName, Religion, Category, Nationality, AadharNumber, DOB } = formData.personalInfo;
  
    if (!validateAlphabets(StudentName)) {
      errors.StudentName = 'Invalid alphabetic input';
    }
    if (!validateAlphabets(Religion)) {
      errors.Religion = 'Invalid alphabetic input';
    }
    if (!validateAlphabets(Category)) {
      errors.Category = 'Invalid alphabetic input';
    }
    if (!validateAlphabets(Nationality)) {
      errors.Nationality = 'Invalid alphabetic input';
    }
    if (!validateNumbers(AadharNumber)) {
      errors.AadharNumber = 'Invalid numeric input';
    }
  
    const currentDate = new Date().toISOString().split('T')[0];
    if (DOB > currentDate) {
      errors.DOB = 'Date of Birth cannot be in the future';
    }
  
    return errors;
  };

  const handleNext = () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      alert('Please fill all required fields.');
      return;
    }
  
    if (activeStep === 0) {
      const personalInfoErrors = validatePersonalInfo();
      if (Object.keys(personalInfoErrors).length > 0) {
        alert('Please correct the errors in the personal information.');
        return;
      }
    }
  
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  // const handleStepClick = (step) => {
  //   if (step <= activeStep || validateStep()) {
  //     setActiveStep(step);
  //   } else {
  //     alert('Please fill all required fields.');
  //   }
  // };

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
        // Password: '',
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
        MobileNumber: '',
        Email: '',
      },
      academicInfo: {},
      documents: [],
      
    });
    setSuccessDialogOpen(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    console.log('Form submitted:', formData);
  
    // Upload photo to Firebase and collect URL
    let photoURL = formData.personalInfo.Photo;
    if (photoURL && photoURL.startsWith('data:image/')) {
      const photoRef = ref(storage, `photos/${formData.personalInfo.PhotoName}`);
      try {
        await uploadString(photoRef, photoURL, 'data_url');
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
  
    // Prepare payload
    const payload = {
      SchoolId: globalData.data.school_id,
      StudentName: formData.personalInfo.StudentName,
      DOB: formData.personalInfo.DOB,
      Gender: formData.personalInfo.Gender === 'other' ? formData.personalInfo.otherGender : formData.personalInfo.Gender,
      Photo: photoURL, // Use the URL of the uploaded photo
      Grade: formData.personalInfo.Grade,
      PreviousSchool: formData.personalInfo.PreviousSchool,
      LanguagesKnown: formData.personalInfo.languagesKnown,
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
      ParentOccupation: formData.guardianInfo.ParentOccupation,
      ParentQualification: formData.guardianInfo.ParentQualification === 'Other' ? formData.guardianInfo.otherQualification : formData.guardianInfo.ParentQualification,
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
        if (response.status === 409) { // Assuming 409 is the status code for user already exists
          const data = await response.json();
          setSuccessDialogOpen(true);
          setUserId('');
          setPassword('');
          alert(data.detail); // Show the error message from the backend
        } else {
          throw new Error('Form submission failed');
        }
      } else {
        const data = await response.json();
        console.log('Form data sent to backend successfully:', data);
        setUserId(data.UserId);
        setPassword(data.Password);
        // Clear local storage after successful submission
        localStorage.removeItem('uploadedDocuments');
        // Open success dialog
        setSuccessDialogOpen(true);
      }
    } catch (error) {
      console.error('Error sending form data to backend:', error);
    } finally {
      setLoading(false);
    }
  };
      
      const handleDocumentClick = (doc) => {
        setSelectedDoc(doc);
        setOpen(true);
      };
      
      const handleSuccessClose = () => {
        setLoading(true);
        setSuccessDialogOpen(false);
        setTimeout(() => {
          window.location.href = '/school_dashboard'; // Redirect to school dashboard
        }, 1000);
      };
      
      return (
        <div className='enroll-form'>
          <div className="enroll-form-container">
            <Navbar schoolName={globalData.data.school_name} schoolLogo={globalData.data.school_logo} />
            <Sidebar visibleItems={['home', 'updateEnrollment']} hideProfile={true} showTitle={false} />
            <div className="form-paper-container">
            <Paper className="paper">
              <Typography component="h1" variant="h4" align="center" className='headline'>
                Student's Enroll Form
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} style={{ marginTop: '20px', marginBottom: '12px' }}>
                  <Typography variant="h6" className='school-name' style={{ fontSize: '1rem' }}>{globalData.data.school_name}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} style={{ textAlign: 'right', marginTop: '16px' }}>
                  <Typography variant="h6" className='school-id' style={{ fontSize: '1rem' }}>School ID : {globalData.data.school_id}</Typography>
                </Grid>
              </Grid>
              <Stack sx={{ width: '100%' }} spacing={4}>
                <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />} style={{ marginTop: '20px' }}>
                  {steps.map((label, index) => (
                    <Step key={label}>
                      <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Stack>
      
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
            </Paper>
      
            {loading && (
              <div className="loaderContainer">
                <HashLoader color="#ffffff" size={50} />
              </div>
            )}
            <Dialog open={successDialogOpen}
              onClose={handleSuccessClose}
              PaperProps={{
                style: {
                  width: UserId ? 'auto' : '400px',
                  height: UserId ? 'auto' : '200px',
                },
              }}>
              <DialogTitle>{UserId ? 'Success' : 'Failed'}</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  {UserId ? (
                    <>
                      The form has been submitted successfully.
                      <br />
                      User ID: <strong>{UserId}</strong>
                      <br />
                      Password: <strong>{Password}</strong>
                    </>
                  ) : (
                    'User already exists.'
                  )}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleSuccessClose} color="primary">
                  Close
                </Button>
                {UserId && (
                  <Button onClick={handleEnrollMore} color="primary">
                    Enroll More
                  </Button>
                )}
              </DialogActions>
            </Dialog>
            </div>
          </div>
        </div>
      );
    }