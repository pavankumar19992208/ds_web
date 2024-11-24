import React, { useState, useContext } from 'react';
import { GlobalStateContext } from "../../../../../../GlobalStateContext";
import Sidebar from '../../Sidebar/Sidebar';
import Navbar from '../../Navbar/Navbar';
import './classTimeTable.css';

const ClassTimeTable = () => {
    const { globalData } = useContext(GlobalStateContext);
    const [selectedClass, setSelectedClass] = useState('');
    const [timetable, setTimetable] = useState({});
    const [defaultTimes, setDefaultTimes] = useState({});

    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const classes = ["Class 1A", "Class 1B", "Class 2A", "Class 2B", "Class 3A", "Class 3B", "Class 4A", "Class 4B", "Class 5A", "Class 5B", "Class 6A", "Class 6B", "Class 7A", "Class 7B", "Class 8A", "Class 8B", "Class 9A", "Class 9B", "Class 10A", "Class 10B"];
    const subjects = [
        { name: "Math", teacher: "Mr. Smith" },
        { name: "Math", teacher: "Mr. John" },
        { name: "Science", teacher: "Ms. Johnson" },
        { name: "Science", teacher: "Ms. Rock" },
        { name: "English", teacher: "Mrs. Brown" },
        { name: "English", teacher: "Mrs. Lucy" },
        { name: "History", teacher: "Mr. Davis" },
        { name: "History", teacher: "Mr. Jarvis" },
        { name: "Geography", teacher: "Ms. Miller" },
        { name: "Geography", teacher: "Ms. Killer" },
        { name: "Art", teacher: "Mr. Wilson" },
        { name: "Art", teacher: "Mr. Milton" },
        { name: "Physical Education", teacher: "Ms. Moore" },
        { name: "Physical Education", teacher: "Ms. Toore" },
        { name: "Lunch" }
    ];

    const handleClassChange = (event) => {
        const selectedClass = event.target.value;
        setSelectedClass(selectedClass);
        setTimetable(prevTimetable => ({
            ...prevTimetable,
            [selectedClass]: prevTimetable[selectedClass] || {} // Set the timetable for the selected class if it exists, otherwise initialize it
        }));
    };

    const handleTimetableChange = (day, period, field, value) => {
        setTimetable(prevTimetable => ({
            ...prevTimetable,
            [selectedClass]: {
                ...prevTimetable[selectedClass],
                [day]: {
                    ...prevTimetable[selectedClass]?.[day],
                    [`period ${period}`]: {
                        ...prevTimetable[selectedClass]?.[day]?.[`period ${period}`],
                        [field]: value
                    }
                }
            }
        }));
    };

    const handleTimeChange = (period, field, value) => {
        setDefaultTimes(prevDefaultTimes => ({
            ...prevDefaultTimes,
            [`period ${period}`]: {
                ...prevDefaultTimes[`period ${period}`],
                [field]: value
            }
        }));

        setTimetable(prevTimetable => {
            const updatedTimetable = { ...prevTimetable };
            classes.forEach(cls => {
                weekdays.forEach(weekday => {
                    updatedTimetable[cls] = updatedTimetable[cls] || {};
                    updatedTimetable[cls][weekday] = updatedTimetable[cls][weekday] || {};
                    updatedTimetable[cls][weekday][`period ${period}`] = updatedTimetable[cls][weekday][`period ${period}`] || {};
                    updatedTimetable[cls][weekday][`period ${period}`][field] = value;
                });
            });
            return updatedTimetable;
        });
    };

    const handleSubjectChange = (day, period, value) => {
        const selectedSubject = subjects.find(subject => subject.name === value);
        handleTimetableChange(day, period, 'subject', selectedSubject.name);
        handleTimetableChange(day, period, 'teacher', selectedSubject.teacher);
    };

    const handleUpdate = () => {
        const selectedClassTimetable = timetable[selectedClass] || {};

        weekdays.forEach(day => {
            selectedClassTimetable[day] = selectedClassTimetable[day] || {};
            Array.from({ length: 7 }).forEach((_, period) => {
                selectedClassTimetable[day][`period ${period + 1}`] = selectedClassTimetable[day][`period ${period + 1}`] || {};
                selectedClassTimetable[day][`period ${period + 1}`]['from'] = timetable[selectedClass]?.[day]?.[`period ${period + 1}`]?.from || defaultTimes[`period ${period + 1}`]?.from || '';
                selectedClassTimetable[day][`period ${period + 1}`]['to'] = timetable[selectedClass]?.[day]?.[`period ${period + 1}`]?.to || defaultTimes[`period ${period + 1}`]?.to || '';
            });
        });

        const payload = {
            SchoolId: globalData.data.SCHOOL_ID,
            Timetable: {
                [selectedClass]: selectedClassTimetable
            }
        };
        console.log('Payload to be sent:', payload);
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
                                        <input type="time" placeholder="From" onChange={(e) => handleTimeChange(index + 1, 'from', e.target.value)} />
                                        <input type="time" placeholder="To" onChange={(e) => handleTimeChange(index + 1, 'to', e.target.value)} />
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
                                                <select className="subject-dropdown" onChange={(e) => handleSubjectChange(day, colIndex, e.target.value)} value={timetable[selectedClass]?.[day]?.[`period ${colIndex}`]?.subject || ''}>
                                                    <option value="">Select Subject</option>
                                                    {subjects.map((subject, index) => (
                                                        <option key={index} value={subject.name}>
                                                            {subject.name} - {subject.teacher}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className="update-button" onClick={handleUpdate}>Update Timetable</button>
                </div>
            </div>
        </div>
    );
};

export default ClassTimeTable;