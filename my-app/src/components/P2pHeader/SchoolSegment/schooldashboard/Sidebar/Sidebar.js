import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import { MdTopic } from "react-icons/md";
import { IoIosAlert } from "react-icons/io";
import { CgAttachment } from "react-icons/cg";
import { PiMonitorFill } from "react-icons/pi";
import { BsPersonFillCheck } from "react-icons/bs";
import { TrendingUp, Home } from '@mui/icons-material';
import { BiSolidCalendarEdit } from "react-icons/bi";
import { RiFlightTakeoffFill } from "react-icons/ri";
import { FaUserEdit } from "react-icons/fa"; // Import the new icon
import { MdInventory } from "react-icons/md";
import './Sidebar.css'; // Import the CSS file

const Sidebar = ({ visibleItems = [], hideProfile = false, showTitle = true, selectedItem: initialSelectedItem }) => {
  const [selectedItem, setSelectedItem] = useState(initialSelectedItem || '');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const pathToItemMap = {
      '/': 'school_dashboard',
      '/attach-document': 'attachDocument',
      '/career-guidance': 'careerGuidance',
      '/update-enrollment': 'updateEnrollment',
      '/subject-allocation': 'subjectAllocation',
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
    <Box className={showTitle ? "sidebar" : "sidebar_d"} style={{ width: isPrimaryFormOpen ? '60px' : '240px', justifyContent: 'center' }}>
      <List component="nav">
        {visibleItems.includes('home') && (
          <Tooltip title="Home" placement="right">
            <ListItem
              button className={`list-item ${selectedItem === 'home' ? 'selected-list-item' : ''}`} onClick={navigateToHomepage} style={selectedItem === 'home' ? { pointerEvents: 'none' } : {}}>
              <Home size={20} className='icons'/>
              {!isPrimaryFormOpen && showTitle && <ListItemText primary="Home" className="list-item-text"  />}
            </ListItem>
          </Tooltip>
        )}
        {visibleItems.includes('attachDocument') && (
          <Tooltip title="Attach Document" placement="right">
            <ListItem
              button
              className={`list-item ${selectedItem === 'attachDocument' ? 'selected-list-item' : ''}`}
              onClick={navigateToAttachDocument}
            >
              <CgAttachment size={20} />
              {!isPrimaryFormOpen && showTitle && <ListItemText primary="Attach Document" className="list-item-text" />}
            </ListItem>
          </Tooltip>
        )}
        {visibleItems.includes('subjectAllocation') && (
          <Tooltip title="Subject Allocation" placement="right">
            <ListItem
              button
              className={`list-item ${selectedItem === 'subjectAllocation' ? 'selected-list-item' : ''}`}
              onClick={navigateToSubjectAllocation}
            >
              <MdTopic size={20} />
              {!isPrimaryFormOpen && showTitle && <ListItemText primary="Subject Allocation" className="list-item-text"/>}
            </ListItem>
          </Tooltip>
        )}
        {visibleItems.includes('attendanceTracking') && (
          <Tooltip title="Attendance Tracking" placement="right">
            <ListItem button className="list-item">
              <PiMonitorFill size={20} />
              {!isPrimaryFormOpen && showTitle && <ListItemText primary="Attendance Tracking" className="list-item-text"/>}
            </ListItem>
          </Tooltip>
        )}
        {visibleItems.includes('leaveApprovals') && (
          <Tooltip title="Leave Approvals" placement="right">
            <ListItem button className="list-item" onClick={navigateToLeaveApproval}>
              <BsPersonFillCheck size={20} />
              {!isPrimaryFormOpen && showTitle && <ListItemText primary="Leave Approvals" className="list-item-text" />}
            </ListItem>
          </Tooltip>
        )}
        {visibleItems.includes('academicPerformance') && (
          <Tooltip title="Academic Performance" placement="right">
            <ListItem button className="list-item">
              <TrendingUp size={18}/>
              {!isPrimaryFormOpen && showTitle && <ListItemText primary="Academic Performance" className="list-item-text"/>}
            </ListItem>
          </Tooltip>
        )}
        {visibleItems.includes('teacherAlert') && (
          <Tooltip title="Teacher Alert" placement="right">
            <ListItem button className="list-item">
              <IoIosAlert size={20} />
              {!isPrimaryFormOpen && showTitle && <ListItemText primary="Teacher Alert" className="list-item-text"/>}
            </ListItem>
          </Tooltip>
        )}
        {visibleItems.includes('eventPlanning') && (
          <Tooltip title="Event Planning" placement="right">
            <ListItem button className="list-item">
              <BiSolidCalendarEdit size={20} />
              {!isPrimaryFormOpen && showTitle && <ListItemText primary="Event Planning" className="list-item-text"/>}
            </ListItem>
          </Tooltip>
        )}
        {visibleItems.includes('careerGuidance') && (
          <Tooltip title="Career Guidance" placement="right">
            <ListItem button className="list-item" onClick={navigateToCareerGuidance}>
              <RiFlightTakeoffFill size={20} />
              {!isPrimaryFormOpen && showTitle && <ListItemText primary="Career Guidance" className="list-item-text"/>}
            </ListItem>
          </Tooltip>
        )}
        {visibleItems.includes('updateEnrollment') && (
          <Tooltip title="Update Enrollment" placement="right">
            <ListItem button className="list-item" onClick={navigateToUpdateEnrollment}>
              <FaUserEdit size={20} />
              {!isPrimaryFormOpen && showTitle && <ListItemText primary="Update Enrollment" className="list-item-text"/>}
            </ListItem>
          </Tooltip>
        )}
        {visibleItems.includes('inventoryManagement') && (
          <Tooltip title="Inventory Management" placement="right">
            <ListItem button className="list-item">
              <MdInventory size={20} />
              {!isPrimaryFormOpen && showTitle && <ListItemText primary="Inventory Management" className="list-item-text"/>}
            </ListItem>
          </Tooltip>
        )}
      </List>
    </Box>
  );
};

export default Sidebar;