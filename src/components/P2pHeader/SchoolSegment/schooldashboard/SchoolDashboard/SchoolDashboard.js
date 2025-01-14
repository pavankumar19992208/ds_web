import React, { useState, useEffect, useContext } from 'react';
import { GlobalStateContext } from '../../../../../GlobalStateContext';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import Events from '../Events/Events';
import Cards from '../Cards/cards';
import AcademicYear from '../AcademicYear/AcademicYearVerification';
import HashLoader from 'react-spinners/HashLoader';
import './SchoolDashboard.css';

const SchoolDashboard = () => {
  const { globalData } = useContext(GlobalStateContext);

  const [studentCount, setStudentCount] = useState(0);
  const [staffCount, setStaffCount] = useState(0);
  const [showAcademicYear, setShowAcademicYear] = useState(false); // State to control the visibility of AcademicYear
  const [loading, setLoading] = useState(true); // State to control the loader

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

    setLoading(false); // Set loading to false once data is loaded

    return () => {
      clearInterval(studentInterval);
      clearInterval(staffInterval);
    };
  }, [globalData]);

  if (loading || !globalData) {
    return (
      <div className="loaderContainer">
        <HashLoader color="#ffffff" size={50} />
      </div>
    ); // Display loader while loading
  }

  const toggleAcademicYear = () => {
    setShowAcademicYear(!showAcademicYear);
  };

  return (
    <div className='school-dashboard'>
    <div className="homepage">
      <Navbar 
        schoolName={globalData.data.SCHOOL_NAME} 
        schoolLogo={globalData.data.SCHOOL_LOGO} 
        onStartNewAcademicYear={toggleAcademicYear} // Pass the toggle function as a prop
      />
      <Sidebar visibleItems={['home', 'attachDocument', 'subjectAllocation', 'attendanceTracking', 'leaveApprovals', 'academicPerformance','teacherAlert', 'eventPlanning', 'careerGuidance', 'inventoryManagement']} showTitle={true} selectedItem="home" />
      <main className="main-content">
  <div className="cards-container">
    <Cards schoolName={globalData.data.SCHOOL_NAME} schoolLogo={globalData.data.SCHOOL_LOGO} studentCount={studentCount} staffCount={staffCount} />
  </div>
  <div className="events-container">
    <Events />
  </div>
  {showAcademicYear && (
    <div className="academic-year-popup">
      <AcademicYear open={showAcademicYear} onClose={toggleAcademicYear} />
    </div>
  )}
</main>
      <div className="school-id-box">
        School ID: {globalData.data.SCHOOL_ID}
      </div>
    </div>
    </div>
  );
};

export default SchoolDashboard;