
import './App.css';
import Navbar from './components/Navbar'
import Services from './components/Services'
import Welcome from './components/Welcome'
function App() {
  return (
    <div className="App">
      <div className='Navbar'><Navbar/></div>
      <div classNmae='Welcome'><Welcome/></div>
      <div className='service_tabs'><Services/></div>
    </div>
  );
}

export default App;
