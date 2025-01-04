import React, { useState, useContext } from "react";
import Grid from '@mui/material/Grid';
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import StaffPersonalInfo from "../StaffPersonalInfo/staffPersonalInfo";
import ProfessionalDetailsForm from "../StaffProfessionalInfo/staffProfessionalInfo";
import EmploymentDetailsForm from "../StaffEmployementInfo/staffEmployementInfo";
import EmergencyContactForm from "../StaffEmergencyContactInfo/staffEmergencyContactInfo";
import DocumentsUploadForm from "../StaffDocumentsUpload/staffDocumentUpload";
import AdditionalFieldsForm from "../StaffAdditionalInfo/staffAdditionalInfo";
import Sidebar from "../../../Sidebar/Sidebar";
import Navbar from "../../../Navbar/Navbar";
import BaseUrl from "../../../../../../../config";
import { GlobalStateContext } from "../../../../../../../GlobalStateContext";
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Check from '@mui/icons-material/Check';
import { PiBagSimpleFill } from "react-icons/pi";
import ReviewForm from '../StaffReviewForm/staffReviewForm';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { BsPersonWorkspace } from "react-icons/bs";
import { IoCall } from "react-icons/io5";
import { RiFolderUploadFill } from "react-icons/ri";
import { FaAddressCard } from "react-icons/fa6";
import { MdAddCircle } from "react-icons/md";
import { MdRateReview } from "react-icons/md";
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import HashLoader from 'react-spinners/HashLoader';
import { useTheme } from '@mui/material/styles';
import './staffPrimaryForm.css';

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
  width: 30, // Decreased size
  height: 30, // Decreased size
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
    2: <PiBagSimpleFill />,
    3: <BsPersonWorkspace />,
    4: <IoCall />,
    5: <RiFolderUploadFill />,
    6: <MdAddCircle />,
    7: <MdRateReview />,
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

const steps = ["Personal details", "Professional Details", "Employment Details", "Emergency Contact Info", "Documents Upload", "Additional Fields", "Review & Submit"];

