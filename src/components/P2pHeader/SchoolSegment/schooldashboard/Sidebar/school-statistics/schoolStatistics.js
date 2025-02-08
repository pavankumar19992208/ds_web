import React, { useState, useContext } from 'react';
import Navbar from '../../Navbar/Navbar';
import Sidebar from '../Sidebar';
import { GlobalStateContext } from '../../../../../../GlobalStateContext';
import './schoolStatistics.css';
import Chart from 'react-apexcharts';

const SchoolStatistics = () => {
  const { globalData } = useContext(GlobalStateContext);
  const [showAcademicYear, setShowAcademicYear] = useState(false);
  const toggleAcademicYear = () => {
    setShowAcademicYear(!showAcademicYear);
  };

  const [students] = useState(1200);
  const [teachers] = useState(85);
  const [genderData] = useState({
    boys: 45,
    girls: 55
  });

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
            size: '50%', // Adjust the size of the hollow circle
          },
          dataLabels: {
            name: {
              fontSize: '16px',
              color: undefined, // Blue for boys, Pink for girls
            },
            value: {
              show: true,
              fontSize: '16px',
              fontWeight: '600',
              color: ['#3B82F6', '#EC4899'], // Blue for boys, Pink for girls
              formatter: (val) => `${val}%`, // Display percentage
            },
            total: {
              show: true,
              label: 'Boys',
              formatter: () => `${genderData.boys}%`, // Display boys percentage
              color: '#3B82F6', // Blue for boys
            },
          },
          track: {
            background: '#f0f0f0', // Background color of the track
          },
        },
      },
      labels: ['Boys', 'Girls'],
      colors: ['#3B82F6', '#EC4899'], // Blue for boys, Pink for girls
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'horizontal',
          shadeIntensity: 0.5,
          gradientToColors: ['#1E40AF', '#DB2777'], // Gradient colors for boys and girls
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100],
        },
      },
      stroke: {
        lineCap: 'round', // Rounded edges for the bars
      },
    },
    series: [genderData.boys, genderData.girls],
  };

  // Attendance Chart Configuration
  const attendanceChart = {
    options: {
      chart: {
        height: 200,
        type: 'line',
        stacked: false, // Set to false to display lines separately
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
        categories: ['Month 1', 'Month 2', 'Month 3']
      },
      yaxis: {
        min: 0,
        max: 100,
        tickAmount: 4,
        labels: {
          formatter: (val) => `${val}%`
        }
      },
      title: {
        text: 'Attendance Percentage',
        align: 'left',
        style: {
          fontSize: '12px'
        }
      },
      subtitle: {
        text: '88%', // Latest attendance percentage
        floating: true,
        align: 'right',
        offsetY: 0,
        style: {
          fontSize: '22px'
        }
      },
      legend: {
        show: true,
        floating: true,
        horizontalAlign: 'left',
        onItemClick: {
          toggleDataSeries: false
        },
        position: 'top',
        offsetY: -33,
        offsetX: 200
      },
      colors: ['#3B82F6', '#EC4899'], // Blue for boys, Pink for girls
    },
    series: [
      {
        name: 'Boys Attendance',
        data: [92, 70, 88, 90] // Example data for boys' attendance
      },
      {
        name: 'Girls Attendance',
        data: [50, 60, 82, 85] // Example data for girls' attendance
      }
    ]
  };

  return (
    <div className='stats-dashboard'>
      <div className="stats-container">
        <Navbar
          schoolName={globalData.data.SCHOOL_NAME}
          schoolLogo={globalData.data.SCHOOL_LOGO}
          onStartNewAcademicYear={toggleAcademicYear}
        />
        <Sidebar
          visibleItems={['home', 'attachDocument', 'subjectAllocation', 'attendanceTracking', 'leaveApprovals', 'academicPerformance', 'schoolStatistics', 'teacherAlert', 'eventPlanning', 'careerGuidance', 'inventoryManagement']}
          showTitle={true}
          selectedItem="home"
        />
        <div className='stats-content' style={{ width: '100%' }}>
          <h1 className='stats-title'>School Statistics</h1>
          <div className='stats-grid'>
            <div className='stats-grid-one'>
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
                <div className="gender-chart-container" style={{ width: '40%', height: '255px' }}>
                    <Chart
                      style={{ justifyContent: 'center', alignItems: 'center' }}
                      options={genderChart.options}
                      series={genderChart.series}
                      type="radialBar"
                    />
                </div>
              </div>
            <div className='stats-grid-two'>
              <div className="attendance-chart-container" >
                <Chart
                  options={attendanceChart.options}
                  series={attendanceChart.series}
                  type="line"
                />
              </div>
            </div>
          </div>         
        </div>
      </div>
    </div>
  );
};

export default SchoolStatistics;