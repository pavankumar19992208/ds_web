import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Avatar, Typography, Drawer, Box, Button } from '@material-ui/core';
import { Event, Notifications, ExitToApp } from '@material-ui/icons';
import './Navbar.css';

const Navbar = ({ schoolName, schoolLogo }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

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
          <IconButton id="logout_icon">
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
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;