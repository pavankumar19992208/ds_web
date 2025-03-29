import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GlobalStateProvider } from './GlobalStateContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import P2pHeader from './components/P2pHeader/P2pHeader.jsx';
import WelcomeBoard from './components/WelcomeBoard/WelcomeBoard.jsx';
// import SchoolLogin from './components/P2pHeader/SchoolSegment/SchoolLogin';
import SchoolRegistration from './components/popups/SchoolRegistration.jsx';
import SchoolLogin from './components/popups/LoginPopup.jsx';
import SchoolDashboard from './components/P2pHeader/SchoolSegment/schooldashboard/SchoolDashboard/SchoolDashboard.jsx';
import StaffEnrollForm from './components/P2pHeader/SchoolSegment/schooldashboard/Cards/staff-enroll-form/StaffPrimaryForm/staffPrimaryForm.jsx';
import StudentEnrollForm from './components/P2pHeader/SchoolSegment/schooldashboard/Cards/student-enroll-form/PrimaryForm/primaryForm.jsx';
import StudentBulkEnroll from './components/P2pHeader/SchoolSegment/schooldashboard/Cards/student-bulk-enroll/studentBulkEnroll.jsx';
import StudentDetails from './components/P2pHeader/SchoolSegment/schooldashboard/Cards/student-details/studentDetails.jsx';
import StudentViewDetails from './components/P2pHeader/SchoolSegment/schooldashboard/Cards/student-details/student-view-details/studentViewDetails.jsx';
import StaffDetails from './components/P2pHeader/SchoolSegment/schooldashboard/Cards/staff-details/staffDetails.jsx';
import StaffPrimaryForm from './components/P2pHeader/SchoolSegment/schooldashboard/Cards/staff-enroll-form/StaffPrimaryForm/staffPrimaryForm.jsx';
// import QualificationForm from './components/P2pHeader/SchoolSegment/schooldashboard/Cards/staff-enroll-form/StaffProfessionalInfo/staffProfessionalInfo';
import AttachDocument from './components/P2pHeader/SchoolSegment/schooldashboard/Sidebar/attach-document/attachDocument.jsx';
import SchoolInternalData from './components/P2pHeader/SchoolSegment/schooldashboard/Cards/school-internal-data/schoolInternalData.jsx';
import CareerGuidance from './components/P2pHeader/SchoolSegment/schooldashboard/Sidebar/careerGuidance/careerGuidance.jsx';
import StaffPayroll from './components/P2pHeader/SchoolSegment/schooldashboard/Cards/staff-payroll/staffPayroll.jsx';
import SubjectAllocation from './components/P2pHeader/SchoolSegment/schooldashboard/Sidebar/subject-allocation/subjectAllocation.jsx';
import ClassTimeTable from './components/P2pHeader/SchoolSegment/schooldashboard/Cards/class-timetable/classTimeTable.jsx';
import UploadProducts from './components/Ecommerce/UploadProducts/uploadProducts.jsx';
import EcommerceDashboard from './components/Ecommerce/EcommerceDashboard/ecommerceDashboard.jsx';
import EcomDash from './components/Ecommerce/EcommerceDashboard/ecomDash.jsx';
import ProductsList from './components/Ecommerce/ProductsList/productsList.jsx';
import ProductOverview from './components/Ecommerce/ProductOverview/productOverview.jsx';
import CartPage from './components/Ecommerce/Cart/cartPage.jsx';
import LeaveApproval from './components/P2pHeader/SchoolSegment/schooldashboard/Sidebar/leave-approval/leaveApproval.jsx';
import PayrollForm from './components/P2pHeader/SchoolSegment/schooldashboard/Cards/staff-payroll/payRoll.jsx';
import SchoolStatistics from './components/P2pHeader/SchoolSegment/schooldashboard/Sidebar/school-statistics/schoolStatistics.jsx';
const theme = createTheme();
// mysql://root:nXbyCttzErnSirxYRBZtYNJRprHnbTar@shuttle.proxy.rlwy.net:21943/railway
function App() {
  return (
    <ThemeProvider theme={theme}>
    <GlobalStateProvider>
      <Router>
        <DndProvider backend={HTML5Backend}>
          <Routes>
            <Route path="/" element={<WelcomeBoard />} />
            <Route path="/p2pheader" element={<P2pHeader />} />
            <Route path="/schlogin" element={<SchoolLogin />} />
            <Route path="/register-school" element={<SchoolRegistration />} />
            <Route path="/school_login" element={<SchoolLogin/>} />
            <Route path="/school_dashboard/:school_id" element={<SchoolDashboard />} />
            <Route path="/staff-enroll" element={<StaffEnrollForm />} />
            <Route path="/student-enroll" element={<StudentEnrollForm />} />
            <Route path="/student-bulk-enroll" element={<StudentBulkEnroll />} />
            <Route path="/student-details" element={<StudentDetails />} />
            <Route path="/student-view-details/:StudentId" element={<StudentViewDetails />} /> {/* Route for student details */}
            <Route path="/staff-details" element={<StaffDetails />} />
            <Route path="/enroll/details" element={<StaffPrimaryForm />} />
            {/* <Route path="/enroll/qualification" element={<QualificationForm />} /> */}
            <Route path="/attach-document" element={<AttachDocument />} />
            <Route path="/career-guidance" element={<CareerGuidance />} />
            <Route path="/school-internal-data" element={<SchoolInternalData />} />
            <Route path="/staff-payroll" element={<StaffPayroll />} />
            <Route path="/subject-allocation" element={<SubjectAllocation/>}/>
            <Route path="/class-timetable" element={<ClassTimeTable/>}/>
            <Route path="/upload-products" element={<UploadProducts/>}/>
            <Route path="/ecommerce-dashboard" element={<EcommerceDashboard/>}/>
            <Route path="/ecom-dash" element={<EcomDash/>}/>
            <Route path="/products" element={<ProductsList/>}/>
            <Route path="/product-overview/:productId" element={<ProductOverview />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path= "/leave-approval" element={<LeaveApproval/>} />
            <Route path="/update-staff-payroll" element={<PayrollForm />} />
            <Route path='/school-statistics' element={<SchoolStatistics/>} />
          </Routes>
        </DndProvider>
      </Router>
    </GlobalStateProvider>
    </ThemeProvider>
  );
}

export default App;