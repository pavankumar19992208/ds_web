import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Drawer, Box, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import CloseIcon from '@mui/icons-material/Close';
import { GlobalStateContext } from '../GlobalState';
import './EcommerceSidebar.css'; // Ensure you have the correct path for your CSS file

function EcommerceSidebar({ open, onClose }) {
  const navigate = useNavigate();
  const { user, setUser, setIsAuthenticated } = useContext(GlobalStateContext) || {};

  const handleLogout = () => {
    if (setUser) setUser(null);
    if (setIsAuthenticated) setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    onClose();
    navigate('/ecommerce-dashboard');
    window.location.reload();
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
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ className: 'custom-sidebar-paper' }}
      hideBackdrop={true}
    >
      <Box role="presentation" sx={{position: 'relative', minHeight: '200vh', paddingTop: 2 }}>
        {/* Close Icon at top right */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 10,
          }}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
        <List sx={{ marginTop: 5 }}>
          <ListItem button onClick={handleProfile} className="eco-custom-list-item">
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem button onClick={handleAddresses} className="eco-custom-list-item">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Addresses" />
          </ListItem>
          <ListItem button onClick={handleLogout} className="eco-custom-list-item">
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