import React, { useState, useRef } from 'react';
import StudentServices from './Services/StudentServices';
import TeacherServices from './Services/TeacherServices';
import AdministrationServices from './Services/AdministrationServices';

function Services() {
  const [selectedTab, setSelectedTab] = useState('STUDENT SERVICES');
  const buttonsRef = useRef(null); // Create a ref for the buttons container

  const handleButtonClick = (serviceType) => {
    setSelectedTab(serviceType);
    // Scroll the buttons into view
    if (buttonsRef.current) {
      buttonsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <button  style={{ backgroundColor: selectedTab === 'STUDENT SERVICES' ? '#5DFFFF3F' : 'transparent', padding: '10px', border: selectedTab === 'STUDENT SERVICES' ? '1px solid #04264229' : '1px solid transparent', borderRadius: '20px', fontFamily: "'Tektur', cursive",fontWeight:'bold'}} onClick={() => handleButtonClick('STUDENT SERVICES')}>STUDENT SERVICES</button>
        <button ref={buttonsRef} style={{ backgroundColor: selectedTab === 'TEACHER SERVICES' ? '#FFA2FF30' : 'transparent', padding: '10px', border: selectedTab === 'TEACHER SERVICES' ? '1px solid #04264229' : '1px solid transparent',  borderRadius: '20px ', fontFamily: "'Tektur', cursive",fontWeight:'bold' }} onClick={() => handleButtonClick('TEACHER SERVICES')}>TEACHER SERVICES</button>
        <button ref={buttonsRef}style={{ backgroundColor: selectedTab === 'ADMINISTRATION SERVICES' ? '#35C2FF34' : 'transparent', padding: '10px', border: selectedTab === 'ADMINISTRATION SERVICES' ? '1px solid #04264229' : '1px solid transparent', borderRadius: '20px', fontFamily: "'Tektur', cursive",fontWeight:'bold' }} onClick={() => handleButtonClick('ADMINISTRATION SERVICES')}>ADMINISTRATION SERVICES</button>
      </div>

      {selectedTab === 'STUDENT SERVICES' && <StudentServices/>}
      {selectedTab === 'TEACHER SERVICES' && <TeacherServices  />}
      {selectedTab === 'ADMINISTRATION SERVICES' && <AdministrationServices  />}
    </div>
  );
}

export default Services;