const useStyles = makeStyles((theme) => ({
  formContainer: {
    overflow: 'hidden', // Ensure the container grows based on its content
    maxHeight: 'none', // Remove the maximum height restriction
    height: 'auto', // Ensure the height adjusts automatically
  },
  reviewTitle: {
    color: theme.palette.primary.main,
    fontSize: '1.5rem',
    textAlign: 'center',
    margin: '24px 0 24px ',
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

function getStepContent(step, formData, setFormData, schoolInfo, expandedDoc, setExpandedDoc, classes) {
  switch (step) {
    case 0:
      return (
        <StaffPersonalInfo formData={formData} setFormData={setFormData} className="formContainer"/>
      );
    case 1:
      return (
        <ProfessionalDetailsForm formData={formData} setFormData={setFormData}/>
      );
    case 2:
      return (
        <EmploymentDetailsForm formData={formData} setFormData={setFormData} />
      );
    case 3:
      return (
        <EmergencyContactForm formData={formData} setFormData={setFormData} />
      );
    case 4:
      return (
        <DocumentsUploadForm formData={formData} setFormData={setFormData} />
      );
    case 5:
      return (
        <AdditionalFieldsForm formData={formData} setFormData={setFormData} />
      );
    case 6:
      return (
        <ReviewForm formData={formData} expandedDoc={expandedDoc} setExpandedDoc={setExpandedDoc} classes={classes} />
      );
    default:
      throw new Error("Unknown step");
  }
}

export default function StaffPrimaryForm() {
  const classes = useStyles();
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const { globalData } = useContext(GlobalStateContext);
  const schoolInfo = globalData.schoolInfo || {};
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: "",
      profilepic: "",
      dob: "",
      gender: "",
      contactNumber: "",
      email: "",
      currentAddress: {
        line1: "",
        line2: "",
        city: "",
        district: "",
        state: "",
        pinCode: "",
      },
      permanentAddress: {
        line1: "",
        line2: "",
        city: "",
        district: "",
        state: "",
        pinCode: "",
      },
    },
    professionalInfo: {
      position: [],
      subjectSpecialization: "",
      grade: [],
      experience: "",
      qualification: "",
      certifications: "",
    },
    employmentInfo: {
      joiningDate: "",
      employmentType: "",
      otherEmploymentType: "",
      previousSchool: "",
    },
    emergencyContactInfo: {
      emergencyContactName: "",
      emergencyContactNumber: "",
      relationshipToTeacher: "",
    },
    additionalInfo: {
      languagesKnown: [],
      interests: "",
      availabilityOfExtraCirricularActivities: "",
    },
    documents: [],
  });
  const [errors, setErrors] = useState({});
  const [expandedDoc, setExpandedDoc] = useState(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [Password, setPassword] = useState('');
  const [UserId, setUserId] = useState('');

  const validatePersonalInfo = () => {
    const { personalInfo } = formData;
    const requiredFields = ['fullName', 'dob', 'gender', 'email', 'contactNumber'];
    const requiredAddressFields = ['line1', 'city', 'district', 'state', 'pinCode'];
    let isValid = true;
    let newErrors = {};
  
    // Validate required fields
    requiredFields.forEach((field) => {
      if (!personalInfo[field]) {
        isValid = false;
        newErrors[field] = 'This field is required';
      }
    });
  
    // Validate current address fields
    requiredAddressFields.forEach((field) => {
      if (!personalInfo.currentAddress[field]) {
        isValid = false;
        newErrors[`currentAddress.${field}`] = 'This field is required';
      }
    });
  
    // Validate permanent address fields if not same as current
    if (!personalInfo.sameAsCurrent) {
      requiredAddressFields.forEach((field) => {
        if (!personalInfo.permanentAddress[field]) {
          isValid = false;
          newErrors[`permanentAddress.${field}`] = 'This field is required';
        }
      });
    }
  
    setErrors(newErrors);
    return isValid;
  };

  const validateProfessionalInfo = () => {
    const { professionalInfo } = formData;
    const requiredFields = ['position', 'qualification', 'grades'];
    let isValid = true;
    let newErrors = {};
  
    // Validate required fields
    requiredFields.forEach((field) => {
      if (!professionalInfo[field] || (Array.isArray(professionalInfo[field]) && professionalInfo[field].length === 0)) {
        isValid = false;
        newErrors[field] = 'This field is required';
      }
    });
  
    // Validate grades
    if (!professionalInfo.grades || !Array.isArray(professionalInfo.grades) || professionalInfo.grades.some(grade => !grade.value || !grade.subjects || grade.subjects.length === 0)) {
      isValid = false;
      newErrors.grades = 'Each grade must have a value and at least one subject';
    }
  
    setErrors(newErrors);
    return isValid;
  };

  const validateEmploymentInfo = () => {
    const { employmentInfo } = formData;
    const requiredFields = ['joiningDate', 'employmentType'];
    let isValid = true;
    let newErrors = {};

    requiredFields.forEach((field) => {
      if (!employmentInfo[field]) {
        isValid = false;
        newErrors[field] = 'This field is required';
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const validateEmergencyContactInfo = () => {
    const { emergencyContactInfo } = formData;
    const requiredFields = ['emergencyContactName', 'emergencyContactNumber', 'relationshipToTeacher'];
    let isValid = true;
    let newErrors = {};

    requiredFields.forEach((field) => {
      if (!emergencyContactInfo[field]) {
        isValid = false;
        newErrors[field] = 'This field is required';
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const validateDocumentUpload = () => {
    const requiredDocuments = ['resume', 'photoID'];
    let isValid = true;
    let newErrors = {};

    requiredDocuments.forEach((docType) => {
      if (!formData.documents.some(doc => doc.type === docType)) {
        isValid = false;
        newErrors[docType] = 'This document is required';
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (activeStep === 0 && !validatePersonalInfo()) {
      alert("Please fill out all required fields in Personal Details.");
      return;
    }
    if (activeStep === 1 && !validateProfessionalInfo()) {
      alert("Please fill out all required fields in Professional Details. Ensure each grade has a value and at least one subject.");
      return;
    }
    if (activeStep === 2 && !validateEmploymentInfo()) {
      alert("Please fill out all required fields in Employment Details.");
      return;
    }
    if (activeStep === 3 && !validateEmergencyContactInfo()) {
      alert("Please fill out all required fields in Emergency Contact Info.");
      return;
    }
    if (activeStep === 4 && !validateDocumentUpload()) {
      alert("Please upload all required documents.");
      return;
    }
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  // const handleStepClick = (step) => {
  //   if (step < activeStep) {
  //     setActiveStep(step);
  //     return;
  //   }

  //   let isValid = true;
  //   switch (activeStep) {
  //     case 0:
  //       isValid = validatePersonalInfo();
  //       break;
  //     case 1:
  //       isValid = validateProfessionalInfo();
  //       break;
  //     case 2:
  //       isValid = validateEmploymentInfo();
  //       break;
  //     case 3:
  //       isValid = validateEmergencyContactInfo();
  //       break;
  //     case 4:
  //       isValid = validateDocumentUpload();
  //       break;
  //     default:
  //       break;
  //   }

  //   if (isValid) {
  //     setActiveStep(step);
  //   } else {
  //     alert("Please fill out all required fields before proceeding.");
  //   }
  // };

   const handleEnrollMore = () => {
    setFormData({
      personalInfo: {
        fullName: "",
        profilepic: "",
        dob: "",
        gender: "",
        contactNumber: "",
        email: "",
        currentAddress: {
          line1: "",
          line2: "",
          city: "",
          district: "",
          state: "",
          pinCode: "",
        },
        permanentAddress: {
          line1: "",
          line2: "",
          city: "",
          district: "",
          state: "",
          pinCode: "",
        },
      },
      professionalInfo: {
        position: [],
        subjectSpecialization: "",
        grade: [],
        experience: "",
        qualification: "",
        certifications: "",
      },
      employmentInfo: {
        joiningDate: "",
        employmentType: "",
        otherEmploymentType: "",
        previousSchool: "",
      },
      emergencyContactInfo: {
        emergencyContactName: "",
        emergencyContactNumber: "",
        relationshipToTeacher: "",
      },
      additionalInfo: {
        languagesKnown: "",
        interests: "",
        availabilityOfExtraCirricularActivities: "",
      },
      documents: [],
    });
    setActiveStep(0);
    setSuccessDialogOpen(false);
  };

  const handleSubmit = async () => {
    setLoading(true); // Start the loader
  
    const gradeMapping = {
      1: 'Class 1',
      2: 'Class 2',
      3: 'Class 3',
      4: 'Class 4',
      5: 'Class 5',
      6: 'Class 6',
      7: 'Class 7',
      8: 'Class 8',
      9: 'Class 9',
      10: 'Class 10',
      11: 'Class 11',
      12: 'Class 12',
    };
    
        const payload = {
      SchoolId: globalData.data.SCHOOL_ID,
      fullName: formData.personalInfo.fullName,
      profilepic: formData.personalInfo.profilePic,
      dob: formData.personalInfo.dob,
      gender: formData.personalInfo.gender === 'other' ? formData.personalInfo.customGender : formData.personalInfo.gender,
      contactNumber: formData.personalInfo.contactNumber,
      email: formData.personalInfo.email,
      currentAddress: formData.personalInfo.currentAddress,
      permanentAddress: formData.personalInfo.permanentAddress,
      position: formData.professionalInfo.position.filter(pos => pos !== ''),
      subjectSpecialization: formData.professionalInfo.grades.reduce((acc, grade) => {
        const gradeText = gradeMapping[grade.value] || `Class ${grade.value}`;
        acc[gradeText] = grade.subjects || [];
        return acc;
      }, {}),
      experience: formData.professionalInfo.experience,
      qualification: formData.professionalInfo.qualification === 'Other' ? formData.professionalInfo.otherQualification : formData.professionalInfo.qualification,      certifications: formData.professionalInfo.certifications,
      joiningDate: formData.employmentInfo.joiningDate,
      employmentType: formData.employmentInfo.employmentType === 'Other' ? formData.employmentInfo.otherEmploymentType : formData.employmentInfo.employmentType,
      previousSchool: formData.employmentInfo.previousSchool,
      emergencyContactName: formData.emergencyContactInfo.emergencyContactName,
      emergencyContactNumber: formData.emergencyContactInfo.emergencyContactNumber,
      relationshipToTeacher: formData.emergencyContactInfo.relationshipToTeacher,
      languagesKnown: formData.additionalInfo.languagesKnown,
      interests: formData.additionalInfo.interests,
      availabilityOfExtraCirricularActivities: formData.additionalInfo.availabilityOfExtraCirricularActivities,
      documents: formData.documents.reduce((acc, doc) => {
        acc[doc.type] = doc.url;
        return acc;
      }, {}),
    };

    console.log('Payload to be sent:', payload);
    try {
      const response = await fetch(`${BaseUrl}/registerteacher`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error("Form submission failed");
      }
  
      const data = await response.json();
      console.log("Form data sent to backend successfully:", data);
      setPassword(data.password);
      setUserId(data.userid);
            
      // Open success dialog
      setSuccessDialogOpen(true);
    } catch (error) {
      console.error('Error sending form data to backend:', error);
    } finally {
      setLoading(false); // Stop the loader after the dialog is opened
    }
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const handleSuccessClose = () => {
    setLoading(true);
    setSuccessDialogOpen(false);
    setTimeout(() => {
      window.location.href = '/school_dashboard'; // Redirect to school dashboard
    }, 1000);
  };

  return (
    <React.Fragment>
      <Navbar
        schoolName={globalData.data.SCHOOL_NAME}
        schoolLogo={globalData.data.SCHOOL_LOGO}
      />
      <main className="layout">
        <Sidebar
          visibleItems={["home", "updateEnrollment"]}
          hideProfile={true}
          showTitle={false}
        />
        <Paper className="paper" sx={{ padding: 3 }}>
          <Typography component="h1" variant="h4" align="center" className="staff-enroll-title">
            Staff Enroll Form
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} style={{ marginTop: '20px', marginBottom: '12px' }}>
              <Typography variant="h6" className="school-name" style={{ fontSize: '1rem' }}>{globalData.data.SCHOOL_NAME}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} style={{ textAlign: 'right', marginTop: '16px' }}>
              <Typography variant="h6" className="school-id" style={{ fontSize: '1rem' }}>School ID : {globalData.data.SCHOOL_ID}</Typography>
            </Grid>
          </Grid>
          <Stack sx={{ width: '100%' }} spacing={4} className="stepperContainer">
            <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
              {steps.map((label, index) => (
                <Step key={label}>
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
                <Typography variant="subtitle1">Enjoy your journey</Typography>
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
                {getStepContent(activeStep, formData, setFormData, schoolInfo, expandedDoc, setExpandedDoc, classes)}
                <div className="buttons">
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} className="button">
                      Back
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    onClick={
                      activeStep === steps.length - 1
                        ? handleSubmit
                        : handleNext
                    }
                    className="button"
                  >
                    {activeStep === steps.length - 1 ? "Submit" : "Next"}
                  </Button>
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        </Paper>
      </main>
      {loading && (
            <div className="loaderContainer">
              <HashLoader color="#ffffff" size={50} />
            </div>
          )}
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
          <Dialog open={successDialogOpen} onClose={handleSuccessClose}>
            <DialogTitle>Success</DialogTitle>
            <DialogContent>
              <DialogContentText>
                The form has been successfully submitted.
                <br />
                UserId: <strong> {UserId} </strong> 
                <br />
                Password: <strong> {Password} </strong> 
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleSuccessClose} color="primary">
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