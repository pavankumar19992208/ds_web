import './WelcomeBoard.css';
import Navbar from '../Navbar'
import Services from '../Services'
import Welcome from '../Welcome'
function WelcomeBoard() {
  return (
    <div className="App">
      <div className='Navbar'><Navbar/></div>
      <div classNmae='Welcome'><Welcome/></div>
      <div className='service_tabs'><Services/></div>
    </div>
  );
}

export default WelcomeBoard;
