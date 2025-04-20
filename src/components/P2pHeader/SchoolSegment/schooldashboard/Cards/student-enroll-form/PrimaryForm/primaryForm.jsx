import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
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
      // currentAddress: {
      //   line1: '',
      //   line2: '',
      //   city: '',
      //   district: '',
      //   state: '',
      //   pincode: ''
      // },
      // permanentAddress: {
      //   line1: '',
      //   line2: '',
      //   city: '',
      //   district: '',
      //   state: '',
      //   pincode: ''
      // },
      address: {
        line1: '',
        line2: '',
        landmark: '',
        locality: '',
        city: '',
        district: '',
        state: '',
        country: 'India',
        pincode: '',
        address_type: ''
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


  const validatePersonalInfo = () => {
    const errors = {};
    const { 
      student_name, 
      dob, 
      gender, 
      grade, 
      aadhar_number,
      religion,
      category,
      nationality,
      languagesKnown
    } = formData.personalInfo;
  
    // Required field validation
    if (!student_name) errors.student_name = 'Student name is required';
    if (!dob) errors.dob = 'Date of birth is required';
    if (!gender) errors.gender = 'Gender is required';
    if (!grade) errors.grade = 'Class is required';
    if (!aadhar_number) errors.aadhar_number = 'Aadhar number is required';
    if (!religion) errors.religion = 'Religion is required';
    if (!category) errors.category = 'Category is required';
    if (!nationality) errors.nationality = 'Nationality is required';
    
    // Validate languages
    if (!languagesKnown || languagesKnown.length === 0 || 
        languagesKnown.some(lang => !lang.language_id || !lang.language_type)) {
      errors.languages = 'At least one language is required';
    }
  
    // Format validation
    if (student_name && !validateAlphabets(student_name)) {
      errors.student_name = 'Invalid alphabetic input';
    }
    if (aadhar_number && !validateNumbers(aadhar_number)) {
      errors.aadhar_number = 'Invalid numeric input';
    }
    if (dob) {
      const currentDate = new Date().toISOString().split('T')[0];
      if (dob > currentDate) {
        errors.dob = 'Date of Birth cannot be in the future';
      }
    }
  
    return errors;
  };

// Update the validateGuardianInfo function in primaryForm.jsx
const validateGuardianInfo = (formData) => {
  const errors = {};
  const { 
    father_name,
    mother_name,
    parent_occupation,
    parent_qualification,
    mobile_number,
    email,
    emergency_contact,
    address
  } = formData.guardianInfo;

  // Parent Information validation
  if (!father_name) errors.father_name = "Father's name is required";
  if (!mother_name) errors.mother_name = "Mother's name is required";
  if (!parent_occupation) errors.parent_occupation = "Parent occupation is required";
  if (!parent_qualification) errors.parent_qualification = "Parent qualification is required";

  // Contact Information validation
  if (!mobile_number) {
    errors.mobile_number = "Phone number is required";
  } else if (!validateNumbers(mobile_number)) {
    errors.mobile_number = "Invalid phone number (must be 10 digits)";
  } else if (mobile_number.length !== 10) {
    errors.mobile_number = "Phone number must be 10 digits";
  }

  if (!email) {
    errors.email = "Email is required";
  } else if (!validateEmail(email)) {
    errors.email = "Email must end with @gmail.com";
  }

  if (!emergency_contact) {
    errors.emergency_contact = "Emergency contact is required";
  } else if (!validateNumbers(emergency_contact)) {
    errors.emergency_contact = "Invalid emergency contact";
  } else if (emergency_contact.length !== 10) {
    errors.emergency_contact = "Emergency contact must be 10 digits";
  }

  // Address Information validation
  if (!address?.line1) errors.line1 = "Address line 1 is required";
  if (!address?.city) errors.city = "City is required";
  if (!address?.district) errors.district = "District is required";
  if (!address?.state) errors.state = "State is required";
  if (!address?.pincode) {
    errors.pincode = "Pincode is required";
  } else if (!validateNumbers(address.pincode)) {
    errors.pincode = "Invalid pincode (must be numbers)";
  } else if (address.pincode.length !== 6) {
    errors.pincode = "Pincode must be 6 digits";
  }
  if (!address?.address_type) errors.address_type = "Address type is required";

  if (father_name && !validateAlphabets(father_name)) {
    errors.father_name = 'Invalid alphabetic input';
  }
  if (mother_name && !validateAlphabets(mother_name)) {
    errors.mother_name = 'Invalid alphabetic input';
  }

  return errors;
};

const validateAcademicInfo = (formData) => {
  const errors = {};
  const{
    blood_group
  } = formData.academicInfo;

  if (!blood_group) {
    errors.blood_group = "Blood group is required";
  }
  
  return errors;
};

const handleNext = () => {
  let errors = {};
  let isValid = true;
  
  if (activeStep === 0) {
    errors = validatePersonalInfo(formData);
  } else if (activeStep === 1) {
    errors = validateGuardianInfo(formData);
  }
  else if (activeStep === 2) {
    errors = validateAcademicInfo(formData);
  }
  // Add validation for other steps as needed

  // Check if there are any errors
  isValid = Object.keys(errors).length === 0;

  if (!isValid) {
    // Show all errors in an alert
    const errorMessages = Object.values(errors).filter(msg => msg).join('\n• ');
    alert(`Please fix the following errors:\n\n• ${errorMessages}`);
    return;
  }

  // Only proceed if validation passes
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
        
  const handleSuccessClose = () => {
    const navigate = useNavigate(); // Initialize the navigate function
    setLoading(true);
    setSuccessDialogOpen(false);
    setTimeout(() => {
      const schoolId = globalData.data.school_id; // Retrieve schoolId from globalData
      navigate(`/school_dashboard/${schoolId}`); // Navigate to the school_dashboard with schoolId
    }, 1000);
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

  const getDocumentTypeId = (documentType) => {
    // This should exactly match your document_type table in the database
    const typeMap = {
      'aadhar': 16,                // Aadhar Card
      'birth_certificate': 15,      // Birth Certificate
      'medical_history': 19,        // Medical Certificate
      'previous_school_tc': 17,     // Transfer Certificate
      'passport_photo': 20,         // Passport Photo
      'parent_id_proof': 21,        // Parent ID Proof
      'caste_certificate': 18       // Caste Certificate
    };
    
    const typeId = typeMap[documentType];
    
    if (!typeId) {
      console.error(`Unknown document type: ${documentType}`);
      console.log('Available document types:', Object.keys(typeMap));
    }
    
    return typeId;
  };

const handleSubmit = async () => {
  setLoading(true);
  
  // Upload photo to Firebase
  let photoURL = '';
  if (formData.personalInfo.photo && formData.personalInfo.photo.startsWith('data:image/')) {
    const photoRef = ref(storage, `student_photos/${formData.personalInfo.aadhar_number}_photo`);
    try {
      await uploadString(photoRef, formData.personalInfo.photo, 'data_url');
      photoURL = await getDownloadURL(photoRef);
    } catch (error) {
      console.error("Error uploading photo: ", error);
    }
  }

  // Upload documents to Firebase and prepare payload
  const documentsPayload = [];
  for (const doc of formData.documents) {
    const storageRef = ref(storage, `student_documents/${formData.personalInfo.aadhar_number}/${doc.type}_${Date.now()}`);
    try {
      await uploadString(storageRef, doc.data, 'data_url');
      const downloadURL = await getDownloadURL(storageRef);
      
      const documentTypeId = getDocumentTypeId(doc.type);
      if (!documentTypeId) {
        console.error(`Unknown document type: ${doc.type}`);
        continue;
      }

      // Calculate file size in KB (base64 string length * 3/4 / 1024)
      const fileSizeKB = (doc.data.length * (3/4)) / 1024;
      
      // Extract file type from data URL
      const fileType = doc.data.match(/^data:(.*?);/)[1];

      documentsPayload.push({
        document_type_id: documentTypeId,
        document_url: downloadURL,
        file_name: doc.name,
        file_size_kb: fileSizeKB,
        file_type: fileType
      });
    } catch (error) {
      console.error(`Error uploading ${doc.type}: `, error);
    }
  }

    const payload = {
      school_id: globalData.data.school_id,
      name: formData.personalInfo.student_name,
      dob: formData.personalInfo.dob,
      aadhar_number: formData.personalInfo.aadhar_number,
      contact_number: formData.guardianInfo.mobile_number,
      grade: formData.personalInfo.grade,
      gender: formData.personalInfo.gender,
      student_email: formData.guardianInfo.email,
      previous_school: formData.personalInfo.previous_school,
      mother_name: formData.guardianInfo.mother_name,
      father_name: formData.guardianInfo.father_name,
      guardian_name: formData.guardianInfo.guardian_name,
      emergency_contact: formData.guardianInfo.emergency_contact,
      previous_percentage: formData.academicInfo.previous_percentage,
      religion_id: formData.personalInfo.religion_id,
      category_id: formData.personalInfo.category_id,
      nationality_id: formData.personalInfo.nationality_id,
      medical_disability_id: formData.academicInfo.disability_id,
      parent_qualification_id: formData.guardianInfo.qualification_id,
      parent_occupation_id: formData.guardianInfo.occupation_id,
      languages: formData.personalInfo.languagesKnown,
      address: {
        line1: formData.guardianInfo.address.line1,
        line2: formData.guardianInfo.address.line2 || '',
        landmark: formData.guardianInfo.address.landmark || '',
        locality: formData.guardianInfo.address.locality || '',
        city: formData.guardianInfo.address.city,
        district: formData.guardianInfo.address.district,
        state: formData.guardianInfo.address.state,
        country: formData.guardianInfo.address.country || 'India',
        pincode: formData.guardianInfo.address.pincode,
        address_type: formData.guardianInfo.address.address_type
      }, 
      photo_url: photoURL,
      documents: documentsPayload

    };
    
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
    
      const data = await response.json();
    
      if (!response.ok) {
        if (response.status === 409) { // Assuming 409 is the status code for user already exists
          console.warn('User already exists:', data.detail);
          alert(data.detail); // Show the error message from the backend
        } else {
          throw new Error('Form submission failed');
        }
      } else {
        console.log('Form data sent to backend successfully:', data);
        setUserId(data.user_id || ''); // Use the returned user_id if available
        setPassword(data.password || ''); // Use the returned password if available
        // Clear local storage after successful submission
        localStorage.removeItem('uploadedDocuments');
        // Open success dialog
        setSuccessDialogOpen(true);
      }
    } catch (error) {
      console.error('Error sending form data to backend:', error);
      alert('An error occurred while submitting the form. Please try again.');
    } finally {
      setLoading(false);
    }
  }
      const handleDocumentClick = (doc) => {
        setSelectedDoc(doc);
        setOpen(true);
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