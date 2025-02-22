import React, { useContext, useState } from 'react';
import { Button } from '@mui/material';
import ViewStaff from './view-staff/viewStaff';
import StaffAttachDocument from './staff-attach-document/staffAttachDocument';
import Navbar from '../../Navbar/Navbar';
import Sidebar from '../../Sidebar/Sidebar';
import { GlobalStateContext } from '../../../../../../GlobalStateContext';
import './staffDetails.css';

const StaffDetails = () => {
    const { globalData } = useContext(GlobalStateContext);
    const [showViewStaff, setShowViewStaff] = useState(true); // State to manage visibility
    const [showStaffAttachDocument, setShowStaffAttachDocument] = useState(true); // State to manage visibility
    const [selectedButton, setSelectedButton] = useState('viewStaff'); // State to manage selected button
    
    const handleViewStaffClick = () => {
      if (selectedButton !== 'viewStaff') {
        setShowViewStaff(true);
        setShowStaffAttachDocument(false);
        setSelectedButton('viewStaff');
      }
    };

    const handleAttachDocumentClick = () => {
        if (selectedButton !== 'staffAttachDocument') {
          setShowViewStaff(false);
          setShowStaffAttachDocument(true);
          setSelectedButton('staffAttachDocument');
        }
      };

    return (
        <div className="staff-details">
            <Navbar
                schoolName={globalData.data.SCHOOL_NAME}
                schoolLogo={globalData.data.SCHOOL_LOGO}
            />
            <Sidebar visibleItems={['home', 'attachDocument', 'subjectAllocation', 'attendanceTracking', 'leaveApprovals', 'academicPerformance', 'teacherAlert', 'eventPlanning', 'careerGuidance', 'inventoryManagement']} showTitle={true} selectedItem="home" />
            <div className="staff-details-container">
        <Button
          variant="contained"
          className={`button-primary ${selectedButton === 'viewStaff' ? 'selected' : ''}`}
          onClick={handleViewStaffClick}
        >
          View Staff
        </Button>
        <Button
          variant="contained"
          className={`button-third ${selectedButton === 'staffAttachDocument' ? 'selected' : ''}`}
          onClick={handleAttachDocumentClick}
        >
          Attach Documents
        </Button>
        
        {showViewStaff && (
          <ViewStaff setLoading={() => {}} />
        )}
        {showStaffAttachDocument && (
          <StaffAttachDocument />
        )}
      </div>
      </div>
    );
};

export default StaffDetails;