import React, { useContext, useState } from 'react';
import { Button } from '@mui/material';
import Navbar from '../../Navbar/Navbar';
import Sidebar from '../../Sidebar/Sidebar';
import { GlobalStateContext } from '../../../../../../GlobalStateContext';
import ViewStudents from './view-students/viewStudents';
import SectionAllocation from './section-allocation/sectionAllocation';
import './studentDetails.css';

const StudentDetails = () => {
  const { globalData } = useContext(GlobalStateContext);
  const [showViewStudents, setShowViewStudents] = useState(true); // State to manage visibility
  const [showSectionAllocation, setShowSectionAllocation] = useState(false); // State to manage visibility
  const [selectedButton, setSelectedButton] = useState('viewStudents'); // State to manage selected button

  const handleViewStudentsClick = () => {
    if (selectedButton !== 'viewStudents') {
      setShowViewStudents(true);
      setShowSectionAllocation(false);
      setSelectedButton('viewStudents');
    }
  };

  const handleSectionAllocationClick = () => {
    if (selectedButton !== 'sectionAllocation') {
      setShowViewStudents(false);
      setShowSectionAllocation(true);
      setSelectedButton('sectionAllocation');
    }
  };


  return (
    <div className="student-details">
      <Navbar
        schoolName={globalData.data.SCHOOL_NAME}
        schoolLogo={globalData.data.SCHOOL_LOGO}
      />
      <Sidebar visibleItems={['home', 'attachDocument', 'subjectAllocation', 'attendanceTracking', 'leaveApprovals', 'academicPerformance', 'teacherAlert', 'eventPlanning', 'careerGuidance', 'inventoryManagement']} showTitle={true} selectedItem="home" />
      <div className="student-details-container">
        <Button
          variant="contained"
          className={`button-primary ${selectedButton === 'viewStudents' ? 'selected' : ''}`}
          onClick={handleViewStudentsClick}
        >
          View Students
        </Button>
        <Button
          variant="contained"
          className={`button-secondary ${selectedButton === 'sectionAllocation' ? 'selected' : ''}`}
          onClick={handleSectionAllocationClick}
        >
          Section Allocation
        </Button>
        {showViewStudents && (
          <ViewStudents setLoading={() => {}} />
        )}{/* Conditionally render ViewStudents */}
        {showSectionAllocation && (
          <SectionAllocation />
        )}{/* Conditionally render SectionAllocation */}
      </div>
    </div>
  );
};

export default StudentDetails;