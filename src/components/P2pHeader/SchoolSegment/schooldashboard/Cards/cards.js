import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalStateContext } from '../../../../../GlobalStateContext';
import './cards.css';
import BaseUrl from '../../../../../config';
import HashLoader from 'react-spinners/HashLoader';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';

const Cards = ({ studentCount, staffCount, schoolName, schoolLogo }) => {
  const navigate = useNavigate();
  const { globalData, setGlobalData } = useContext(GlobalStateContext);
  const schoolId = globalData.data.SCHOOL_ID; // Assuming schoolId is stored in globalData
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchSchoolInfo = async () => {
      setLoading(true);
      try {
          const response = await fetch(`${BaseUrl}/schoolinfo`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ SchoolId: schoolId }),
          });
  
          if (!response.ok) {
              const text = await response.text(); // Read the response as text
              console.error('Error fetching school info:', text);
              throw new Error('Failed to fetch school info');
          }
  
          const data = await response.json(); // Parse the response as JSON
          console.log('School info:', data);
          setGlobalData(prevData => ({ ...prevData, schoolInfo: data.data }));
          console.log("globalData", globalData);
          navigate('/staff-enroll');
      } catch (error) {
          console.error('Error fetching school info:', error);
      } finally {
          setLoading(false);
      }
  };

  const handleStudentEnrollClick = () => {
    setOpen(true);
  };

  const handleStudentDetails = () => {
    navigate('/student-details');
  };

  const handleStaffEnrollClick = () => {
    fetchSchoolInfo();
  };

  const handleStaffDetails = () => {
    navigate('/staff-details', { state: { schoolId } });
  };

  const handleStaffPayroll = () => {
    navigate('/staff-payroll');
  };

  const handleUpdateSchoolData = () => {
    navigate('/school-internal-data');
  };
  const handleUpdateSchoolDataView = () => {
    navigate('/school-internal-data-view');
  };

  const handleClassTimetableSchedule = () => {
    navigate('/class-timetable');
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddSingleStudent = () => {
    navigate('/student-enroll');
  };

  return (
    <div className="cards-container">
      <div className="card">
        <h2>Student Enrollment</h2>
        <p className="count">{Math.floor(studentCount)}</p>
        <div className="button-group">
          <button id='enroll-btn' onClick={handleStudentEnrollClick}>Enroll</button>
          <button onClick={handleStudentDetails}>Details</button>
        </div>
      </div>
      <div className="card">
        <h2>Staff Enrollment</h2>
        <p className="count">{Math.floor(staffCount)}</p>
        <div className="button-group">
          <button id='enroll-btn' onClick={handleStaffEnrollClick}>Enroll</button>
          <button onClick={handleStaffDetails}>Details</button>
        </div>
      </div>
      <div className="card">
        <h2>School Internal Data</h2>
        <div className="button-group">
          <button id='enroll-btn' onClick={handleUpdateSchoolData}>Update</button>
          <button onClick={handleUpdateSchoolDataView}>View</button>
        </div>
      </div>
      <div className="card">
        <h2>Staff Payroll</h2>
        <div className="button-group">
          <button id='enroll-btn' onClick={handleStaffPayroll}>Details</button>
        </div>
      </div>
      <div className="card">
        <h2>Student Fee Payment / Status</h2>
        <div className="button-group">
          <button id='enroll-btn'>Collect Fee</button>
          <button>Dues</button>
        </div>
      </div>
      <div className="card">
        <h2>Class Timetables</h2>
        <div className="button-group">
          <button id='enroll-btn' onClick={handleClassTimetableSchedule}>Schedule</button>
          <button>View</button>
        </div>
      </div>
      {loading && (
        <div className="loaderContainer">
          <HashLoader color="#ffffff" size={50} />
        </div>
      )}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        className="dialogContainer" 
        PaperProps={{
          style: {
            borderRadius: 15, // Add border-radius here
          },
        }}
      >
        <DialogContent className='enroll-box'>
          <div className="dialogButtonGroup">
            <Button
              color="primary"
              startIcon={<PersonIcon />}
              onClick={handleAddSingleStudent}
              className="addSingleButton"
            >
              Add Single Student
            </Button>
            <Button
              color="secondary"
              startIcon={<GroupIcon />}
              className="addBulkButton"
            >
              Add Bulk Students
            </Button>
          </div>
          <DialogActions>
          <Button onClick={handleClose} color="primary" className="closeButton">
            Cancel
          </Button>
          </DialogActions>
        </DialogContent>

      </Dialog>
    </div>
  );
};

export default Cards;