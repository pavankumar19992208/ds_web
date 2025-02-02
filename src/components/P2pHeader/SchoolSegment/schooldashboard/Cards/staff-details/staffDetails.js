import React, { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../Navbar/Navbar';
import Sidebar from '../../Sidebar/Sidebar';
import { Table, TableBody, TableCell, TableHead, TableRow, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Lottie from 'lottie-react';
import BaseUrl from '../../../../../../config';
import { GlobalStateContext } from '../../../../../../GlobalStateContext';
import animationData from '../../../../../../images/Animation - 1738392036492.json'; // Import your Lottie JSON file
import './staffDetails.css';

const StaffDetails = () => {
    const { globalData } = useContext(GlobalStateContext);
    const location = useLocation();
    const { schoolId } = location.state || {};
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredStaff, setFilteredStaff] = useState([]);
    const [staff, setStaff] = useState([]);

    useEffect(() => {
        // Fetch data from the backend
        const fetchStaffDetails = async () => {
            try {
                console.log(`Fetching staff details for schoolId: ${schoolId}`);
                const response = await fetch(`${BaseUrl}/teachers?schoolId=${schoolId}`);
                const data = await response.json();
                console.log('Fetched staff details:', data);
                setStaff(data.teachers);
                setFilteredStaff(data.teachers);
            } catch (error) {
                console.error('Error fetching staff details:', error);
            }
        };

        if (schoolId) {
            fetchStaffDetails();
        }
    }, [schoolId]);

    const handleClick = (event, staff) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        handleSearch(event.target.value);
    };

    const handleSearch = (query) => {
        if (query.trim() === '') {
            setFilteredStaff(staff);
        } else {
            const lowerCaseQuery = query.toLowerCase();
            const filtered = staff.filter(staff =>
                staff.Name.toLowerCase().includes(lowerCaseQuery) ||
                staff.teacherid.toString().includes(lowerCaseQuery)
            );
            setFilteredStaff(filtered);
        }
    };

    return (
        <div className="staff-details">
            <Navbar
                schoolName={globalData.data.SCHOOL_NAME}
                schoolLogo={globalData.data.SCHOOL_LOGO}
            />
            <Sidebar visibleItems={['home', 'attachDocument', 'subjectAllocation', 'attendanceTracking', 'leaveApprovals', 'academicPerformance', 'teacherAlert', 'eventPlanning', 'careerGuidance', 'inventoryManagement']} showTitle={true} selectedItem="home" />
            <div className="staff-details-container">
                <div className="search-bar-container">
                    <input
                        type="text"
                        placeholder="Search by ID or Name"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="search-bar"
                    />
                </div>
                <div className="scrollable-table" style={{ marginTop: 20, borderRadius: 10, maxHeight: '86%', overflow: 'auto', border: '1px solid #0033531d' }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ fontWeight: 'bold', backgroundColor:'#f0f0f0' }}>S No</TableCell>
                                <TableCell style={{ fontWeight: 'bold', backgroundColor:'#f0f0f0' }}>Staff ID</TableCell>
                                <TableCell style={{ fontWeight: 'bold', backgroundColor:'#f0f0f0' }}>Name</TableCell>
                                <TableCell style={{ fontWeight: 'bold', backgroundColor:'#f0f0f0' }}>Qualification</TableCell>
                                <TableCell style={{ fontWeight: 'bold', backgroundColor:'#f0f0f0' }}>Experience</TableCell>
                                <TableCell style={{ fontWeight: 'bold', backgroundColor:'#f0f0f0' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredStaff.length > 0 ? (
                                filteredStaff.map((staff, index) => (
                                    <TableRow className="hover-cell" key={index} >
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{staff.teacherid}</TableCell>
                                        <TableCell>{staff.Name}</TableCell>
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
                                    <TableCell colSpan={6} style={{ textAlign: 'center' }}>
                                        <div className="loading-animation">
                                            <Lottie animationData={animationData} height={200} width={200} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
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