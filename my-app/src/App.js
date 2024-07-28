import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import P2pHeader from './components/P2pHeader/P2pHeader';
import WelcomeBoard from './components/WelcomeBoard/WelcomeBoard'
import SchoolLogin from './components/P2pHeader/SchoolSegment/SchoolLogin';
import SchoolRegistration from './components/P2pHeader/SchoolRegistration';
import SchoolDashboard from './components/P2pHeader/SchoolSegment/SchoolDashbord';
import StudentRegistration from './components/P2pHeader/SchoolSegment/Registrations/StudentRegistration';
import TeacherRegistration from './components/P2pHeader/SchoolSegment/Registrations/TeacherRegistration';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<WelcomeBoard  />} />
          <Route path="/p2pheader" element={<P2pHeader />} />
          <Route path="/schlogin" element={<SchoolLogin />} />
          <Route path="/register-school" element={<SchoolRegistration />} />
          <Route path="/school_dashboard" element={<SchoolDashboard />} />
          <Route path="/student_registration" element={<StudentRegistration />} />
          <Route path="/teacher_registration" element={<TeacherRegistration />} />
        </Routes>
    </Router>
  );
}

export default App;