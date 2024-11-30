import React, { useState } from 'react';
import BaseUrl from '../config';

const MetaData = ({ setGrades, setSubjects, setSyllabusType, setSuccessMessage }) => {
  const [hoveredButton, setHoveredButton] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [schoolId, setSchoolId] = useState('');

  const buttonStyle = {
    display: 'block',
    width: '100px',
    margin: '10px 0',
    padding: '10px',
    fontSize: '20px',
    cursor: 'pointer',
    borderRadius: '5px',
    marginLeft: '30px',
    fontFamily: 'monospace',
  };

  const itemAStyle = {
    ...buttonStyle,
    marginTop: '30px',
    backgroundColor: hoveredButton === 'Item-A' ? '#ddd' : '#fff',
  };

  const smallerButtonStyle = {
    ...buttonStyle,
    width: '80px',
    padding: '8px',
    fontSize: '16px',
  };

  const handleButtonClick = () => {
    setHoveredButton('Item-A');
    setShowForm((prevShowForm) => !prevShowForm);
  };

  const handleGetSchoolInfo = async () => {
    try {
      const response = await fetch(`${BaseUrl}/addcontent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ SchoolId: String(schoolId) }),
      });
      const data = await response.json();
      console.log(data);
      const gradeLevelFrom = parseInt(data.data.GradeLevelFrom.match(/\d+/)[0], 10);
      const gradeLevelTo = parseInt(data.data.GradeLevelTo.match(/\d+/)[0], 10);
      const gradesList = [];
      for (let i = gradeLevelFrom; i <= gradeLevelTo; i++) {
        gradesList.push(`Class ${i}`);
      }
      setGrades(gradesList);
      setSubjects(data.data.Subjects);
      const curriculum = data.data.Curriculum;
      const state = data.data.State;
      setSyllabusType(` ${state} ${curriculum} `);
      setSuccessMessage('Details fetched successfully');
    } catch (error) {
      console.error('Error fetching school info:', error);
    }
  };

  return (
    <div>
      <button
        style={itemAStyle}
        onClick={handleButtonClick}
        onMouseEnter={() => setHoveredButton('Item-A')}
        onMouseLeave={() => setHoveredButton(null)}
      >
        META DATA
      </button>
      {showForm && (
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '60px' }}>
          <label style={{ fontSize: '24px' }}>
            School ID:
            <input
              type="text"
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)}
              style={{ marginLeft: '10px', width: '300px', padding: '10px', fontSize: '20px', borderRadius: '5px', fontFamily: 'monospace' }}
            />
          </label>
          <button onClick={handleGetSchoolInfo} style={{ ...smallerButtonStyle, backgroundColor: 'green', marginLeft: '10px' }}>Get</button>
        </div>
      )}
    </div>
  );
};

export default MetaData;