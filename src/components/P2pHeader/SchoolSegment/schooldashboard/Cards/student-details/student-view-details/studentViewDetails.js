import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import BaseUrl from '../../../../../../../config';
import Navbar from '../../../Navbar/Navbar';
import Sidebar from '../../../Sidebar/Sidebar';
import { GlobalStateContext } from '../../../../../../../GlobalStateContext';
import './studentViewDetails.css';

const StudentViewDetails = () => {
  const { globalData } = useContext(GlobalStateContext);
  const { StudentId } = useParams(); // Get StudentId from the URL
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await fetch(`${BaseUrl}/student/${StudentId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch student details');
        }

        const data = await response.json();
        setStudent(data.student);
        console.log('Student Photo URL:', data.student.Photo); // Log the Photo URL
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [StudentId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!student) {
    return <div>No student data found.</div>;
  }

  return (
    <div className='student-view-details'>
      <Navbar
        schoolName={globalData.data.SCHOOL_NAME}
        schoolLogo={globalData.data.SCHOOL_LOGO}
      />
      <Sidebar visibleItems={['home', 'attachDocument', 'subjectAllocation', 'attendanceTracking', 'leaveApprovals', 'academicPerformance', 'teacherAlert', 'eventPlanning', 'careerGuidance', 'inventoryManagement']} showTitle={true} selectedItem="home" />
      <div className='student-view-details-container'>
      <h1 className='student-details-title'>Student Details</h1>
      <Divider />   
        <div className='student-details-main-grid'>
        <div className='student-photo-contianer'>
            {student.Photo ? (
              <img
                src={student.Photo}
                alt={`${student.Name}'s pic`}
                className='student-photo'
              />
            ) : (
              <div className='student-photo-placeholder'>No Photo Available</div>
            )}
        </div>
        <div className='student-details-grid'>
            <div className='student-detail'>
              <div className='student-label'>Roll No:</div>
              <div className='student-field'>{student.StudentId}</div>
            </div>
            <div className='student-detail'>
              <div className='student-label'>Name:</div>
              <div className='student-field'>{student.Name}</div>
            </div>
            <div className='student-detail'>
              <div className='student-label'>Class:</div>
              <div className='student-field'>{student.Grade}</div>
            </div>
            <div className='student-detail'>
              <div className='student-label'>Section:</div>
              <div className='student-field'>{student.Section || 'N/A'}</div>
            </div>
            <div className='student-detail'>
              <div className='student-label'>Performance:</div>
              <div className='student-field'>{student.Performance || 'N/A'}</div>
            </div>
            {/* Add more fields as needed */}
        </div>
        </div>
      </div>
    </div>
  );
};

export default StudentViewDetails;