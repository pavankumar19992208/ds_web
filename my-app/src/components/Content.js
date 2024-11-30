import React, { useState } from 'react';
import BaseUrl from '../config';

const Content = ({ grades, subjects, syllabusType, successMessage }) => {
  const [hoveredButton, setHoveredButton] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [grade, setGrade] = useState('');
  const [subject, setSubject] = useState('');
  const [chapterInput, setChapterInput] = useState('');
  const [chapterCount, setChapterCount] = useState(0);
  const [chapterNames, setChapterNames] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [contentType, setContentType] = useState('');
  const [selectedExercise, setSelectedExercise] = useState('');
  const [workbookExercises, setWorkbookExercises] = useState([]);
  const [textbookTopics, setTextbookTopics] = useState([]);

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

  const itemBStyle = {
    ...buttonStyle,
    backgroundColor: hoveredButton === 'Item-B' ? '#ddd' : '#fff',
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

  const handleButtonClick = () => {
    setHoveredButton('Item-B');
    setShowForm((prevShowForm) => !prevShowForm);
  };

  const handleAddChapterCount = () => {
    const count = parseInt(chapterInput, 10);
    if (!isNaN(count) && count > 0) {
      setChapterCount(count);
      setChapterNames(Array(count).fill(''));
      setExercises(Array(count).fill(''));
      setChapterInput('');
    }
  };

  const handleChapterNameChange = (index, value) => {
    const newChapterNames = [...chapterNames];
    newChapterNames[index] = value;
    setChapterNames(newChapterNames);
  };

  const handleExerciseChange = (index, value) => {
    const newExercises = [...exercises];
    newExercises[index] = value;
    setExercises(newExercises);
  };

  const handleAddChapters = async () => {
    try {
      const response = await fetch(`${BaseUrl}/addtitles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grade,
          subject,
          syllabustype: syllabusType,
          chapterscount: chapterCount,
          chapters: chapterNames,
          exercises,
        }),
      });
      console.log(exercises);
      if (!response.ok) {
        throw new Error('Failed to submit chapters');
      }

      const data = await response.json();
      console.log('Chapters submitted successfully:', data);
      setChapters(chapterNames);
      setChapterCount(0);
      setChapterNames([]);
      setExercises([]);
    } catch (error) {
      console.error('Error submitting chapters:', error);
    }
  };

  const handleAddWorkbookExercise = () => {
    setWorkbookExercises([...workbookExercises, { serialNo: '', question: '', answer: '', resources: [] }]);
  };

  const handleWorkbookExerciseChange = (index, field, value) => {
    const newExercises = [...workbookExercises];
    newExercises[index][field] = value;
    setWorkbookExercises(newExercises);
  };

  const handleAddResource = (index) => {
    const newExercises = [...workbookExercises];
    newExercises[index].resources.push({ type: '', link: '' });
    setWorkbookExercises(newExercises);
  };

  const handleResourceChange = (exerciseIndex, resourceIndex, field, value) => {
    const newExercises = [...workbookExercises];
    newExercises[exerciseIndex].resources[resourceIndex][field] = value;
    setWorkbookExercises(newExercises);
  };

  const handleAddTextbookTopic = () => {
    setTextbookTopics([...textbookTopics, { serialNo: '', title: '', content: '' }]);
  };

  const handleTextbookTopicChange = (index, field, value) => {
    const newTopics = [...textbookTopics];
    newTopics[index][field] = value;
    setTextbookTopics(newTopics);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${BaseUrl}/submitcontent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grade,
          subject,
          contentType,
          exercises: workbookExercises,
          topics: textbookTopics,
        }),
      });
      const data = await response.json();
      alert(`Data submitted successfully: ${JSON.stringify(data)}`);
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Error submitting data');
    }
  };

  return (
    <div>
      <button
        style={itemBStyle}
        onClick={handleButtonClick}
        onMouseEnter={() => setHoveredButton('Item-B')}
        onMouseLeave={() => setHoveredButton(null)}
      >
        CONTENT
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
          <label style={{ fontSize: '24px', marginLeft: '40px' }}>
            Content Type:
            <select value={contentType} onChange={(e) => setContentType(e.target.value)} style={{ marginLeft: '10px', width: '300px', padding: '10px', fontSize: '20px', borderRadius: '5px', fontFamily: 'monospace', borderColor: 'black' }}>
              <option value="">Select Content Type</option>
              <option value="workbook">Workbook</option>
              <option value="textbook">Textbook</option>
            </select>
          </label>
          {contentType === 'workbook' && (
            <label style={{ fontSize: '24px', marginLeft: '40px' }}>
              Exercise:
              <select value={selectedExercise} onChange={(e) => setSelectedExercise(e.target.value)} style={{ marginLeft: '10px', width: '300px', padding: '10px', fontSize: '20px', borderRadius: '5px', fontFamily: 'monospace', borderColor: 'black' }}>
                <option value="">Select Exercise</option>
                {chapterNames.map((chapter, index) => (
                  <option key={index} value={chapter}>{chapter}</option>
                ))}
              </select>
            </label>
          )}
          {contentType === 'textbook' && (
            <label style={{ fontSize: '24px', marginLeft: '40px' }}>
              Content Type:
              <select value={selectedExercise} onChange={(e) => setSelectedExercise(e.target.value)} style={{ marginLeft: '10px', width: '300px', padding: '10px', fontSize: '20px', borderRadius: '5px', fontFamily: 'monospace', borderColor: 'black' }}>
                <option value="">Select Content Type</option>
                <option value="exercises">Exercises</option>
                <option value="topics">Topics</option>
              </select>
            </label>
          )}
        </div>
      )}
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
              <label style={{ fontSize: '24px', marginLeft: '20px' }}>
                Exercises:
                <input
                  type="number"
                  value={exercises[index]}
                  onChange={(e) => handleExerciseChange(index, e.target.value)}
                  style={{ marginLeft: '10px', width: '100px', padding: '10px', fontSize: '20px', borderRadius: '5px', fontFamily: 'monospace' }}
                />
              </label>
            </div>
          ))}
          <button onClick={handleAddChapters} style={{ ...largerButtonStyle, backgroundColor: 'blue', marginTop: '20px' }}>
            Submit Chapters
          </button>
        </div>
      )}
      {showForm && contentType === 'workbook' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
          {workbookExercises.map((exercise, index) => (
            <div key={index} style={{ marginBottom: '10px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <label style={{ fontSize: '24px' }}>
                Serial No.:
                <input
                  type="text"
                  value={exercise.serialNo}
                  onChange={(e) => handleWorkbookExerciseChange(index, 'serialNo', e.target.value)}
                  style={{ marginLeft: '10px', width: '100px', padding: '10px', fontSize: '20px', borderRadius: '5px', fontFamily: 'monospace' }}
                />
              </label>
              <label style={{ fontSize: '24px', marginLeft: '20px' }}>
                Question:
                <input
                  type="text"
                  value={exercise.question}
                  onChange={(e) => handleWorkbookExerciseChange(index, 'question', e.target.value)}
                  style={{ marginLeft: '10px', width: '300px', padding: '10px', fontSize: '20px', borderRadius: '5px', fontFamily: 'monospace' }}
                />
              </label>
              <label style={{ fontSize: '24px', marginLeft: '20px' }}>
                Answer:
                <textarea
                  value={exercise.answer}
                  onChange={(e) => handleWorkbookExerciseChange(index, 'answer', e.target.value)}
                  style={{ marginLeft: '10px', width: '300px', padding: '10px', fontSize: '20px', borderRadius: '5px', fontFamily: 'monospace' }}
                />
              </label>
              <button onClick={() => handleAddResource(index)} style={{ ...smallerButtonStyle, backgroundColor: 'blue', marginLeft: '10px' }}>
                Add Resource
              </button>
              {exercise.resources.map((resource, resourceIndex) => (
                <div key={resourceIndex} style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                  <label style={{ fontSize: '24px' }}>
                    Resource Type:
                    <select
                      value={resource.type}
                      onChange={(e) => handleResourceChange(index, resourceIndex, 'type', e.target.value)}
                      style={{ marginLeft: '10px', width: '150px', padding: '10px', fontSize: '20px', borderRadius: '5px', fontFamily: 'monospace' }}
                    >
                      <option value="">Select Type</option>
                      <option value="link">Link</option>
                      <option value="image">Image</option>
                    </select>
                  </label>
                  <label style={{ fontSize: '24px', marginLeft: '20px' }}>
                    Resource Link:
                    <input
                      type="text"
                      value={resource.link}
                      onChange={(e) => handleResourceChange(index, resourceIndex, 'link', e.target.value)}
                      style={{ marginLeft: '10px', width: '300px', padding: '10px', fontSize: '20px', borderRadius: '5px', fontFamily: 'monospace' }}
                    />
                  </label>
                </div>
              ))}
            </div>
          ))}
          <button onClick={handleAddWorkbookExercise} style={{ ...largerButtonStyle, backgroundColor: 'blue', marginTop: '20px' }}>
            Add Exercise
          </button>
        </div>
      )}
      {showForm && contentType === 'textbook' && selectedExercise === 'topics' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
          {textbookTopics.map((topic, index) => (
            <div key={index} style={{ marginBottom: '10px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <label style={{ fontSize: '24px' }}>
                Serial No.:
                <input
                  type="text"
                  value={topic.serialNo}
                  onChange={(e) => handleTextbookTopicChange(index, 'serialNo', e.target.value)}
                  style={{ marginLeft: '10px', width: '100px', padding: '10px', fontSize: '20px', borderRadius: '5px', fontFamily: 'monospace' }}
                />
              </label>
              <label style={{ fontSize: '24px', marginLeft: '20px' }}>
                Topic Title:
                <input
                  type="text"
                  value={topic.title}
                  onChange={(e) => handleTextbookTopicChange(index, 'title', e.target.value)}
                  style={{ marginLeft: '10px', width: '300px', padding: '10px', fontSize: '20px', borderRadius: '5px', fontFamily: 'monospace' }}
                />
              </label>
              <label style={{ fontSize: '24px', marginLeft: '20px' }}>
                Content:
                <textarea
                  value={topic.content}
                  onChange={(e) => handleTextbookTopicChange(index, 'content', e.target.value)}
                  style={{ marginLeft: '10px', width: '300px', padding: '10px', fontSize: '20px', borderRadius: '5px', fontFamily: 'monospace' }}
                />
              </label>
            </div>
          ))}
          <button onClick={handleAddTextbookTopic} style={{ ...largerButtonStyle, backgroundColor: 'blue', marginTop: '20px' }}>
            Add Topic
          </button>
        </div>
      )}
      {showForm && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
          <button onClick={handleSubmit} style={{ ...largerButtonStyle, backgroundColor: 'green', marginTop: '20px' }}>
            Submit All Data
          </button>
        </div>
      )}
    </div>
  );
};

export default Content;