import React, { useState } from 'react';
import Navbar from './Navbar';
import BaseUrl from '../config';

const DataEnter = () => {
  const [hoveredButton, setHoveredButton] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [schoolId, setSchoolId] = useState('');
  const [grade, setGrade] = useState('');
  const [subject, setSubject] = useState('');
  const [chapters, setChapters] = useState([]);
  const [chapterInput, setChapterInput] = useState('');
  const [chapterCount, setChapterCount] = useState(0);
  const [chapterNames, setChapterNames] = useState([]);
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const buttonStyle = {
    display: 'block',
    width: '100px',
    margin: '10px 0',
    padding: '10px',
    fontSize: '20px',
    cursor: 'pointer',
    borderRadius: '5px',
    marginLeft: '30px', // Move buttons to the right
    fontFamily: 'monospace',
  };

  const itemAStyle = {
    ...buttonStyle,
    marginTop: '30px', // Move Item-A down
    backgroundColor: hoveredButton === 'Item-A' ? '#ddd' : '#fff', // Change background color on hover
  };

  const itemBStyle = {
    ...buttonStyle,
    backgroundColor: hoveredButton === 'Item-B' ? '#ddd' : '#fff', // Change background color on hover
  };

  const largerButtonStyle = {
    ...buttonStyle,
    width: '150px',
    padding: '15px',
    fontSize: '24px',
  };

  const smallerButtonStyle = {
    ...buttonStyle,
    width: '80px',
    padding: '8px',
    fontSize: '16px',
  };

  const handleButtonClick = (button) => {
    setHoveredButton(button);
    if (button === 'Item-A') {
      setShowForm((prevShowForm) => !prevShowForm);
    }
  };

  const handleAddChapterCount = () => {
    const count = parseInt(chapterInput, 10);
    if (!isNaN(count) && count > 0) {
      setChapterCount(count);
      setChapterNames(Array(count).fill(''));
      setChapterInput('');
    }
  };

  const handleChapterNameChange = (index, value) => {
    const newChapterNames = [...chapterNames];
    newChapterNames[index] = value;
    setChapterNames(newChapterNames);
  };

  const handleAddChapters = () => {
    setChapters(chapterNames);
    setChapterCount(0);
    setChapterNames([]);
  };

  const handleGetSchoolInfo = async () => {
    try {
      const response = await fetch(`${BaseUrl}/schoolinfo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ SchoolId: String(schoolId) }),
      });
      const data = await response.json();
      console.log(data);
      console.log(data.data.GradeLevelFrom);
      // Extract grades and subjects from the response
      const gradeLevelFrom = parseInt(data.data.GradeLevelFrom.match(/\d+/)[0], 10);
      const gradeLevelTo = parseInt(data.data.GradeLevelTo.match(/\d+/)[0], 10);
      const gradesList = [];
      for (let i = gradeLevelFrom; i <= gradeLevelTo; i++) {
        gradesList.push(`Class ${i}`);
      }
      setGrades(gradesList);
      setSubjects(data.data.Subjects);
    } catch (error) {
      console.error('Error fetching school info:', error);
    }
  };

  return (
    <div>
      <Navbar showButtons={false} />
   
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingLeft: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            style={itemAStyle}
            onClick={() => handleButtonClick('Item-A')}
            onMouseEnter={() => setHoveredButton('Item-A')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            Item-A
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
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
          <button
            style={itemBStyle}
            onClick={() => handleButtonClick('Item-B')}
            onMouseEnter={() => setHoveredButton('Item-B')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            Item-B
          </button>
          {showForm && (
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '60px' }}>
              <label style={{ fontSize: '24px' }}>
                Grade:
                <select value={grade} onChange={(e) => setGrade(e.target.value)} style={{ marginLeft: '10px', width: '300px', padding: '10px', fontSize: '20px', borderRadius: '5px', fontFamily: 'monospace', borderColor: 'black' }}>
                  <option value="">Select Grade</option>
                  {grades.map((grade, index) => (
                    <option key={index} value={grade}>{grade}</option>
                  ))}
                </select>
              </label>
              <label style={{ fontSize: '24px', marginLeft: '40px' }}>
                Subject:
                <select value={subject} onChange={(e) => setSubject(e.target.value)} style={{ marginLeft: '10px', width: '300px', padding: '10px', fontSize: '20px', borderRadius: '5px', fontFamily: 'monospace', borderColor: 'black' }}>
                  <option value="">Select Subject</option>
                  {subjects.map((subject, index) => (
                    <option key={index} value={subject}>{subject}</option>
                  ))}
                </select>
              </label>
              <label style={{ fontSize: '24px', marginLeft: '40px' }}>
                Chapter:
                <input
                  type="number"
                  value={chapterInput}
                  onChange={(e) => setChapterInput(e.target.value)}
                  style={{ marginLeft: '10px', width: '100px', padding: '10px', fontSize: '20px', borderRadius: '5px', fontFamily: 'monospace' }}
                />
                <button onClick={handleAddChapterCount} style={{ ...smallerButtonStyle, backgroundColor: 'blue', marginLeft: '10px' }}>
                  Add
                </button>
              </label>
            </div>
          )}
        </div>
      </div>
      {showForm && chapterCount > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
          {Array.from({ length: chapterCount }).map((_, index) => (
            <div key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
              <label style={{ fontSize: '24px' }}>
                Chapter {index + 1}:
                <input
                  type="text"
                  value={chapterNames[index]}
                  onChange={(e) => handleChapterNameChange(index, e.target.value)}
                  style={{ marginLeft: '10px', width: '300px', padding: '10px', fontSize: '20px', borderRadius: '5px', fontFamily: 'monospace' }}
                />
              </label>
            </div>
          ))}
          <button onClick={handleAddChapters} style={{ ...largerButtonStyle, backgroundColor: 'blue', marginTop: '20px' }}>
            Submit Chapters
          </button>
        </div>
      )}
      {showForm && chapters.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <p>ENTERED CHAPTERS</p>
            <ul>
              {chapters.map((chapter, index) => (
                <li key={index}>{chapter}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataEnter;