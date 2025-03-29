import React from 'react';
import './Ss_Genie.css'; // Ensure you have a CSS file with the same name in your project
import genieimg from '../../../images/Mobile_Genie.png';
function SsGenie() {
  return (
    <div className="container">
      <div className="side-by-side">
        <div className="item">Item 1</div>
      </div>
      <div className="side-by-side">
<div className="item">
  <div behavior="scroll" direction="left">
    <img style={{width:'90%', height:'400px', paddingBottom:'80px'}} src={genieimg} alt="Description" />
  </div>
</div>
      </div>
    </div>
  );
}

export default SsGenie;