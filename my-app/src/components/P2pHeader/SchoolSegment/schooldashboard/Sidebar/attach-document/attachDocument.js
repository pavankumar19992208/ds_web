import React, { useState } from 'react';
import { Card, CardContent, Typography, Box } from '@material-ui/core';
import Navbar from '../../Navbar/Navbar';
import Sidebar from '../../Sidebar/Sidebar';
import AttachDocumentStudent from '../attach-document/attach-document-student/attachDocumentStudent'; // Import the form component
import { GlobalStateContext } from '../../../../../../GlobalStateContext';

import './attachDocument.css'; // Import the CSS file

const AttachDocument = () => {
  const [showForm, setShowForm] = useState(false);

  const handleStudentCardClick = () => {
    setShowForm(true);
  };

  const { globalData } = React.useContext(GlobalStateContext);


  return (
    <div>
      <Navbar schoolName={globalData.data.SCHOOL_NAME} schoolLogo={globalData.data.SCHOOL_LOGO} />
      <Sidebar visibleItems={['home', 'attachDocument', 'subjectAllocation', 'attendanceTracking', 'leaveApprovals', 'academicPerformance', 'teacherAlert']} />
      <Box className="attach-document-container">
        <Card className="card" onClick={handleStudentCardClick}>
          <CardContent>
            <Typography variant="h5" component="div">
              Student
            </Typography>
            <br/>
            <Typography variant="body2" color="textSecondary">
              Attach documents for students here.
            </Typography>
          </CardContent>
        </Card>
        <Card className="card">
          <CardContent>
            <Typography variant="h5" component="div">
              Teacher
            </Typography>
            <br/>
            <Typography variant="body2" color="textSecondary">
              Attach documents for teachers here.
            </Typography>
          </CardContent>
        </Card>
      </Box>
      {showForm && <AttachDocumentStudent />}
    </div>
  );
};

export default AttachDocument;