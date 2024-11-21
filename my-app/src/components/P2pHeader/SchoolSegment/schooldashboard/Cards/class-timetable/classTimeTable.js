import React, {useState, useContext} from 'react';
import { GlobalStateContext } from "../../../../../../GlobalStateContext";
import Sidebar from '../../Sidebar/Sidebar';
import Navbar from '../../Navbar/Navbar';
import './classTimeTable.css';

const ClassTimeTable = () => {
    const { globalData } = useContext(GlobalStateContext);
    const [selectedClass, setSelectedClass] = useState('');
    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const classes = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5","Class 6", "Class 7", "Class 8", "Class 9", "Class 10"]; // Example classes
    const subjects = ["Math", "Science", "English", "History", "Geography", "Art", "Physical Education","Lunch"]; // Example subjects

    const handleClassChange = (event) => {
      setSelectedClass(event.target.value);
    };

    return (
        <div>
            <Navbar
                schoolName={globalData.data.SCHOOL_NAME}
                schoolLogo={globalData.data.SCHOOL_LOGO}
            />
            <div className="layout">
                <Sidebar
                    visibleItems={["home", "updateEnrollment"]}
                    hideProfile={true}
                    showTitle={false}
                />
                <div className="table-container">
                <div className="header-container">
                        <h1>Class Timetable</h1>
                        <button className="generate-button">Generate Timetable</button>
                    </div>
                    <table className="timetable">
                        <thead>
                            <tr>
                                <th rowSpan="2">
                                    <select className="class-dropdown" value={selectedClass} onChange={handleClassChange}>
                                        <option value="">Select Class</option>
                                        {classes.map((cls, index) => (
                                            <option key={index} value={cls}>{cls}</option>
                                        ))}
                                    </select>
                                </th>
                                {Array.from({ length: 7 }).map((_, index) => (
                                    <th key={index}>Period {index + 1}</th>
                                ))}
                            </tr>
                            <tr>
                                
                                {Array.from({ length: 7 }).map((_, index) => (
                                    <th key={index}>
                                        <input type="time" placeholder="From" />
                                        <input type="time" placeholder="To" />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {weekdays.map((day, rowIndex) => (
                                <tr key={rowIndex}>
                                    {Array.from({ length: 8 }).map((_, colIndex) => (
                                        <td key={colIndex}>
                                            {colIndex === 0 ? day : (
                                                <select className="subject-dropdown">
                                                    <option value="">Select Subject</option>
                                                    {subjects.map((subject, index) => (
                                                        <option key={index} value={subject}>{subject}</option>
                                                    ))}
                                                </select>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ClassTimeTable;