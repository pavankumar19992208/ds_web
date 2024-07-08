// In StudentServices.js
import './StudentServices.css'
import SsGenie from './StudentServices/Ss_Genie';
import SsStat from './StudentServices/Ssstat';
export default function StudentServices(props) {
    return (
        <div className="SS-container">
         <SsGenie/>
         <SsStat/>
        </div>
      );
  }