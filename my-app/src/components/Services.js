import React, { useState } from 'react';
import StudentServices from './Services/StudentServices';
import TeacherServices from './Services/TeacherServices';
import AdministrationServices from './Services/AdministrationServices';

function Services() {
  const [selectedTab, setSelectedTab] = useState('STUDENT SERVICES');

  return (
    <div>
<div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
  <button style={{ backgroundColor: selectedTab === 'STUDENT SERVICES' ? '#5DFFFF3F' : 'transparent', padding: '10px', border: selectedTab === 'STUDENT SERVICES' ? '1px solid #04264229' : '1px solid transparent', borderBottom: 'none', borderRadius: '20px 20px 0 0', fontFamily: "'Tektur', cursive",fontWeight:'bold'}} onClick={() => setSelectedTab('STUDENT SERVICES')}>STUDENT SERVICES</button>
  <button style={{ backgroundColor: selectedTab === 'TEACHER SERVICES' ? '#FFA2FF30' : 'transparent', padding: '10px', border: selectedTab === 'TEACHER SERVICES' ? '1px solid #04264229' : '1px solid transparent', borderBottom: 'none', borderRadius: '20px 20px 0 0', fontFamily: "'Tektur', cursive",fontWeight:'bold' }} onClick={() => setSelectedTab('TEACHER SERVICES')}>TEACHER SERVICES</button>
  <button style={{ backgroundColor: selectedTab === 'ADMINISTRATION SERVICES' ? '#35C2FF34' : 'transparent', padding: '10px', border: selectedTab === 'ADMINISTRATION SERVICES' ? '1px solid #04264229' : '1px solid transparent', borderBottom: 'none', borderRadius: '20px 20px 0 0', fontFamily: "'Tektur', cursive",fontWeight:'bold' }} onClick={() => setSelectedTab('ADMINISTRATION SERVICES')}>ADMINISTRATION SERVICES</button>
</div>

      {selectedTab === 'STUDENT SERVICES' && <StudentServices style={{ borderTop: 'none', border: '1px solid #04264229',backgroundColor: '#5DFFFF3A', borderRadius: ' 30px' }} />}
      {selectedTab === 'TEACHER SERVICES' && <TeacherServices style={{ borderTop: 'none', border: '1px solid #04264229',backgroundColor: '#FFA2FF33', borderRadius: ' 30px' }} />}
      {selectedTab === 'ADMINISTRATION SERVICES' && <AdministrationServices style={{ borderTop: 'none', border: '1px solid #04264229',backgroundColor: '#35C2FF42', borderRadius: ' 30px' }} />}
    </div>
  );
}

export default Services;