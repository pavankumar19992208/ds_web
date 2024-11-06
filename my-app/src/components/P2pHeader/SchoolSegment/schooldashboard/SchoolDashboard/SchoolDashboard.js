import React, { useState, useEffect, useContext } from 'react';
import { GlobalStateContext } from '../../../../../GlobalStateContext';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import Events from '../Events/Events';
import Cards from '../Cards/cards';
import './SchoolDashboard.css';

const SchoolDashboard = () => {
  const { globalData } = useContext(GlobalStateContext);

  const [studentCount, setStudentCount] = useState(0);
  const [staffCount, setStaffCount] = useState(0);

  useEffect(() => {
    if (!globalData) return;

    const targetStudentCount = 150;
    const targetStaffCount = 20;
    const duration = 1000; // Duration of the animation in milliseconds
    const interval = 10; // Interval in milliseconds
    const incrementStudent = targetStudentCount / (duration / interval);
    const incrementStaff = targetStaffCount / (duration / interval);
    console.log(globalData);

    const studentInterval = setInterval(() => {
      setStudentCount((prevCount) => {
        if (prevCount + incrementStudent >= targetStudentCount) {
          clearInterval(studentInterval);
          return targetStudentCount;
        }
        return prevCount + incrementStudent;
      });
    }, interval);

    const staffInterval = setInterval(() => {
      setStaffCount((prevCount) => {
        if (prevCount + incrementStaff >= targetStaffCount) {
          clearInterval(staffInterval);
          return targetStaffCount;
        }
        return prevCount + incrementStaff;
      });
    }, interval);

    return () => {
      clearInterval(studentInterval);
      clearInterval(staffInterval);
    };
  }, [globalData]);

  if (!globalData) {
    return <div>Loading...</div>; // Display a loading message or a fallback UI
  }

  return (
    <div className="homepage">
      <Navbar schoolName={globalData.data.SCHOOL_NAME} schoolLogo={globalData.data.SCHOOL_LOGO} />
      <Sidebar visibleItems={['home', 'attachDocument', 'subjectAllocation', 'attendanceTracking', 'leaveApprovals', 'academicPerformance','teacherAlert', 'eventPlanning', 'careerGuidance', 'inventoryManagement']} showTitle={true} selectedItem="home" />
      <main className="main-content">
        <Cards schoolName={globalData.data.SCHOOL_NAME} schoolLogo={globalData.data.SCHOOL_LOGO} studentCount={studentCount} staffCount={staffCount} />
        <Events />
      </main>
      <div className="school-id-box">
        School ID: {globalData.data.SCHOOL_ID}
      </div>
    </div>
  );
};

export default SchoolDashboard;