import React, {useContext} from 'react';
// import React, { useState, useContext } from 'react';

import { styled } from '@mui/material/styles';
import { Link, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Home, TrendingUp } from '@mui/icons-material';
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';
import HowToRegRoundedIcon from '@mui/icons-material/HowToRegRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import EditCalendarRoundedIcon from '@mui/icons-material/EditCalendarRounded';
import FlightTakeoffRoundedIcon from '@mui/icons-material/FlightTakeoffRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import { GlobalStateContext } from '../../../../../GlobalStateContext';

import { FaUserEdit } from "react-icons/fa"; // Import the new icon

const drawerWidth = 260;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(5)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(6)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    position: 'fixed',
    zIndex: 1000,
    boxSizing: 'border-box',
    margin: '50px 0',
    '& .MuiDrawer-paper': {
      margin: '50px 0 ',
    },
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  }),
);

export default function MiniDrawer({ visibleItems }) {
  const [open, setOpen] = React.useState(false);
  const location = useLocation();
  const { globalData } = useContext(GlobalStateContext);
  

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const schoolId = globalData?.data?.school_id;

  const menuItems = [
    { text: 'Dashboard', path: `/school_dashboard/${schoolId}`, icon: <Home />, key: 'home' },
    { text: 'Attach Documents', path: '/attach-document', icon: <AttachFileRoundedIcon />, key: 'attachDocument' },
    { text: 'Subject Allocation', path: '/subject-allocation', icon: <AccountTreeRoundedIcon />, key: 'subjectAllocation' },
    { text: 'Leave Approval', path: '/leave-approval', icon: <HowToRegRoundedIcon />, key: 'leaveApprovals' },
    { text: 'Teacher Alert', path: '/teacher-alert', icon: <InfoRoundedIcon />, key: 'teacherAlert' },
    { text: 'Career Guidance', path: '/career-guidance', icon: <FlightTakeoffRoundedIcon />, key: 'careerGuidance' },
    { text: 'Inventory Management', path: '/inventory-management', icon: <Inventory2RoundedIcon />, key: 'inventoryManagement' },
    { text: 'Attendance Tracking', path: '/attendance', icon: <AssessmentRoundedIcon />, key: 'attendanceTracking' },
    { text: 'Academic Performance', path: '/academic-performance', icon: <TrendingUp />, key: 'academicPerformance' },
    { text: 'School Statistics', path: '/school-statistics', icon: <TrendingUp />, key: 'schoolStatistics' },
    { text: 'Event Planning', path: '/event-planning', icon: <EditCalendarRoundedIcon />, key: 'eventPlanning' },
    { text: 'Update Enrollment', path: '/update-enrollment', icon: <FaUserEdit style={{fontSize: '22px' }}  />, key: 'updateEnrollment' },
    { text: 'Update Staff Payroll', path: '/update-staff-payroll', icon: <FaUserEdit />, key: 'updateStaffPayroll' },
  ];

  return (
    <Box>
      <Drawer
        variant="permanent"
        open={open}
        onMouseEnter={handleDrawerOpen}
        onMouseLeave={handleDrawerClose}
        sx={{
          backgroundColor: '#000',
          padding: '0px', // Add padding here
          border: 'none',
          '& .MuiDrawer-paper': {
            backgroundColor: '#003353',
            padding: '10px', // sidebar's padding
            border: 'none',
          },
        }}
      >
        <List>
          {menuItems.map(({ text, path, icon, key }) => {
            if (!visibleItems.includes(key)) return null;
            const selected = location.pathname === path || (text === 'Dashboard' && location.pathname === '/');
            return (
              <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  component={Link}
                  to={path}
                  sx={[
                    {
                      minHeight: 48,
                      px: 2.5,
                      borderRadius: '50px',
                      backgroundColor: selected ? '#DFECEF' : 'inherit',
                      color: selected ? '#003353' : '#DFECEF',
                      '&:hover': {
                        backgroundColor: selected ? '#DFECEF' : 'rgba(0, 0, 0, 0.04)',
                        marginLeft: '5px',
                      },
                    },
                    open
                      ? {
                          justifyContent: 'initial',
                        }
                      : {
                          justifyContent: 'center',
                        },
                  ]}
                >
                  <ListItemIcon
                    sx={[
                      {
                        padding: '5px',
                        minWidth: 0,
                        justifyContent: 'center',
                        borderRadius: '50%',
                        backgroundColor: selected ? '#003353' : '#DFECEF',
                        color: selected ? '#DFECEF' : '#003353',
                      },
                      open
                        ? {
                            mr: 3,
                          }
                        : {
                            mr: 'auto',
                          },
                    ]}
                  >
                    {icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={text}
                    sx={[
                      {
                        color: selected ? '#003353' : '#fff',
                      },
                      open
                        ? {
                            opacity: 1,
                          }
                        : {
                            opacity: 0,
                          },
                    ]}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>
    </Box>
  );
}