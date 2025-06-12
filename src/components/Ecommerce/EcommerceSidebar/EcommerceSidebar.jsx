import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Drawer, Box, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import { GlobalStateContext } from '../GlobalStateContext';

function EcommerceSidebar({ open, onClose }) {
  const navigate = useNavigate();
  const { user, setUser, setIsAuthenticated } = useContext(GlobalStateContext) || {};

  const handleLogout = () => {
    // Clear global state
    if (setUser) setUser(null);
    if (setIsAuthenticated) setIsAuthenticated(false);
    
    // Clear local storage
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    
    // Close sidebar
    onClose();
    
    // Navigate to dashboard and force refresh
    navigate('/ecommerce-dashboard');
    window.location.reload(); // Force full page refresh to clear any cached state
  };

  const handleProfile = () => {
    onClose();
    navigate('/profile');
  };

  const handleAddresses = () => {
    onClose();
    navigate('/addresses');
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 260 }} role="presentation">
        <List>
          <ListItem button onClick={handleProfile}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem button onClick={handleAddresses}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Addresses" />
          </ListItem>
          <Divider />
          <ListItem button onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}

export default EcommerceSidebar;