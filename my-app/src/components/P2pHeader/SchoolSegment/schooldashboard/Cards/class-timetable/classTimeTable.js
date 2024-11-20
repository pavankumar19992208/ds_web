import React, {useContext} from 'react';
import { GlobalStateContext } from "../../../../../../GlobalStateContext";
import Sidebar from '../../Sidebar/Sidebar';
import Navbar from '../../Navbar/Navbar';
import './classTimeTable.css';

const ClassTimeTable = () => {
    const { globalData } = useContext(GlobalStateContext);
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
        <div className="container">
          <h1>Class Timetable</h1>
          {/* Add your class timetable content here */}
        </div>
      </div>
    </div>
  );
};

export default ClassTimeTable;