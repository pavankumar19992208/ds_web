import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Avatar, Typography, Drawer, Box, Button } from '@mui/material';
import { Event, Notifications, ExitToApp } from '@mui/icons-material';
import { GlobalStateContext } from '../../../../../GlobalStateContext';
import './Navbar.css';

const Navbar = ({ schoolName, schoolLogo, establishmentYear, establishmentID, email, contactNumber, onStartNewAcademicYear }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { globalData, setGlobalData } = useContext(GlobalStateContext);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleLogout = () => {
    setGlobalData(null); // Clear global data
    navigate('/'); // Redirect to Landing page
  };

  return (
    <AppBar id="navbar">
      <Toolbar sx={{ width: "100%" }}>
        <div className="navbar-left">
          <Button onClick={toggleDrawer(true)} style={{ display: 'flex', alignItems: 'center', textTransform: 'none' }}>
            <Avatar id='avatar' alt="School Logo" src={schoolLogo} />
            <Typography id='name' variant="h6" style={{ marginLeft: '10px' }}>
              {schoolName}
            </Typography>
          </Button>
        </div>
        <div className="navbar-right">
          <Button className='new-aca-year-btn'  onClick={onStartNewAcademicYear}>
            Start New Academic Year
          </Button>
          <IconButton id="icon" onClick={handleMenuOpen}>
            <Event />
          </IconButton>
          <Menu
            id="calendar-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              style: {
                width: '180px', // Adjust the width as needed
              },
            }}
          >
            <MenuItem onClick={handleMenuClose}>School Events</MenuItem>
            <MenuItem onClick={handleMenuClose}>Holidays</MenuItem>
          </Menu>

          <IconButton id="icon">
            <Notifications />
          </IconButton>
          <IconButton id="logout_icon" onClick={handleLogout}>
            <ExitToApp />
          </IconButton>
        </div>
      </Toolbar>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 500 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <div className="profile-card">
            <Avatar id='profile-avatar' alt="School Logo" src={schoolLogo} />
            <Typography id='profile-name' variant="h6" style={{ marginLeft: '10px' }}>
              {schoolName}
            </Typography>
          </div>
          <div className="school-details" style={{ padding: '10px' }}>
            <Typography variant="body2" style={{ marginTop: '16px', marginBottom: '16px' }}>
              <medium>Establishment Year:</medium> {establishmentYear}
            </Typography>
            <Typography variant="body2" style={{ marginBottom: '16px' }}>
              <medium>Establishment ID:</medium> {establishmentID}
            </Typography>
            <Typography variant="body2" style={{ marginBottom: '16px' }}>
              <medium>School ID:</medium> {globalData?.data?.school_id || 'N/A'}
            </Typography>
            <Typography variant="body2" style={{ marginBottom: '16px' }}>
              <medium>Email:</medium> {email}
            </Typography>
            <Typography variant="body2" style={{ marginBottom: '16px' }}>
              <medium>Contact Number:</medium> {contactNumber}
            </Typography>
          </div>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;