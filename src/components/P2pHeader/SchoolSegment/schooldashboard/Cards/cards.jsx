import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalStateContext } from '../../../../../GlobalStateContext';
import './cards.css';
import HashLoader from 'react-spinners/HashLoader';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'; // For staff icon
import BaseUrl from '../../../../../config'; // Adjust the import path as necessary
import axios from 'axios';

const cardActions = [
  {
    title: 'Student Enrollment',
    countKey: 'studentCount',
    icon: <PersonIcon className='sd-card-icon'/>,
    label: 'Total Students',
    buttons: [
      { label: 'Enroll', id: 'enroll-btn', action: 'handleStudentEnrollClick' },
      { label: 'Details', action: 'handleStudentDetails' }
    ]
  },
  {
    title: 'Staff Enrollment',
    countKey: 'staffCount',
    icon: <PeopleAltIcon className='sd-card-icon'/>,
    label: 'Total Staff',
    buttons: [
      { label: 'Enroll', id: 'enroll-btn', action: 'handleStaffEnrollClick' },
      { label: 'Details', action: 'handleStaffDetails' }
    ]
  },
  {
    title: 'School Internal Data',
    buttons: [
      { label: 'Update / View', id: 'enroll-btn', action: 'handleUpdateSchoolData' }
    ],
    description: 'Provide school information',
  },
  {
    title: 'Staff Payroll',
    buttons: [
      { label: 'Details', id: 'enroll-btn', action: 'handleStaffPayroll' }
    ],
    description: 'Salary processing and disbursement',
  },
  {
    title: 'Student Fee Payment / Status',
    buttons: [
      { label: 'Collect Fee', id: 'enroll-btn' },
      { label: 'Dues' }
    ],
    description: 'Fee collection and outstanding',
  },
  {
    title: 'Class Timetables',
    buttons: [
      { label: 'Schedule', id: 'enroll-btn', action: 'handleClassTimetableSchedule' },
      { label: 'View', action: 'handleClassTimetableView' }
    ],
    description: 'Class schedules and adjustments',
  }
];

const Cards = () => {
  const navigate = useNavigate();
  const { globalData } = useContext(GlobalStateContext);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [studentCount, setStudentCount] = useState(0);
  const [staffCount, setStaffCount] = useState(0);

    // Fetch counts from the backend
    useEffect(() => {
      const fetchCounts = async () => {
        try {
          setLoading(true);
          const school_id = globalData.data.school_id; // Assuming schoolId is stored in globalData
          const response = await axios.get(`${BaseUrl}/school/${school_id}/counts`); // Replace with your API endpoint
          setStudentCount(response.data.studentCount || 0);
          setStaffCount(response.data.staffCount || 0);
        } catch (error) {
          console.error('Error fetching counts:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchCounts();
    }, [globalData]);

  const actionHandlers = {
    handleStudentEnrollClick: () => setOpen(true),
    handleStudentDetails: () => navigate('/student-details'),
    handleStaffEnrollClick: () => navigate('/staff-enroll'),
    handleStaffDetails: () => navigate('/staff-details', { state: { schoolId: globalData.data.school_id } }),
    handleStaffPayroll: () => navigate('/staff-payroll'),
    handleUpdateSchoolData: () => navigate('/school-internal-data'),
    handleClassTimetableSchedule: () => navigate('/class-timetable'),
    handleClassTimetableView: () => navigate('/class-timetable-view'),
    handleAddSingleStudent: () => navigate('/student-enroll'),
    handleAddBulkStudent: () => navigate('/student-bulk-enroll')
  };

  const handleClose = () => setOpen(false);

  return (
    <div className="cards-container">
      {cardActions.map((card, index) => (
        <div className="sd-card" key={index}>
          <div
            className="card-title"
            style={{
              backgroundColor: [
                '#ffac81', // Red
                '#ffac81', // Green
                '#758e4f', // Blue
                '#758e4f', // Yellow
                '#78290f', // Purple
                '#78290f', // Orange
              ][index % 6],
            }}
          >
            {card.title}
          </div>
          {card.countKey && (
            <div className="count-row">
              <div className='count-content'>
                <div className='count-left'>
                {card.icon}
                <span className="count-number">
                    {card.countKey === 'studentCount' ? studentCount : staffCount}
                  </span>
              </div>
              <div className="count-right">
                  {card.label}
                </div>
                </div>
            </div>
          )}
          <p className="card-description">{card.description}</p>
          <div className="button-group">
            {card.buttons.map((button, btnIndex) => (
              <button
                key={btnIndex}
                id={button.id || ''}
                onClick={button.action ? actionHandlers[button.action] : undefined}
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>
      ))}

      {loading && (
        <div className="loader-container">
          <HashLoader color="#ffffff" size={50} />
        </div>
      )}

      <Dialog 
        open={open} 
        onClose={handleClose} 
        className="dialog-container" 
        PaperProps={{ style: { borderRadius: 15 } }}
      >
        <DialogContent className='enroll-box'>
          <div className="dialog-button-group">
            <Button
              color="primary"
              startIcon={<PersonIcon />}
              onClick={actionHandlers.handleAddSingleStudent}
              className="dialog-button add-single"
            >
              Add Single Student
            </Button>
            <Button
              color="secondary"
              startIcon={<GroupIcon />}
              className="dialog-button add-bulk"
              onClick={actionHandlers.handleAddBulkStudent}
            >
              Add Bulk Students
            </Button>
          </div>
          <DialogActions>
            <Button onClick={handleClose} color="primary" className="close-button">
              Cancel
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default React.memo(Cards);