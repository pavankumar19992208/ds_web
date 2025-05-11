import React, { useState, useContext, useRef, useEffect } from 'react';
import Navbar from '../../Navbar/Navbar';
import Sidebar from '../Sidebar';
import { GlobalStateContext } from '../../../../../../GlobalStateContext';
import './schoolStatistics.css';
import Chart from 'react-apexcharts';

const SchoolStatistics = () => {
  const { globalData } = useContext(GlobalStateContext);
  const [showAcademicYear, setShowAcademicYear] = useState(false);
  const [showAttendanceTable, setShowAttendanceTable] = useState(false);
  const [showClassPerformers, setShowClassPerformers] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [hoveredStudent, setHoveredStudent] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ top: 0, left: 0 });
  const attendanceTableRef = useRef(null);
  const classPerformersRef = useRef(null);
  const tableRowRefs = useRef({});

  useEffect(() => {
    if (showAttendanceTable && attendanceTableRef.current) {
      setTimeout(() => {
        attendanceTableRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 50);
    }
  }, [showAttendanceTable]);

  useEffect(() => {
    if (showClassPerformers && classPerformersRef.current) {
      setTimeout(() => {
        classPerformersRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 50);
    }
  }, [showClassPerformers]);

  const handleAttendanceMoreClick = () => {
    setShowAttendanceTable(!showAttendanceTable);
  };

  const handlePerformersMoreClick = () => {
    setShowClassPerformers(!showClassPerformers);
    if (!showClassPerformers) {
      setSelectedClass(''); // Reset class selection when opening
    }
  };

  const toggleAcademicYear = () => {
    setShowAcademicYear(!showAcademicYear);
  };

const [hoverTimeout, setHoverTimeout] = useState(null);

const handleRowHover = (student, index, event) => {
  if (hoverTimeout) clearTimeout(hoverTimeout);
  
  const rowElement = tableRowRefs.current[`row-${index}`] || 
                    tableRowRefs.current[`class-row-${index}`];
  
  if (rowElement) {
    const timeout = setTimeout(() => {
      const rect = rowElement.getBoundingClientRect();
      const cardWidth = 280;
      const windowWidth = window.innerWidth;
      
      let leftPosition = rect.left + rect.width + 20;
      if (leftPosition + cardWidth > windowWidth) {
        leftPosition = rect.left - cardWidth - 10;
      }

      setHoverPosition({
        top: rect.top + window.scrollY,
        left: leftPosition
      });
      setHoveredStudent(student);
    }, 100); // Small delay to prevent flickering
    
    setHoverTimeout(timeout);
  }
};

const handleRowLeave = () => {
  if (hoverTimeout) clearTimeout(hoverTimeout);
  setHoveredStudent(null);
};

  const [students] = useState(1200);
  const [teachers] = useState(85);
  const [genderData] = useState({
    boys: 45,
    girls: 55
  });

  // Sample data for top academic performers with additional profile info
  const [topPerformers] = useState([
    { 
      id: 1, 
      class: 10, 
      student_ID: '001', 
      name: 'John Doe', 
      grade: 'A+', 
      percentage: 98,
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      email: 'john.doe@school.edu',
      contact: '+1 234 567 8901',
      address: '123 Main St, Cityville'
    },
    { 
      id: 2, 
      class: 10, 
      student_ID: '002', 
      name: 'Jane Smith', 
      grade: 'A+', 
      percentage: 97,
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      email: 'jane.smith@school.edu',
      contact: '+1 234 567 8902',
      address: '456 Oak Ave, Townsville'
    },
    { 
      id: 3, 
      class: 10, 
      student_ID: '003', 
      name: 'Michael Johnson', 
      grade: 'A', 
      percentage: 95,
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      email: 'michael.j@school.edu',
      contact: '+1 234 567 8903',
      address: '789 Pine Rd, Villagetown'
    },
    { 
      id: 4, 
      class: 10, 
      student_ID: '004', 
      name: 'Emily Davis', 
      grade: 'A', 
      percentage: 94,
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      email: 'emily.d@school.edu',
      contact: '+1 234 567 8904',
      address: '321 Elm Blvd, Hamletville'
    },
    { 
      id: 5, 
      class: 10, 
      student_ID: '006', 
      name: 'Robert Wilson', 
      grade: 'A', 
      percentage: 93,
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      email: 'robert.w@school.edu',
      contact: '+1 234 567 8905',
      address: '654 Cedar Ln, Boroughburg'
    },
    { 
      id: 6, 
      class: 9, 
      student_ID: '003', 
      name: 'Sarah Thompson', 
      grade: 'A-', 
      percentage: 91,
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
      email: 'sarah.t@school.edu',
      contact: '+1 234 567 8906',
      address: '987 Birch Dr, Countyville'
    },
    { 
      id: 7, 
      class: 9, 
      student_ID: '002', 
      name: 'David Brown', 
      grade: 'A-', 
      percentage: 90,
      avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
      email: 'david.b@school.edu',
      contact: '+1 234 567 8907',
      address: '135 Maple Ct, Township'
    },
    { 
      id: 8, 
      class: 9, 
      student_ID: '001', 
      name: 'Jessica Lee', 
      grade: 'B+', 
      percentage: 89,
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
      email: 'jessica.l@school.edu',
      contact: '+1 234 567 8908',
      address: '246 Oakwood Ave, Villageburg'
    },
    { 
      id: 9, 
      class: 9, 
      student_ID: '009', 
      name: 'Daniel Martinez', 
      grade: 'B+', 
      percentage: 88,
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
      email: 'daniel.m@school.edu',
      contact: '+1 234 567 8909',
      address: '369 Pinehurst St, Citytown'
    },
    { 
      id: 10, 
      class: 8, 
      student_ID: '023', 
      name: 'Olivia Garcia', 
      grade: 'B', 
      percentage: 87,
      avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
      email: 'olivia.g@school.edu',
      contact: '+1 234 567 8910',
      address: '482 Elmwood Dr, Townburg'
    },
    { 
      id: 11, 
      class: 8, 
      student_ID: '034', 
      name: 'Jessica Lee', 
      grade: 'B+', 
      percentage: 89,
      avatar: 'https://randomuser.me/api/portraits/women/6.jpg',
      email: 'jessica.l2@school.edu',
      contact: '+1 234 567 8911',
      address: '591 Cedarwood Ave, Villageton'
    },
    { 
      id: 12, 
      class: 8, 
      student_ID: '012', 
      name: 'Daniel Martinez', 
      grade: 'B+', 
      percentage: 88,
      avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
      email: 'daniel.m2@school.edu',
      contact: '+1 234 567 8912',
      address: '624 Birchwood Ln, Cityburg'
    },
    { 
      id: 13, 
      class: 8, 
      student_ID: '029', 
      name: 'Olivia Garcia', 
      grade: 'B', 
      percentage: 87,
      avatar: 'https://randomuser.me/api/portraits/women/7.jpg',
      email: 'olivia.g2@school.edu',
      contact: '+1 234 567 8913',
      address: '753 Maplewood Rd, Townville'
    }
  ]);

  // Attendance table data
  const [attendanceData] = useState([
    { class: '10', gender1: 'Boys', percentage1: 88, gender2: 'Girls', percentage2: 90 },
    { class: '9', gender1: 'Boys', percentage1: 70, gender2: 'Girls', percentage2: 92 },
    { class: '8', gender1: 'Boys', percentage1: 76, gender2: 'Girls', percentage2: 79 },
    { class: '7', gender1: 'Boys', percentage1: 80, gender2: 'Girls', percentage2: 80 },
    { class: '6', gender1: 'Boys', percentage1: 90, gender2: 'Girls', percentage2: 92 },
    { class: '5', gender1: 'Boys', percentage1: 97, gender2: 'Girls', percentage2: 93 },
  ]);

  // Get unique classes from top performers
  const uniqueClasses = [...new Set(topPerformers.map(student => student.class))].sort((a, b) => b - a);

  // Filter performers by selected class
  const filteredPerformers = selectedClass 
    ? topPerformers.filter(student => student.class === parseInt(selectedClass))
    : topPerformers;

  // Radial Bar Chart for Gender Distribution
  const genderChart = {
    options: {
      chart: {
        height: 250,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: '50%',
          },
          dataLabels: {
            name: {
              fontSize: '16px',
              color: undefined,
            },
            value: {
              show: true,
              fontSize: '16px',
              fontWeight: '600',
              color: ['#3B82F6', '#EC4899'],
              formatter: (val) => `${val}%`,
            },
            total: {
              show: true,
              label: 'Boys',
              formatter: () => `${genderData.boys}%`,
              color: '#3B82F6',
            },
          },
          track: {
            background: '#f0f0f0',
          },
        },
      },
      labels: ['Boys', 'Girls'],
      colors: ['#3B82F6', '#EC4899'],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'horizontal',
          shadeIntensity: 0.5,
          gradientToColors: ['#1E40AF', '#DB2777'],
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100],
        },
      },
      stroke: {
        lineCap: 'round',
      },
    },
    series: [genderData.boys, genderData.girls],
  };

  // Attendance Chart Configuration
  const attendanceChart = {
    options: {
      chart: {
        height: 250,
        type: 'line',
        stacked: false,
        animations: {
          enabled: true,
          easing: 'linear',
          dynamicAnimation: {
            speed: 1000
          }
        },
        dropShadow: {
          enabled: true,
          opacity: 0.3,
          blur: 5,
          left: -7,
          top: 22
        },
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      grid: {
        padding: {
          left: 0,
          right: 0
        }
      },
      markers: {
        size: 0,
        hover: {
          size: 0
        }
      },
      xaxis: {
        categories: ['Month 1', 'Month 2', 'Month 3', 'Month 4']
      },
      yaxis: {
        min: 0,
        max: 100,
        tickAmount: 4,
        labels: {
          formatter: (val) => `${val}%`
        }
      },
      subtitle: {
        text: '88%',
        floating: true,
        align: 'right',
        offsetY: 0,
        style: {
          fontSize: '22px'
        }
      },
      colors: ['#3B82F6', '#EC4899'],
    },
    series: [
      {
        name: 'Boys Attendance',
        data: [92, 70, 88, 90]
      },
      {
        name: 'Girls Attendance',
        data: [50, 60, 82, 85]
      }
    ]
  };

  return (
    <div className='stats-dashboard'>
      <div className="stats-container">
        <Navbar
          schoolName={globalData.data.school_name}
          schoolLogo={globalData.data.school_logo}
          onStartNewAcademicYear={toggleAcademicYear}
        />
        <Sidebar
          visibleItems={['home', 'attachDocument', 'subjectAllocation', 'attendanceTracking', 'leaveApprovals', 'academicPerformance', 'schoolStatistics', 'teacherAlert', 'eventPlanning', 'careerGuidance', 'inventoryManagement']}
          showTitle={true}
          selectedItem="home"
        />
        <div className='stats-main-content'>
          <h1 className='stats-title'>School Statistics</h1>
          <div className='stats-grid'>
            {/* First main column */}
            <div className='stats-main-column'>
              {/* First row - Student and Teacher counts */}
              <div className="stats-row">
                <div className="stats-cards-container">
                  <div className="stats-card">
                    <h3>Total Students</h3>
                    <p>{students}</p>
                  </div>
                  <div className="stats-card">
                    <h3>Total Teachers</h3>
                    <p>{teachers}</p>
                  </div>
                </div>
              </div>

              {/* Second row - Charts in 2 columns */}
              <div className="stats-row">
                <div className="stats-charts-container">
                  <div className="gender-chart-container">
                    <h3>Gender Distribution</h3>
                    <Chart
                      options={genderChart.options}
                      series={genderChart.series}
                      type="radialBar"
                      height={250}
                    />
                  </div>
                  <div className="attendance-chart-container">
                    <div className="attendance-chart-header">
                      <h3>Attendance Percentage</h3>
                      <button 
                        className="more-button"
                        onClick={handleAttendanceMoreClick}
                      >
                        More <span className={`arrow ${showAttendanceTable ? 'up' : 'down'}`}>▼</span>
                      </button>
                    </div>
                    <Chart
                      options={attendanceChart.options}
                      series={attendanceChart.series}
                      type="line"
                      height={220}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Second main column - Top Academic Performers */}
            <div className='top-performers-column'>
              <div className="top-performers-container">
                <div className="attendance-chart-header">
                  <h2>Top Academic Performers</h2>
                  <button 
                    className="more-button"
                    onClick={handlePerformersMoreClick}
                  >
                    More <span className={`arrow ${showClassPerformers ? 'up' : 'down'}`}>▼</span>
                  </button>
                </div>    
                <div className="performers-table-container">
                  <table className="performers-table">
                    <thead className="table-header">
                      <tr>
                        <th>Rank</th>
                        <th>Class</th>
                        <th>Student ID</th>
                        <th>Name</th>
                        <th>Grade</th>
                        <th>Percentage</th>
                      </tr>
                    </thead>
                    <tbody className="table-body">
{topPerformers.slice(0, 7).map((student, index) => (
  <tr 
    key={student.id}
    ref={el => tableRowRefs.current[`row-${index}`] = el}
    onMouseEnter={(e) => handleRowHover(student, index, e)}
    onMouseLeave={handleRowLeave}
  >
                          <td>{index + 1}</td>
                          <td>{student.class}</td>
                          <td>{student.student_ID}</td>
                          <td>{student.name}</td>
                          <td>{student.grade}</td>
                          <td>{student.percentage}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Student Profile Card */}
{hoveredStudent && (
  <div className="student-profile-card">
    <div className="profile-header">
      <img src={hoveredStudent.avatar} alt={hoveredStudent.name} className="profile-avatar" />
      <div className="profile-name">{hoveredStudent.name}</div>
      <div className="profile-class">Class {hoveredStudent.class}</div>
    </div>
    <div className="profile-details">
      <div className="profile-detail">
        <span className="detail-label">Student ID:</span>
        <span className="detail-value">{hoveredStudent.student_ID}</span>
      </div>
      <div className="profile-detail">
        <span className="detail-label">Grade:</span>
        <span className="detail-value">{hoveredStudent.grade}</span>
      </div>
      <div className="profile-detail">
        <span className="detail-label">Percentage:</span>
        <span className="detail-value">{hoveredStudent.percentage}%</span>
      </div>
      <div className="profile-detail">
        <span className="detail-label">Email:</span>
        <span className="detail-value">{hoveredStudent.email}</span>
      </div>
      <div className="profile-detail">
        <span className="detail-label">Contact:</span>
        <span className="detail-value">{hoveredStudent.contact}</span>
      </div>
      <div className="profile-detail">
        <span className="detail-label">Address:</span>
        <span className="detail-value">{hoveredStudent.address}</span>
      </div>
    </div>
  </div>
)}

          {/* Attendance details table */}
          {showAttendanceTable && (
            <div className="attendance-table-container attendance-table-shown" ref={attendanceTableRef}>
              <h3>Attendance percentage (overall / per class)</h3>
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Class</th>
                    <th>Gender</th>
                    <th>Percentage</th>
                    <th>Gender</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.class}</td>
                      <td>{item.gender1}</td>
                      <td>{item.percentage1}%</td>
                      <td>{item.gender2}</td>
                      <td>{item.percentage2}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Class-wise performers table */}
          {showClassPerformers && (
            <div className="class-performers-container" ref={classPerformersRef}>
              <div className="class-selector-container">
                <h3>Class-wise Academic Performers</h3>
                <div className="class-selector">
                  <label htmlFor="class-select">Select Class:</label>
                  <select
                    id="class-select"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    <option value="">All Classes</option>
                    {uniqueClasses.map(classNum => (
                      <option key={classNum} value={classNum}>Class {classNum}</option>
                    ))}
                  </select>
                </div>
              </div>
              <table className="performers-table">
                <thead className="table-header">
                  <tr>
                    <th>Rank</th>
                    <th>Class</th>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Grade</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody className="table-body">
{filteredPerformers.map((student, index) => (
  <tr 
    key={student.id}
    ref={el => tableRowRefs.current[`class-row-${index}`] = el}
    onMouseEnter={(e) => handleRowHover(student, index, e)}
    onMouseLeave={handleRowLeave}
  >
                      <td>{index + 1}</td>
                      <td>{student.class}</td>
                      <td>{student.student_ID}</td>
                      <td>{student.name}</td>
                      <td>{student.grade}</td>
                      <td>{student.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Holidays section */}
          <div className={`holidays-container ${showAttendanceTable || showClassPerformers ? 'with-table' : ''}`}>
            <h2>Holidays</h2>
            <div className='holidays-boxes'>
              <div className='holiday-box today-holiday'>
                <div className='holiday-label'>Today's Holiday</div>
                <div className='holiday-date'>October 24, 2023</div>
                <div className='holiday-occasion'>Diwali Festival</div>
              </div>
              <div className='holiday-box'>
                <div className='holiday-label'>Upcoming</div>
                <div className='holiday-date'>December 25, 2023</div>
                <div className='holiday-occasion'>Christmas Day</div>
              </div>
              <div className='holiday-box'>
                <div className='holiday-label'>Upcoming</div>
                <div className='holiday-date'>January 1, 2024</div>
                <div className='holiday-occasion'>New Year's Day</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolStatistics;