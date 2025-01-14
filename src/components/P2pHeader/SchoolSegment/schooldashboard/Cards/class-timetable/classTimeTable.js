import React, { useState, useContext, useEffect } from 'react';
import { GlobalStateContext } from "../../../../../../GlobalStateContext";
import Sidebar from '../../Sidebar/Sidebar';
import Navbar from '../../Navbar/Navbar';
import './classTimeTable.css';
import BaseUrl from '../../../../../../config';
import HashLoader from 'react-spinners/HashLoader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

const ClassTimeTable = () => {
    const { globalData } = useContext(GlobalStateContext);
    const [selectedClass, setSelectedClass] = useState('');
    const [timetable, setTimetable] = useState({});
    const [defaultTimes, setDefaultTimes] = useState({});
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [periods, setPeriods] = useState(7);
    const [classes, setClasses] = useState([]);
    const [subjectsTeachers, setSubjectsTeachers] = useState([]);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await fetch(`${BaseUrl}/classes`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ SchoolId: globalData.data.SCHOOL_ID }),
                });

                if (!response.ok) {
                    const text = await response.text();
                    console.error('Error fetching classes:', text);
                    throw new Error('Failed to fetch classes');
                }

                const data = await response.json();
                const uniqueClasses = [...new Set(data.classes || [])];
                setClasses(uniqueClasses);
            } catch (error) {
                console.error('Error fetching classes:', error);
            }
        };

        fetchClasses();
    }, [globalData.data.SCHOOL_ID]);

        useEffect(() => {
        const fetchSubjectsTeachers = async () => {
            if (selectedClass) {
                try {
                    const response = await fetch(`${BaseUrl}/class-subjects-teachers`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ SchoolId: globalData.data.SCHOOL_ID, Class: selectedClass }),
                    });
    
                    if (!response.ok) {
                        const text = await response.text();
                        console.error('Error fetching subjects and teachers:', text);
                        throw new Error('Failed to fetch subjects and teachers');
                    }
    
                    const data = await response.json();
                    setSubjectsTeachers(data.subjects_teachers);
                } catch (error) {
                    console.error('Error fetching subjects and teachers:', error);
                }
            }
        };
    
        fetchSubjectsTeachers();
    }, [selectedClass, globalData.data.SCHOOL_ID]);

    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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
        const selectedSubject = subjectsTeachers.find(subject => subject.subject === value);
        handleTimetableChange(day, period, 'subject', selectedSubject.subject);
        handleTimetableChange(day, period, 'teacher', selectedSubject.teacher);
    };

    const handleUpdate = async () => {
        setLoading(true);
        const selectedClassTimetable = timetable[selectedClass] || {};

        const formattedTimetable = weekdays.reduce((acc, day) => {
            acc[day] = {
                periods: Array.from({ length: periods }).reduce((periodAcc, _, period) => {
                    const periodKey = `period ${period + 1}`;
                    periodAcc[periodKey] = {
                        from_time: selectedClassTimetable[day]?.[periodKey]?.from || defaultTimes[periodKey]?.from || '',
                        to_time: selectedClassTimetable[day]?.[periodKey]?.to || defaultTimes[periodKey]?.to || '',
                        subject: selectedClassTimetable[day]?.[periodKey]?.subject || '',
                        teacher: selectedClassTimetable[day]?.[periodKey]?.teacher || ''
                    };
                    return periodAcc;
                }, {})
            };
            return acc;
        }, {});

        const payload = {
            SchoolId: globalData.data.SCHOOL_ID,
            class_name: selectedClass,
            ...formattedTimetable
        };
        console.log('Payload to be sent:', payload);

        try {
            const response = await fetch(`${BaseUrl}/classtimetable`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Form submission failed');
            }

            const data = await response.json();
            console.log('Form data sent to backend successfully:', data);
            setMessage('Class timetable sent to backend successfully.');
        } catch (error) {
            console.error('Error:', error);
            setMessage('Failed to send class timetable to backend.');
        } finally {
            setLoading(false);
        }
    };

    const addPeriod = () => {
        setPeriods(prevPeriods => prevPeriods + 1);
    };

    const deletePeriod = (index) => {
        if (periods > 1) {
            setPeriods(prevPeriods => prevPeriods - 1);
            setTimetable(prevTimetable => {
                const updatedTimetable = { ...prevTimetable };
                classes.forEach(cls => {
                    weekdays.forEach(weekday => {
                        if (updatedTimetable[cls] && updatedTimetable[cls][weekday]) {
                            delete updatedTimetable[cls][weekday][`period ${index + 1}`];
                        }
                    });
                });
                return updatedTimetable;
            });
        }
    };

    return (
        <div>
            <Navbar
                schoolName={globalData.data.SCHOOL_NAME}
                schoolLogo={globalData.data.SCHOOL_LOGO}
            />
            <div className="layout">
                <Sidebar
                    visibleItems={["home"]}
                    hideProfile={true}
                    showTitle={false}
                />
                <div className="table-container">
                    <div className="header-container">
                        <h1>Class Timetable</h1>
                        <button className="generate-button">Generate Timetable</button>
                    </div>
                    <p style={{ color: 'red', marginTop: '10px' }}>
                       You can update or submit Timetable for only one class at a time.
                    </p>
                     <div className="table-wrapper">
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
                            {Array.from({ length: periods }).map((_, index) => (
                              <th key={index} className="column-header">
                                Period {index + 1}
                                <div className="icon-container">
                                  <FontAwesomeIcon icon={faPlus} className="icon" onClick={addPeriod} />
                                  <FontAwesomeIcon icon={faTrash} className="icon" onClick={() => deletePeriod(index)} />
                                </div>
                              </th>
                            ))}
                          </tr>
                          <tr>
                            {Array.from({ length: periods }).map((_, index) => (
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
                              {Array.from({ length: periods + 1 }).map((_, colIndex) => (
                                <td key={colIndex}>
                                  {colIndex === 0 ? day : (
                                    <select className="subject-dropdown" onChange={(e) => handleSubjectChange(day, colIndex, e.target.value)} value={timetable[selectedClass]?.[day]?.[`period ${colIndex}`]?.subject || ''}>
                                      <option value="">Select Subject</option>
                                      {subjectsTeachers.map((subject, index) => (
                                        <option key={index} value={subject.subject}>
                                          {subject.subject} - {subject.teacher}
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
                    </div>
                    <button className="update-button" onClick={handleUpdate}>Update Timetable</button>
                    {message && <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>}
                    {loading && (
                        <div className="loaderContainer">
                            <HashLoader color="#ffffff" size={50} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClassTimeTable;