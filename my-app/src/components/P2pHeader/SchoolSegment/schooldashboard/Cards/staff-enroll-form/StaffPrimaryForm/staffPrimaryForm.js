import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
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

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  layout: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    height: "100vh",
    width: "100%",
    padding: theme.spacing(2),
    overflow: "auto",
    position: "absolute",
  },
  paper: {
    width: "100%",
    maxWidth: "1000px",
    margin: "24px",
    padding: "16px",
    marginTop: "80px",
    overFlow: "auto",
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
    backgroundColor: "#ff8040",
    color: "white",
    "&:hover": {
      backgroundColor: "#faaa72",
    },
  },
}));

const steps = [
  "Personal details",
  "Professional Details",
  "Employment Details",
  "Emergency Contact Info",
  "Documents Upload",
  "Additional Fields",
];

function getStepContent(step, formData, setFormData) {
  switch (step) {
    case 0:
      return (
        <StaffPersonalInfo
          formData={formData}
          setFormData={setFormData}
        />
      );
    case 1:
      return (
        <ProfessionalDetailsForm
          formData={formData}
          setFormData={setFormData}
        />
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
    default:
      throw new Error("Unknown step");
  }
}

export default function StaffPrimaryForm() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const { globalData } = useContext(GlobalStateContext);
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: "",
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
      position: "",
      subjectSpecialization: "",
      grade: "",
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

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleEnrollMore = () => {
    setActiveStep(0);
  };

  const handleSubmit = async () => {
    const payload = {
      fullName: formData.personalInfo.fullName,
      dob: formData.personalInfo.dob,
      gender: formData.personalInfo.gender,
      contactNumber: formData.personalInfo.contactNumber,
      email: formData.personalInfo.email,
      currentAddress: formData.personalInfo.currentAddress,
      permanentAddress: formData.personalInfo.permanentAddress,
      position: formData.professionalInfo.position,
      subjectSpecialization: formData.professionalInfo.subjectSpecialization,
      grade: formData.professionalInfo.grade,
      experience: formData.professionalInfo.experience,
      qualification: formData.professionalInfo.qualification,
      certifications: formData.professionalInfo.certifications,
      joiningDate: formData.employmentInfo.joiningDate,
      employmentType: formData.employmentInfo.employmentType,
      otherEmploymentType: formData.employmentInfo.otherEmploymentType,
      previousSchool: formData.employmentInfo.previousSchool,
      emergencyContactName: formData.emergencyContactInfo.emergencyContactName,
      emergencyContactNumber:
        formData.emergencyContactInfo.emergencyContactNumber,
      relationshipToTeacher:
        formData.emergencyContactInfo.relationshipToTeacher,
      languagesKnown: formData.additionalInfo.languagesKnown,
      interests: formData.additionalInfo.interests,
      availabilityOfExtraCirricularActivities:
        formData.additionalInfo.availabilityOfExtraCirricularActivities,
      documents: formData.documents.reduce((acc, doc) => {
        acc[doc.type] = doc.url;
        return acc;
      }, {}),
    };

    // Log payload to console
    console.log(" to be sent:", payload);

    try {
      const response = await fetch(`${BaseUrl}/registerstaff`, {
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
    } catch (error) {
      console.error("Error sending form data to backend:", error);
    }
  };

  return (
    <React.Fragment>
      <Navbar
        schoolName={globalData.data.SCHOOL_NAME}
        schoolLogo={globalData.data.SCHOOL_LOGO}
      />
      <main className={classes.layout}>
        <Sidebar
          visibleItems={["home", "updateEnrollment"]}
          hideProfile={true}
          showTitle={false}
        />
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            Staff Enroll Form
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
                <Typography variant="subtitle1">Enjoy your journey</Typography>
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
                {getStepContent(activeStep, formData, setFormData)}
                <div className={classes.buttons}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} className={classes.button}>
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
                    className={classes.button}
                  >
                    {activeStep === steps.length - 1 ? "Submit" : "Next"}
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