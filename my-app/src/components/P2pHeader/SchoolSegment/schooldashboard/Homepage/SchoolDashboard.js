import React, { useState, useEffect, useContext } from 'react';
import { GlobalStateContext } from '../../../../../GlobalStateContext';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import Events from '../Events/Events';
import Cards from '../Cards/cards';
import './HomePage.css';

const SchoolDashboard = () => {
  const { globalData } = useContext(GlobalStateContext);

  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);

  useEffect(() => {
    if (!globalData) return;

    const targetStudentCount = 150;
    const targetTeacherCount = 20;
    const duration = 1000; // Duration of the animation in milliseconds
    const interval = 10; // Interval in milliseconds
    const incrementStudent = targetStudentCount / (duration / interval);
    const incrementTeacher = targetTeacherCount / (duration / interval);
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

    const teacherInterval = setInterval(() => {
      setTeacherCount((prevCount) => {
        if (prevCount + incrementTeacher >= targetTeacherCount) {
          clearInterval(teacherInterval);
          return targetTeacherCount;
        }
        return prevCount + incrementTeacher;
      });
    }, interval);

    return () => {
      clearInterval(studentInterval);
      clearInterval(teacherInterval);
    };
  }, [globalData]);

  if (!globalData) {
    return <div>Loading...</div>; // Display a loading message or a fallback UI
  }

  return (
    <div className="homepage">
      <Navbar schoolName={globalData.data.SCHOOL_NAME} schoolLogo={globalData.data.SCHOOL_LOGO} />
      <Sidebar visibleItems={['home', 'attachDocument', 'subjectAllocation', 'attendanceTracking', 'leaveApprovals', 'academicPerformance','teacherAlert', 'eventPlanning']} />
      <main className="main-content">
        <Cards schoolName={globalData.data.SCHOOL_NAME} schoolLogo={globalData.data.SCHOOL_LOGO} studentCount={studentCount} teacherCount={teacherCount} />
      </main>
      <Events />
    </div>
  );
};

export default SchoolDashboard;