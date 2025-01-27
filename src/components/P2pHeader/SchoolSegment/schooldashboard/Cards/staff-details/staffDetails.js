import React, {useContext, useState} from 'react';
import Navbar from '../../Navbar/Navbar';
import Sidebar from '../../Sidebar/Sidebar';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Menu, MenuItem, TextField, Button} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { GlobalStateContext } from '../../../../../../GlobalStateContext';
import './staffDetails.css';

const StaffDetails = () => {
        const { globalData } = useContext(GlobalStateContext);
        const staff = [
            { s_no:1, Staff_ID: 1, name: 'Staff 1', qualification: '12th', experience: '5 Years' },
            { s_no:2, Staff_ID: 2, name: 'Staff 2', qualification: 'B.Tech', experience: '3 Years' },
            { s_no:3, Staff_ID: 3, name: 'Staff 3', qualification: 'MBA', experience: '4 Years'},
            { s_no:4, Staff_ID: 4, name: 'Staff 4', qualification: 'Msc', experience: '2 Years' },
            { s_no:5, Staff_ID: 5, name: 'Staff 5', qualification: 'Bsc', experience: '1 Years'},
            { s_no:6, Staff_ID: 6, name: 'Staff 6', qualification: 'Diploma', experience: '8 Years' },
        ]; // Example data
        const [anchorEl, setAnchorEl] = useState(null);
        const [selectedStaff, setSelectedStaff] = useState(null);
        const [searchQuery, setSearchQuery] = useState('');
        const [filteredStaff, setFilteredStaff] = useState(staff);

        const handleClick = (event, staff) => {
            setAnchorEl(event.currentTarget);
            setSelectedStaff(staff);
        };

        const handleClose = () => {
            setAnchorEl(null);
            setSelectedStaff(null);
        };

        const handleSearchChange = (event) => {
            setSearchQuery(event.target.value);
        };

        const handleSearch = () => {
            const query = searchQuery.toLowerCase();
            const filtered = staff.filter(staff => 
                staff.name.toLowerCase().includes(query) || 
                staff.Staff_ID.toString().includes(query)
            );
            setFilteredStaff(filtered);
        };

        const handleKeyPress = (event) => {
            if (event.key === 'Enter') {
                handleSearch();
            }
        };

    return(
        <div className="staff-details">
          <Navbar 
          schoolName={globalData.data.SCHOOL_NAME} 
          schoolLogo={globalData.data.SCHOOL_LOGO} 
          />
          <Sidebar visibleItems={['home', 'attachDocument', 'subjectAllocation', 'attendanceTracking', 'leaveApprovals', 'academicPerformance','teacherAlert', 'eventPlanning', 'careerGuidance', 'inventoryManagement']} showTitle={true} selectedItem="home" />
          <div className="staff-details-container">
          <div className="search-bar-container">
             <input 
                type="text" 
                placeholder="Search" 
                value={searchQuery} 
                onChange={handleSearchChange} 
                onKeyPress={handleKeyPress}
                className="search-bar"
              />
              <Button className='search-btn' variant="contained" color="primary" onClick={handleSearch}>Search</Button>
            </div>
            <TableContainer component={Paper} style={{ marginTop: 20, borderRadius: 10 }}>
                    <Table>
                      <TableHead style={{ backgroundColor: '#f0f0f0' }}>
                        <TableRow>
                        <TableCell style={{ fontWeight: 'bold' }}>S No</TableCell>
                          <TableCell style={{ fontWeight: 'bold' }}>Staff ID</TableCell>
                          <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
                          <TableCell style={{ fontWeight: 'bold' }}>Qualification</TableCell>
                          <TableCell style={{ fontWeight: 'bold' }}>Experience</TableCell>
                          <TableCell style={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredStaff.length > 0 ? (
                          filteredStaff.map((staff, index) => (
                            <TableRow className="hover-cell" key={index} >
                              <TableCell>{staff.s_no}</TableCell>
                              <TableCell>{staff.Staff_ID}</TableCell>
                              <TableCell>{staff.name}</TableCell>
                              <TableCell>{staff.qualification}</TableCell>
                              <TableCell>{staff.experience}</TableCell>
                              <TableCell>
                                          <IconButton onClick={(event) => handleClick(event, staff)}>
                                              <MoreVertIcon />
                                          </IconButton>
                                      </TableCell>                          
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} style={{ textAlign: 'center' }}>No data available</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleClose}>View Details</MenuItem>
                  </Menu>

          </div>
        </div> 
    );
};
export default StaffDetails;