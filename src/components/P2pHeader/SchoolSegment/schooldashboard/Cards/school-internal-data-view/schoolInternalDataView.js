import React, { useContext, useState } from 'react';
import Navbar from '../../Navbar/Navbar';
import Sidebar from '../../Sidebar/Sidebar';
import { GlobalStateContext } from '../../../../../../GlobalStateContext';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { styled } from '@mui/material/styles';
import './schoolInternalDataView.css';

const Input = styled('input')({
  display: 'none',
});

const SchoolInternalDataView = () => {
    const { globalData } = useContext(GlobalStateContext);
    const [hover, setHover] = useState(false);

    return (
        <div className="sid-view">
            <Navbar 
                schoolName={globalData.data.SCHOOL_NAME} 
                schoolLogo={globalData.data.SCHOOL_LOGO} 
            />
            <Sidebar 
                visibleItems={['home', 'attachDocument', 'subjectAllocation', 'attendanceTracking', 'leaveApprovals', 'academicPerformance','teacherAlert', 'eventPlanning', 'careerGuidance', 'inventoryManagement']} 
                showTitle={true} 
                selectedItem="home" 
            />
            <div className="sid-view-container">
                <div 
                    className="avatar-container"
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                >
                    <label htmlFor="avatar">
                        <Input accept="image/*" id="avatar" type="file" />
                        <Avatar alt="School Avatar" src={globalData.data.SCHOOL_LOGO} sx={{ width: 56, height: 56 }} />
                        {hover && (
                            <IconButton component="span" className="edit-icon">
                                <EditIcon />
                            </IconButton>
                        )}
                    </label>
                </div>
                <form className="school-details-form">
                    <div className="form-group">
                        <label htmlFor="schoolId">School ID</label>
                        <input type="text" id="schoolId" value={globalData.data.SCHOOL_ID} readOnly />
                    </div>
                    <div className="form-group">
                        <label htmlFor="schoolName">School Name</label>
                        <input type="text" id="schoolName" value={globalData.data.SCHOOL_NAME} readOnly />
                    </div>
                    <div className="form-group">
                        <label htmlFor="syllabusType">Syllabus Type</label>
                        <input type="text" id="syllabusType" value={globalData.data.SYLLABUS_TYPE} readOnly />
                    </div>
                    <div className="form-group">
                        <label htmlFor="schoolType">School Type</label>
                        <input type="text" id="schoolType" value={globalData.data.SCHOOL_TYPE} readOnly />
                    </div>
                    <div className="form-group">
                        <label htmlFor="medium">Medium</label>
                        <input type="text" id="medium" value={globalData.data.MEDIUM} readOnly />
                    </div>
                    <div className="form-group">
                        <label htmlFor="examPattern">Exam Pattern</label>
                        <input type="text" id="examPattern" value={globalData.data.EXAM_PATTERN} readOnly />
                    </div>
                    <div className="form-group">
                        <label htmlFor="assessmentCriteria">Assessment Criteria</label>
                        <input type="text" id="assessmentCriteria" value={globalData.data.ASSESSMENT_CRITERIA} readOnly />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SchoolInternalDataView;