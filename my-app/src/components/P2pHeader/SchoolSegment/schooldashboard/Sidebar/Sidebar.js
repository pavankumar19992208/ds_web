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
import './Sidebar.css'; // Import the CSS file

const Sidebar = ({ visibleItems = [], hideProfile = false }) => { // Add hideProfile prop
  const [selectedItem, setSelectedItem] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      setSelectedItem('home');
    }
  }, [location.pathname]);

  const navigateToHomepage = () => {
    navigate('/');
    setSelectedItem('home');
  };

  const navigateToAttachDocument = () => {
    navigate('/attach-document');
    setSelectedItem('attachDocument');
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

  return (
    <Box className="sidebar">
      <List component="nav">
        {visibleItems.includes('home') && (
          <Tooltip title="Home" placement="right">
            <ListItem
              button
              className="list-item"
              sx={selectedItem === 'home' ? selectedListItemStyle : listItemHoverStyle}
              onClick={navigateToHomepage}
              style={selectedItem === 'home' ? { pointerEvents: 'none' } : {}}
            >
              <Home sx={{ marginRight: 2 }} />
              <ListItemText primary="Home" className="list-item-text" />
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
              <CgAttachment size={21} />
              <ListItemText primary="Attach Document" className="list-item-text" sx={{ marginLeft: 2 }} />
            </ListItem>
          </Tooltip>
        )}
        {visibleItems.includes('subjectAllocation') && (
          <Tooltip title="Subject Allocation" placement="right">
            <ListItem button className="list-item" sx={listItemHoverStyle}>
              <MdTopic size={22} />
              <ListItemText primary="Subject Allocation" className="list-item-text" sx={{ marginLeft: 2 }} />
            </ListItem>
          </Tooltip>
        )}
        {visibleItems.includes('attendanceTracking') && (
          <Tooltip title="Attendance Tracking" placement="right">
            <ListItem button className="list-item" sx={listItemHoverStyle}>
              <PiMonitorFill size={22} />
              <ListItemText primary="Attendance Tracking" className="list-item-text" sx={{ marginLeft: 2 }} />
            </ListItem>
          </Tooltip>
        )}
        {visibleItems.includes('leaveApprovals') && (
          <Tooltip title="Leave Approvals" placement="right">
            <ListItem button className="list-item" sx={listItemHoverStyle}>
              <BsPersonFillCheck size={22} />
              <ListItemText primary="Leave Approvals" className="list-item-text" sx={{ marginLeft: 2 }} />
            </ListItem>
          </Tooltip>
        )}
        {visibleItems.includes('academicPerformance') && (
          <Tooltip title="Academic Performance" placement="right">
            <ListItem button className="list-item" sx={listItemHoverStyle}>
              <TrendingUp sx={{ marginRight: 2 }} />
              <ListItemText primary="Academic Performance" className="list-item-text" />
            </ListItem>
          </Tooltip>
        )}
        {visibleItems.includes('teacherAlert') && (
          <Tooltip title="Teacher Alert" placement="right">
            <ListItem button className="list-item" sx={listItemHoverStyle}>
              <IoIosAlert size={22} />
              <ListItemText primary="Teacher Alert" className="list-item-text" sx={{ marginLeft: 2 }} />
            </ListItem>
          </Tooltip>
        )}
      </List>
    </Box>
  );
};

export default Sidebar;