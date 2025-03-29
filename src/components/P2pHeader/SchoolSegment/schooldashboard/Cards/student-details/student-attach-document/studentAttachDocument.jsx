import React, { useState, useEffect } from 'react';
import { MenuItem, Select, FormControl, LinearProgress, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../../../../connections/firebase';
import BaseUrl from '../../../../../../../config';
import './studentAttachDocument.css';

const StudentAttachDocument = () => {
  const [selectedClass, setSelectedClass] = useState('Select Class');
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoadingState] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('Select student');
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [selectedStudentDetails, setSelectedStudentDetails] = useState({});
  const [openPopup, setOpenPopup] = useState(false);
  const [openErrorPopup, setOpenErrorPopup] = useState(false);

  useEffect(() => {
    const fetchGrades = async () => {
      setLoadingState(true);
      try {
        const response = await fetch(`${BaseUrl}/grades`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const text = await response.text();
          console.error('Error fetching grades:', text);
          throw new Error('Failed to fetch grades');
        }

        const data = await response.json();
        setGrades(data.grades || []);
      } catch (error) {
        console.error('Error fetching grades:', error);
      } finally {
        setLoadingState(false);
      }
    };

    fetchGrades();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      if (selectedClass === 'Select Class') return;

      setLoadingState(true);
      try {
        const response = await fetch(`${BaseUrl}/students/${selectedClass}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const text = await response.text();
          console.error('Error fetching students:', text);
          throw new Error('Failed to fetch students');
        }

        const data = await response.json();
        const formattedStudents = data.students.map(student => ({
          StudentId: student.StudentId,
          name: student.Name,
        }));
        setStudents(formattedStudents);
        setLoadingState(false);
      } catch (error) {
        console.error('Error fetching students:', error);
        setLoadingState(false);
      }
    };

    fetchStudents();
  }, [selectedClass]);

  const handleClassChange = (event) => {
    const selectedClass = event.target.value;
    setSelectedClass(selectedClass);
  };

  const handleStudentChange = (event) => {
    const selectedStudentId = event.target.value;
    setSelectedStudent(selectedStudentId);
    const studentDetails = students.find(student => student.StudentId === selectedStudentId);
    setSelectedStudentDetails(studentDetails || {});
  };

  const handleFileUpload = async (event, field) => {
    const file = event.target.files[0];
    if (file) {
      const storageRef = ref(storage, `documents/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      setUploadedFiles((prevFiles) => ({
        ...prevFiles,
        [field]: { name: file.name, url },
      }));
    }
  };

  const handleSubmit = async () => {
    const payload = {
      Documents: Object.keys(uploadedFiles).reduce((acc, key) => {
        acc[key] = uploadedFiles[key].url;
        return acc;
      }, {}),
    };
    console.log('Payload:', payload);
  
    try {
      const response = await fetch(`${BaseUrl}/uploaddocuments/${selectedStudent}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to submit documents');
      }
  
      const data = await response.json();
      console.log('Documents submitted successfully:', data);
      setOpenPopup(true); // Show popup on successful submission
    } catch (error) {
      console.error('Error submitting documents:', error);
      setOpenErrorPopup(true); // Show error popup on failure
    }
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
    window.location.reload(); // Refresh the page
  };

  const handleCloseErrorPopup = () => {
    setOpenErrorPopup(false);
  };

  return (
    <div className='student-attach-document-container'>
      {loading && <LinearProgress />}
      <FormControl variant="outlined" className="select-class-dropdown" style={{ marginRight: '16px' }}>
        <Select className="custom-select" value={selectedClass} onChange={handleClassChange} displayEmpty>
          <MenuItem value="Select Class">Select Class</MenuItem>
          {grades.sort().map((grade, index) => (
            <MenuItem key={index} value={grade}>{grade}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl variant="outlined" className="select-class-dropdown">
        <Select className="custom-select" value={selectedStudent} onChange={handleStudentChange} displayEmpty>
          <MenuItem value="Select student">Select student</MenuItem>
          {students.map((student, index) => (
            <MenuItem key={index} value={student.StudentId}>{student.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <div className='student-details-grid'>
        <div className='student-detail'>
          <div className='student-label'>Roll No:</div>
          <div className='student-field'>12</div>
        </div>
        <div className='student-detail'>
          <div className='student-label'>Name:</div>
          <div className='student-field'>{selectedStudentDetails.name || 'Name'}</div>
        </div>
        <div className='student-detail'>
          <div className='student-label'>Aadhar:</div>
          <div className='upload-field'>
            <input
              type="file"
              id="aadhar"
              onChange={(e) => handleFileUpload(e, 'aadhar')}
              style={{ display: 'none' }}
              className='upload-input'
            />
            <label htmlFor="aadhar" className='upload-label'>
              {uploadedFiles.aadhar?.name || 'Upload Aadhar'}
              <IconButton component="span">
                <UploadIcon />
              </IconButton>
            </label>
          </div>
        </div>
        <div className='student-detail'>
          <div className='student-label'>Photo:</div>
          <div className='upload-field'>
            <input
              type="file"
              id="photo"
              onChange={(e) => handleFileUpload(e, 'photo')}
              style={{ display: 'none' }}
              className='upload-input'
            />
            <label htmlFor="photo" className='upload-label'>
              {uploadedFiles.photo?.name || 'Upload Photo'}
              <IconButton component="span">
                <UploadIcon />
              </IconButton>
            </label>
          </div>
        </div>
        <div className='student-detail'>
          <div className='student-label'>Birth/Caste Certificate:</div>
          <div className='upload-field'>
            <input
              type="file"
              id="birthCaste"
              onChange={(e) => handleFileUpload(e, 'birthCaste')}
              style={{ display: 'none' }}
              className='upload-input'
            />
            <label htmlFor="birthCaste" className='upload-label'>
              {uploadedFiles.birthCaste?.name || 'Upload Birth/Caste Certificate'}
              <IconButton component="span">
                <UploadIcon />
              </IconButton>
            </label>
          </div>
        </div>
        <div className='student-detail'>
          <div className='student-label'>Income Certificate:</div>
          <div className='upload-field'>
            <input
              type="file"
              id="income"
              onChange={(e) => handleFileUpload(e, 'income')}
              style={{ display: 'none' }}
              className='upload-input'
            />
            <label htmlFor="income" className='upload-label'>
              {uploadedFiles.income?.name || 'Upload Income Certificate'}
              <IconButton component="span">
                <UploadIcon/>
              </IconButton>
            </label>
          </div>
        </div>
        <div className='student-detail'>
          <div className='student-label'>Transfer Certificate:</div>
          <div className='upload-field'>
            <input
              type="file"
              id="transfer"
              onChange={(e) => handleFileUpload(e, 'transfer')}
              style={{ display: 'none' }}
              className='upload-input'
            />
            <label htmlFor="transfer" className='upload-label'>
              {uploadedFiles.transfer?.name || 'Upload Transfer Certificate'}
              <IconButton component="span">
                <UploadIcon />
              </IconButton>
            </label>
          </div>
        </div>
        <div className='student-detail'>
          <div className='student-label'>Ration Card:</div>
          <div className='upload-field'>
            <input
              type="file"
              id="ration"
              onChange={(e) => handleFileUpload(e, 'ration')}
              style={{ display: 'none' }}
              className='upload-input'
            />
            <label htmlFor="ration" className='upload-label'>
              {uploadedFiles.ration?.name || 'Upload Ration Card'}
              <IconButton component="span">
                <UploadIcon />
              </IconButton>
            </label>
          </div>
        </div>
      </div>
      <div className='submit-button-container'>
        <button className='submit-btn' onClick={handleSubmit}>Submit</button>
      </div>
      <Dialog
        open={openPopup}
        onClose={handleClosePopup}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Documents Submitted"}</DialogTitle>
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

export default StudentAttachDocument;