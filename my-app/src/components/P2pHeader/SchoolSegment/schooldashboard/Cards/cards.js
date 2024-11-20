import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalStateContext } from '../../../../../GlobalStateContext';
import './cards.css';
import BaseUrl from '../../../../../config';
import HashLoader from 'react-spinners/HashLoader';

const Cards = ({ studentCount, staffCount, schoolName, schoolLogo }) => {
  const navigate = useNavigate();
  const { globalData, setGlobalData } = useContext(GlobalStateContext);
  const schoolId = globalData.data.SCHOOL_ID; // Assuming schoolId is stored in globalData
  const [loading, setLoading] = useState(false);

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
    navigate('/student-enroll');
  };

  const handleStaffEnrollClick = () => {
    fetchSchoolInfo();
  };

  const handleStaffPayroll = () => {
    navigate('/staff-payroll');
  };

  const handleUpdateSchoolData = () => {
    navigate('/school-internal-data');
  };

  const handleClassTimetableSchedule = () => {
    navigate('/class-timetable');
  };

  return (
    <div className="cards-container">
      <div className="card">
        <h2>Student Enrollment</h2>
        <p className="count">{Math.floor(studentCount)}</p>
        <div className="button-group">
          <button id='enroll-btn' onClick={handleStudentEnrollClick}>Enroll</button>
          <button>Details</button>
        </div>
      </div>
      <div className="card">
        <h2>Staff Enrollment</h2>
        <p className="count">{Math.floor(staffCount)}</p>
        <div className="button-group">
          <button id='enroll-btn' onClick={handleStaffEnrollClick}>Enroll</button>
          <button>Details</button>
        </div>
      </div>
      <div className="card">
        <h2>School Internal Data</h2>
        <div className="button-group">
          <button id='enroll-btn' onClick={handleUpdateSchoolData}>Update</button>
          <button>View</button>
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
    </div>
  );
};

export default Cards;