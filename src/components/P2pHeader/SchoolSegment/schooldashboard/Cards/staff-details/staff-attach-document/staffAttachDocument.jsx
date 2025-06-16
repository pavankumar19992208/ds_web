import React, { useEffect, useState } from "react";
import {
  MenuItem,
  Select,
  FormControl,
  LinearProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Typography,
  IconButton,
  Stack,
  Alert,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../../../connections/firebase";
import BaseUrl from "../../../../../../../config";
import "./staffAttachDocument.css";

const StaffAttachDocument = () => {
  const [loading, setLoadingState] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("Select Teacher");
  const [selectedTeacherDetails, setSelectedTeacherDetails] = useState({});
  const [openPopup, setOpenPopup] = useState(false);
  const [openErrorPopup, setOpenErrorPopup] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState({});
  const [fileNames, setFileNames] = useState({});
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const fetchTeachers = async () => {
      setLoadingState(true);
      try {
        const response = await fetch(`${BaseUrl}/teachers`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setTeachers(data.teachers || []);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      } finally {
        setLoadingState(false);
      }
    };

    fetchTeachers();
  }, []);

  const handleTeacherChange = (event) => {
    const teacherId = event.target.value;
    setSelectedTeacher(teacherId);
    const teacherDetails = teachers.find(
      (teacher) => teacher.teacherid === teacherId
    );
    setSelectedTeacherDetails(teacherDetails || {});
    if (teacherDetails && teacherDetails.documents) {
      const documents = JSON.parse(teacherDetails.documents);
      setFileNames({
        resume: documents.resume ? documents.resume.split("/").pop() : "",
        photoID: documents.photoID ? documents.photoID.split("/").pop() : "",
        educationalCertificates: documents.educationalCertificates
          ? documents.educationalCertificates.split("/").pop()
          : "",
      });
      setUploadedDocs(documents);
    }
  };

  const handleDocumentUpload = async (event, documentType) => {
    const file = event.target.files[0];
    if (file) {
      const storageRef = ref(storage, `documents/${file.name}`);
      await uploadBytes(storageRef, file);
      const fileURL = await getDownloadURL(storageRef);

      setUploadedDocs((prevDocs) => ({
        ...prevDocs,
        [documentType]: fileURL,
      }));
      setFileNames((prevFileNames) => ({
        ...prevFileNames,
        [documentType]: file.name,
      }));
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const handleSubmit = async () => {
    if (!selectedTeacherDetails.teacherid) {
      setOpenErrorPopup(true);
      return;
    }

    setLoadingState(true);
    try {
      const updatedDocuments = {
        resume: uploadedDocs.resume || selectedTeacherDetails.documents?.resume,
        photoID: uploadedDocs.photoID || selectedTeacherDetails.documents?.photoID,
        educationalCertificates: uploadedDocs.educationalCertificates || selectedTeacherDetails.documents?.educationalCertificates,
      };

      console.log("Payload:", updatedDocuments);

      const response = await fetch(
        `${BaseUrl}/teachers/${selectedTeacherDetails.teacherid}/documents`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...updatedDocuments }),
        }
      );

      if (response.ok) {
        setOpenPopup(true);
      } else {
        setOpenErrorPopup(true);
      }
    } catch (error) {
      console.error("Error updating documents:", error);
      setOpenErrorPopup(true);
    } finally {
      setLoadingState(false);
    }
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
    window.location.reload();
  };

  const handleCloseErrorPopup = () => {
    setOpenErrorPopup(false);
  };

  return (
    <div className="staff-attach-document-container">
      {loading && <LinearProgress />}
      <FormControl
        variant="outlined"
        className="select-class-dropdown"
        style={{ marginRight: "16px" }}
      >
        <Select
          className="custom-select"
          value={selectedTeacher}
          onChange={handleTeacherChange}
          displayEmpty
        >
          <MenuItem value="Select Teacher">Select Teacher</MenuItem>
          {teachers.map((teacher) => (
            <MenuItem key={teacher.teacherid} value={teacher.teacherid}>
              {teacher.Name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div className="teacher-details-grid">
        <div className="teacher-detail">
          <Typography variant="subtitle1">Name</Typography>
          <div className="teacher-field">
            {selectedTeacherDetails.Name || "Name"}
          </div>
        </div>
        <div className="teacher-detail">
          <Typography variant="subtitle1">Resume / CV </Typography>
          <div className="upload-field">
            <input
              type="file"
              id="resume"
              onChange={(e) => handleDocumentUpload(e, "resume")}
              style={{ display: "none" }}
              className="upload-input"
            />
            <label htmlFor="resume" className="upload-label">
              {fileNames.resume || "Upload Resume / CV"}
              <IconButton component="span">
                <UploadIcon />
              </IconButton>
            </label>
          </div>
        </div>
        <div className="teacher-detail">
          <Typography variant="subtitle1">Photo ID </Typography>
          <div className="upload-field">
            <input
              type="file"
              id="photoID"
              onChange={(e) => handleDocumentUpload(e, "photoID")}
              style={{ display: "none" }}
              className="upload-input"
            />
            <label htmlFor="photoID" className="upload-label">
              {fileNames.photoID || "Upload Photo ID"}
              <IconButton component="span">
                <UploadIcon />
              </IconButton>
            </label>
          </div>
        </div>
        <div className="teacher-detail">
          <Typography variant="subtitle1">
            Educational Certificates (optional)
          </Typography>
          <div className="upload-field">
            <input
              type="file"
              id="educationalCertificates"
              onChange={(e) =>
                handleDocumentUpload(e, "educationalCertificates")
              }
              style={{ display: "none" }}
              className="upload-input"
            />
            <label
              htmlFor="educationalCertificates"
              className="upload-label"
            >
              {fileNames.educationalCertificates ||
                "Upload Educational Certificates"}
              <IconButton component="span">
                <UploadIcon />
              </IconButton>
            </label>
          </div>
        </div>
      </div>
      <div className="submit-button-container">
        <button className="submit-btn" onClick={handleSubmit}>
          Submit
        </button>
      </div>
      {showAlert && (
        <Stack
          spacing={2}
          style={{ position: "fixed", top: 64, right: 0, zIndex: 1000 }}
        >
          <Alert severity="success">{`uploaded "${uploadedDocs.name}".`}</Alert>
        </Stack>
      )}
      <Dialog
        open={openPopup}
        onClose={handleClosePopup}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Documents Submitted"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Your documents have been submitted successfully.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openErrorPopup}
        onClose={handleCloseErrorPopup}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Submission Failed"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            There was an error submitting your documents. Please try again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorPopup} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StaffAttachDocument;