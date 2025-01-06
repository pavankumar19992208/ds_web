import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GlobalStateProvider } from './GlobalStateContext';
import P2pHeader from './components/P2pHeader/P2pHeader';
import WelcomeBoard from './components/WelcomeBoard/WelcomeBoard';
import SchoolLogin from './components/P2pHeader/SchoolSegment/SchoolLogin';
import SchoolRegistration from './components/P2pHeader/SchoolRegistration';
import SchoolDashboard from './components/P2pHeader/SchoolSegment/schooldashboard/SchoolDashboard/SchoolDashboard';
import StaffEnrollForm from './components/P2pHeader/SchoolSegment/schooldashboard/Cards/staff-enroll-form/StaffPrimaryForm/staffPrimaryForm';
import StudentEnrollForm from './components/P2pHeader/SchoolSegment/schooldashboard/Cards/student-enroll-form/PrimaryForm/primaryForm';
import StaffPrimaryForm from './components/P2pHeader/SchoolSegment/schooldashboard/Cards/staff-enroll-form/StaffPrimaryForm/staffPrimaryForm';
// import QualificationForm from './components/P2pHeader/SchoolSegment/schooldashboard/Cards/staff-enroll-form/StaffProfessionalInfo/staffProfessionalInfo';
import AttachDocument from './components/P2pHeader/SchoolSegment/schooldashboard/Sidebar/attach-document/attachDocument';
import SchoolInternalData from './components/P2pHeader/SchoolSegment/schooldashboard/Cards/school-internal-data/schoolInternalData';
import CareerGuidance from './components/P2pHeader/SchoolSegment/schooldashboard/Sidebar/careerGuidance/careerGuidance';
import StaffPayroll from './components/P2pHeader/SchoolSegment/schooldashboard/Cards/staff-payroll/staffPayroll';
import SubjectAllocation from './components/P2pHeader/SchoolSegment/schooldashboard/Sidebar/subject-allocation/subjectAllocation';
import ClassTimeTable from './components/P2pHeader/SchoolSegment/schooldashboard/Cards/class-timetable/classTimeTable';
import UploadProducts from './components/Ecommerce/UploadProducts/uploadProducts';
import EcommerceDashboard from './components/Ecommerce/EcommerceDashboard/ecommerceDashboard';
import EcomDash from './components/Ecommerce/EcommerceDashboard/ecomDash';
import ProductsList from './components/Ecommerce/ProductsList/productsList';
import ProductOverview from './components/Ecommerce/ProductOverview/productOverview';
import CartPage from './components/Ecommerce/Cart/cartPage';

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
          <Route path="/staff-enroll" element={<StaffEnrollForm />} />
          <Route path="/student-enroll" element={<StudentEnrollForm />} />
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
          <Route path="/cart" element={<CartPage />} />        </Routes>
      </Router>
    </GlobalStateProvider>
  );
}

export default App;