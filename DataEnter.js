import React, { useState } from 'react';
import Navbar from './Navbar';
import MetaData from './MetaData';
import Content from './Content';

const DataEnter = () => {
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [syllabusType, setSyllabusType] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  return (
    <div>
      <Navbar showButtons={false} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingLeft: '20px' }}>
        <MetaData setGrades={setGrades} setSubjects={setSubjects} setSyllabusType={setSyllabusType} setSuccessMessage={setSuccessMessage} />
        <Content grades={grades} subjects={subjects} syllabusType={syllabusType} successMessage={successMessage} />
      </div>
    </div>
  );
};

export default DataEnter;