import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Drawer from '@mui/material/Drawer';
import { Home, TrendingUp } from '@mui/icons-material';
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';
import HowToRegRoundedIcon from '@mui/icons-material/HowToRegRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import EditCalendarRoundedIcon from '@mui/icons-material/EditCalendarRounded';
import FlightTakeoffRoundedIcon from '@mui/icons-material/FlightTakeoffRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import { FaUserEdit } from "react-icons/fa"; // Import the new icon
import './Sidebar.css'; // Import the CSS file

const Sidebar = ({ visibleItems = [], hideProfile = false, showTitle = true, selectedItem: initialSelectedItem }) => {
  const [selectedItem, setSelectedItem] = useState(initialSelectedItem || '');
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const pathToItemMap = {
      '/': 'school_dashboard',
      '/attach-document': 'attachDocument',
      '/career-guidance': 'careerGuidance',
      '/update-enrollment': 'updateEnrollment',
      '/subject-allocation': 'subjectAllocation',
      '/leave-approval': 'leaveApproval',
      // Add other paths as needed
    };
    const currentItem = pathToItemMap[location.pathname];
    if (currentItem) {
      setSelectedItem(currentItem);
    }
  }, [location.pathname]);

  const navigateToHomepage = () => {
    navigate('/school_dashboard');
    setSelectedItem('school_dashboard');
  };

  const navigateToAttachDocument = () => {
    navigate('/attach-document');
    setSelectedItem('attachDocument');
  };

  const navigateToCareerGuidance = () => {
    navigate('/career-guidance');
    setSelectedItem('careerGuidance');
  };

  const navigateToUpdateEnrollment = () => {
    navigate('/update-enrollment');
    setSelectedItem('updateEnrollment');
  };
  const navigateToUpdateStaffPayroll = () => {
    navigate('/update-staff-payroll');
    setSelectedItem('UpdateStaffPayroll');
  };
  const navigateToSubjectAllocation = () => {
    navigate('/subject-allocation');
    setSelectedItem('subjectAllocation');
  };

  const navigateToLeaveApproval = () => {
    navigate('/leave-approval');
    setSelectedItem('leaveApproval');
  };

  const isPrimaryFormOpen = location.pathname.includes('primaryForm');

  return (
    <Drawer
      variant="permanent"
      className="sidebar-drawer"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      PaperProps={{
        style: {
          width: isExpanded ? 230 : 40,
          transition: 'width 0.3s',
          top: '50px',
          backgroundColor: '#003353',
          left: '14px',
          overflowY: 'hidden',
          overflowX: 'hidden',
          border: 'none',
        },
      }}
    >
      <List component="nav" className={showTitle ? "sidebar" : "sidebar_d"} style={{ justifyContent: 'center' }}>
        {visibleItems.includes('home') && (
          <ListItem
            button className={`list-item ${selectedItem === 'home' ? 'selected-list-item' : ''}`} onClick={navigateToHomepage} style={selectedItem === 'home' ? { pointerEvents: 'none' } : {}}>
            <Home size={20} className='icons'/>
            {isExpanded && showTitle && <ListItemText primary="Home" className="list-item-text"  />}
          </ListItem>
        )}
        {visibleItems.includes('attachDocument') && (
          <ListItem
            button
            className={`list-item ${selectedItem === 'attachDocument' ? 'selected-list-item' : ''}`} onClick={navigateToAttachDocument}
          >
            <AttachFileRoundedIcon size={20} className='icons'/>
            {isExpanded && showTitle && <ListItemText primary="Attach Document" className="list-item-text" />}
          </ListItem>
        )}
        {visibleItems.includes('subjectAllocation') && (
          <ListItem
            button
            className={`list-item ${selectedItem === 'subjectAllocation' ? 'selected-list-item' : ''}`}
            onClick={navigateToSubjectAllocation}
          >
            <AccountTreeRoundedIcon size={20} className='icons'/>
            {isExpanded && showTitle && <ListItemText primary="Subject Allocation" className="list-item-text"/>}
          </ListItem>
        )}
        {visibleItems.includes('attendanceTracking') && (
          <ListItem button className="list-item">
            <AssessmentRoundedIcon size={20} className='icons'/>
            {isExpanded && showTitle && <ListItemText primary="Attendance Tracking" className="list-item-text"/>}
          </ListItem>
        )}
        {visibleItems.includes('leaveApprovals') && (
          <ListItem button className="list-item" onClick={navigateToLeaveApproval}>
            <HowToRegRoundedIcon size={20} className='icons'/>
            {isExpanded && showTitle && <ListItemText primary="Leave Approvals" className="list-item-text" />}
          </ListItem>
        )}
        {visibleItems.includes('academicPerformance') && (
          <ListItem button className="list-item">
            <TrendingUp size={16} className='icons'/>
            {isExpanded && showTitle && <ListItemText primary="Academic Performance" className="list-item-text"/>}
          </ListItem>
        )}
        {visibleItems.includes('teacherAlert') && (
          <ListItem button className="list-item">
            <InfoRoundedIcon size={20} className='icons'/>
            {isExpanded && showTitle && <ListItemText primary="Teacher Alert" className="list-item-text"/>}
          </ListItem>
        )}
        {visibleItems.includes('eventPlanning') && (
          <ListItem button className="list-item">
            <EditCalendarRoundedIcon size={20} className='icons'/>
            {isExpanded && showTitle && <ListItemText primary="Event Planning" className="list-item-text"/>}
          </ListItem>
        )}
        {visibleItems.includes('careerGuidance') && (
          <ListItem button className="list-item" onClick={navigateToCareerGuidance}>
            <FlightTakeoffRoundedIcon size={20} className='icons'/>
            {isExpanded && showTitle && <ListItemText primary="Career Guidance" className="list-item-text"/>}
          </ListItem>
        )}
        {visibleItems.includes('updateEnrollment') && (
          <ListItem button className="list-item" onClick={navigateToUpdateEnrollment}>
            <FaUserEdit size={20} className='icons'/>
            {isExpanded && showTitle && <ListItemText primary="Update Enrollment" className="list-item-text"/>}
          </ListItem>
        )}
        {visibleItems.includes('updateStaffPayroll') && (
          <ListItem button className="list-item" onClick={navigateToUpdateStaffPayroll}>
            <FaUserEdit size={20} className='icons'/>
            {isExpanded && showTitle && <ListItemText primary="Update Enrollment" className="list-item-text"/>}
          </ListItem>
        )}
        {visibleItems.includes('inventoryManagement') && (
          <ListItem button className="list-item">
            <Inventory2RoundedIcon size={20} className='icons'/>
            {isExpanded && showTitle && <ListItemText primary="Inventory Management" className="list-item-text"/>}
          </ListItem>
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;