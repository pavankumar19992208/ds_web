import React, { useState, useEffect, useContext } from 'react';
import { GlobalStateContext } from '../../../../../GlobalStateContext';
import { useParams } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import Events from '../Events/Events';
import Cards from '../Cards/cards';
import AcademicYear from '../AcademicYear/AcademicYearVerification';
import HashLoader from 'react-spinners/HashLoader';
import ImageCarousel from '../ImageCarousel/ImageCarousel';
import './SchoolDashboard.css';

const SchoolDashboard = () => {
  const { globalData } = useContext(GlobalStateContext);
  const { school_id } = useParams();
  const schoolId = school_id || globalData?.data?.school_id;
  // const schoolName = globalData?.data?.school_name || 'School Name Not Available';
  const [studentCount, setStudentCount] = useState(0);
  const [staffCount, setStaffCount] = useState(0);
  const [showAcademicYear, setShowAcademicYear] = useState(false);
  const [loading, setLoading] = useState(true);

  console.log('Global Data:', globalData);

  console.log('useParams output:', useParams());
  console.log('School ID from useParams:', school_id);
  console.log('Resolved School ID:', schoolId);


  useEffect(() => {
    if (!globalData) return;
  
    console.log('Global Data:', globalData); // Log only once when globalData is available
  
    const targetStudentCount = 150;
    const targetStaffCount = 20;
    const duration = 1000;
    const interval = 10;
    const incrementStudent = targetStudentCount / (duration / interval);
    const incrementStaff = targetStaffCount / (duration / interval);
  
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
  
    setLoading(false);
  
    return () => {
      clearInterval(studentInterval);
      clearInterval(staffInterval);
    };
  }, [globalData]); // Ensure this only runs when globalData changes

  if (loading || !globalData) {
    return (
      <div className="loaderContainer">
        <HashLoader color="#ffffff" size={50} />
      </div>
    );
  }

  const toggleAcademicYear = () => {
    setShowAcademicYear(!showAcademicYear);
  };

  return (
    <div className='school-dashboard'>
      <div className="homepage">
        <Navbar 
          schoolName={globalData.data.school_name} 
          schoolLogo={globalData.data.school_logo} 
          onStartNewAcademicYear={toggleAcademicYear}
        />
        <Sidebar visibleItems={['home', 'attachDocument', 'subjectAllocation', 'attendanceTracking', 'leaveApprovals', 'academicPerformance', 'schoolStatistics', 'teacherAlert', 'eventPlanning', 'careerGuidance', 'inventoryManagement']} showTitle={true} selectedItem="home" />
        <main className="main-content">
          <div className="cards-container">
            <Cards schoolName={globalData.data.school_name} schoolLogo={globalData.data.school_logo} studentCount={studentCount} staffCount={staffCount} />
          </div>
          <div className="carousel-events-container">
            <div className="carousel-container">
              <ImageCarousel />
            </div>
            <div className="events-container">
              <Events />
            </div>
          </div>
          {showAcademicYear && (
            <div className="academic-year-popup">
              <AcademicYear open={showAcademicYear} onClose={toggleAcademicYear} />
            </div>
          )}
        </main>
        <div className="school-id-box">
          School ID: {globalData.data.school_id}
        </div>
      </div>
    </div>
  );
};

export default SchoolDashboard;