import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GlobalStateProvider } from './GlobalStateContext';
import P2pHeader from './components/P2pHeader/P2pHeader';
import WelcomeBoard from './components/WelcomeBoard/WelcomeBoard';
import SchoolLogin from './components/P2pHeader/SchoolSegment/SchoolLogin';
import SchoolRegistration from './components/P2pHeader/SchoolRegistration';
import SchoolDashboard from './components/P2pHeader/SchoolSegment/schooldashboard/Homepage/SchoolDashboard';
import TeacherEnrollForm from './components/P2pHeader/SchoolSegment/schooldashboard/Cards/teacher-enroll-form/teacherEnrollForm';
import StudentEnrollForm from './components/P2pHeader/SchoolSegment/schooldashboard/Cards/student-enroll-form/primaryForm';
import DetailsForm from './components/P2pHeader/SchoolSegment/schooldashboard/Cards/teacher-enroll-form/detailsForm';
import QualificationForm from './components/P2pHeader/SchoolSegment/schooldashboard/Cards/teacher-enroll-form/qualificationForm';
import AttachDocument from './components/P2pHeader/SchoolSegment/schooldashboard/Sidebar/attach-document/attachDocument';
import SchoolInternalData from './components/P2pHeader/SchoolSegment/schooldashboard/Cards/school-internal-data/schoolInternalData';

function App() {
  return (
    <GlobalStateProvider>
      <Router>
        <Routes>
          <Route path="/" element={<WelcomeBoard />} />
          <Route path="/p2pheader" element={<P2pHeader />} />
          <Route path="/schlogin" element={<SchoolLogin />} />
          <Route path="/register-school" element={<SchoolRegistration />} />
          <Route path="/school_dashboard" element={<SchoolDashboard />} />
          <Route path="/teacher-enroll" element={<TeacherEnrollForm />} />
          <Route path="/student-enroll" element={<StudentEnrollForm />} />
          <Route path="/enroll/details" element={<DetailsForm />} />
          <Route path="/enroll/qualification" element={<QualificationForm />} />
          <Route path="/attach-document" element={<AttachDocument />} />
          <Route path="/school-internal-data" element={<SchoolInternalData />} />
        </Routes>
      </Router>
    </GlobalStateProvider>
  );
}

export default App;