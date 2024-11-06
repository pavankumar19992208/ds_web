import React, { useState, useEffect, useContext } from 'react';
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
    if (location.pathname === '/') {
      setSelectedItem('home');
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

  const listItemHoverStyle = {
    transition: 'background-color 0.3s ease-in-out',
    '&:hover': {
      backgroundColor: '#0E5E9D50',
    },
  };

  const selectedListItemStyle = {
    backgroundColor: '#0E5E9D60',
  };

  const isPrimaryFormOpen = location.pathname.includes('primaryForm');

  return (
    <Box className={showTitle ? "sidebar" : "sidebar_d"} sx={{ width: isPrimaryFormOpen ? '60px' : '240px', justifyContent: 'center' }}>
      <List component="nav">
        {visibleItems.includes('home') && (
          <Tooltip title="Home" placement="right">
            <ListItem
              button className="list-item" sx={selectedItem === 'home' ? selectedListItemStyle : listItemHoverStyle} onClick={navigateToHomepage} style={selectedItem === 'home' ? { pointerEvents: 'none' } : {}}
            >
              <Home size={20}/>
              {!isPrimaryFormOpen && showTitle && <ListItemText primary="Home" className="list-item-text"/>}
            </ListItem>
          </Tooltip>
        )}
        {visibleItems.includes('attachDocument') && (
          <Tooltip title="Attach Document" placement="right">
            <ListItem
              button
              className="list-item"
              sx={selectedItem === 'attachDocument' ? selectedListItemStyle : listItemHoverStyle}
              onClick={navigateToAttachDocument}
            >
              <CgAttachment size={20} />
              {!isPrimaryFormOpen && showTitle && <ListItemText primary="Attach Document" className="list-item-text"/>}
            </ListItem>
          </Tooltip>
        )}
        {visibleItems.includes('subjectAllocation') && (
          <Tooltip title="Subject Allocation" placement="right">
            <ListItem button className="list-item" sx={listItemHoverStyle}>
              <MdTopic size={20} />
              {!isPrimaryFormOpen && showTitle && <ListItemText primary="Subject Allocation" className="list-item-text"/>}
            </ListItem>
          </Tooltip>
        )}
        {visibleItems.includes('attendanceTracking') && (
          <Tooltip title="Attendance Tracking" placement="right">
            <ListItem button className="list-item" sx={listItemHoverStyle}>
              <PiMonitorFill size={20} />
              {!isPrimaryFormOpen && showTitle && <ListItemText primary="Attendance Tracking" className="list-item-text"/>}
            </ListItem>
          </Tooltip>
        )}
        {visibleItems.includes('leaveApprovals') && (
          <Tooltip title="Leave Approvals" placement="right">
            <ListItem button className="list-item" sx={listItemHoverStyle}>
              <BsPersonFillCheck size={20} />
              {!isPrimaryFormOpen && showTitle && <ListItemText primary="Leave Approvals" className="list-item-text" />}
            </ListItem>
          </Tooltip>
        )}
        {visibleItems.includes('academicPerformance') && (
          <Tooltip title="Academic Performance" placement="right">
            <ListItem button className="list-item" sx={listItemHoverStyle}>
              <TrendingUp size={18}/>
              {!isPrimaryFormOpen && showTitle && <ListItemText primary="Academic Performance" className="list-item-text"/>}
            </ListItem>
          </Tooltip>
        )}
        {visibleItems.includes('teacherAlert') && (
          <Tooltip title="Teacher Alert" placement="right">
            <ListItem button className="list-item" sx={listItemHoverStyle}>
              <IoIosAlert size={20} />
              {!isPrimaryFormOpen && showTitle && <ListItemText primary="Teacher Alert" className="list-item-text"/>}
            </ListItem>
          </Tooltip>
        )}
        {visibleItems.includes('eventPlanning') && (
          <Tooltip title="Event Planning" placement="right">
            <ListItem button className="list-item" sx={listItemHoverStyle}>
              <BiSolidCalendarEdit size={20} />
              {!isPrimaryFormOpen && showTitle && <ListItemText primary="Event Planning" className="list-item-text"/>}
            </ListItem>
          </Tooltip>
        )}
        {visibleItems.includes('careerGuidance') && (
          <Tooltip title="Career Guidance" placement="right">
            <ListItem button className="list-item" sx={listItemHoverStyle} onClick={navigateToCareerGuidance}>
              <RiFlightTakeoffFill size={20} />
              {!isPrimaryFormOpen && showTitle && <ListItemText primary="Career Guidance" className="list-item-text"/>}
            </ListItem>
          </Tooltip>
        )}
        {visibleItems.includes('updateEnrollment') && (
          <Tooltip title="Update Enrollment" placement="right">
            <ListItem button className="list-item" sx={listItemHoverStyle} onClick={navigateToUpdateEnrollment}>
              <FaUserEdit size={20} />
              {!isPrimaryFormOpen && showTitle && <ListItemText primary="Update Enrollment" className="list-item-text"/>}
            </ListItem>
          </Tooltip>
        )}
        {visibleItems.includes('inventoryManagement') && (
          <Tooltip title="Inventory Management" placement="right">
            <ListItem button className="list-item" sx={listItemHoverStyle}>
              <MdInventory size={22} />
              {!isPrimaryFormOpen && showTitle && <ListItemText primary="Inventory Management" className="list-item-text" sx={{ marginLeft: 2 }} />}
            </ListItem>
          </Tooltip>
        )}
      </List>
     
    </Box>
  );
};

export default Sidebar;