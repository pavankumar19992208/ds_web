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
<<<<<<< HEAD
      '/inventory-management': 'inventoryManagement',
=======
>>>>>>> f822a08c3c4eda569abf8cd4712de253615ae424
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

<<<<<<< HEAD
  const navigateToInventoryManagement = () => {
    navigate('/inventory-management');
    setSelectedItem('inventoryManagement');
  };

=======
>>>>>>> f822a08c3c4eda569abf8cd4712de253615ae424
  const isPrimaryFormOpen = location.pathname.includes('primaryForm');

  return (
    <Drawer
      variant="permanent"
      className="sidebar-drawer"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      PaperProps={{
        style: {
          width: isExpanded ? 230 : 0,
          transition: 'width 0.3s',
          top: '50px',
          backgroundColor: '#003353',
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
<<<<<<< HEAD
          <Tooltip title="Leave Approvals" placement="right">
            <ListItem button className="list-item" onClick={navigateToLeaveApproval}>
<<<<<<< HEAD
              <BsPersonFillCheck size={20} />
              {!isPrimaryFormOpen && showTitle && <ListItemText primary="Leave Approvals" className="list-item-text" />}
=======
              <HowToRegRoundedIcon size={20} className='icons'/>
              {!isCollapsed && showTitle && <ListItemText primary="Leave Approvals" className="list-item-text" />}
>>>>>>> f822a08c3c4eda569abf8cd4712de253615ae424
            </ListItem>
          </Tooltip>
=======
          <ListItem button className="list-item" onClick={navigateToLeaveApproval}>
            <HowToRegRoundedIcon size={20} className='icons'/>
            {isExpanded && showTitle && <ListItemText primary="Leave Approvals" className="list-item-text" />}
          </ListItem>
>>>>>>> 96ada4a4a46af6b55c70bf3ec114a58223460f0f
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
<<<<<<< HEAD
          <Tooltip title="Inventory Management" placement="right">
<<<<<<< HEAD
            <ListItem button className="list-item" onClick={navigateToInventoryManagement}>
              <MdInventory size={20} />
              {!isPrimaryFormOpen && showTitle && <ListItemText primary="Inventory Management" className="list-item-text"/>}
=======
            <ListItem button className="list-item">
              <Inventory2RoundedIcon size={20} className='icons'/>
              {!isCollapsed && showTitle && <ListItemText primary="Inventory Management" className="list-item-text"/>}
>>>>>>> f822a08c3c4eda569abf8cd4712de253615ae424
            </ListItem>
          </Tooltip>
=======
          <ListItem button className="list-item">
            <Inventory2RoundedIcon size={20} className='icons'/>
            {isExpanded && showTitle && <ListItemText primary="Inventory Management" className="list-item-text"/>}
          </ListItem>
>>>>>>> 96ada4a4a46af6b55c70bf3ec114a58223460f0f
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;