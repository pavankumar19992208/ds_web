import React from 'react';
import { useNavigate } from 'react-router-dom';
import './cards.css';

const Cards = ({ studentCount, teacherCount }) => {
  const navigate = useNavigate();

  const handleStudentEnrollClick = () => {
    navigate('/student-enroll');
  };

  const handleTeacherEnrollClick = () => {
    navigate('/teacher-enroll');
  };

  const handleFeeDue = () => {
    navigate('/fee-due');
  };

  return (
    <div className="cards-container">
      <div className="card">
        <h2>Enrolled Students</h2>
        <p className="count">{Math.floor(studentCount)}</p>
        <div className="button-group">
          <button id='enroll-btn' onClick={handleStudentEnrollClick}>Enroll</button>
          <button>Details</button>
        </div>
      </div>
      <div className="card">
        <h2>Enrolled Teachers</h2>
        <p className="count">{Math.floor(teacherCount)}</p>
        <div className="button-group">
          <button id='enroll-btn' onClick={handleTeacherEnrollClick}>Enroll</button>
          <button>Details</button>
        </div>
      </div>
      <div className="card">
        <h2>Outstanding Student Fees</h2>
        <div className="button-group">
          <button id='enroll-btn' onClick={handleFeeDue}>Details</button>
        </div>
      </div>
      <div className="card">
        <h2>Teacher Payroll</h2>
        <div className="button-group">
          <button id='enroll-btn' onClick={handleFeeDue}>Details</button>
        </div>
      </div>
      <div className="card">
        <h2>Student Fee Payment / Status</h2>
        <div className="button-group">
          <button id='enroll-btn'>Collect Fee</button>
          <button>Dues</button>
        </div>
      </div>
      <div className="card">
        <h2>Class Timetables</h2>
        <div className="button-group">
          <button id='enroll-btn' onClick={handleFeeDue}>View</button>
        </div>
      </div>
    </div>
  );
};

export default Cards;