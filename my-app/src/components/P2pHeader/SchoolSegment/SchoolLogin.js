// SchoolLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../popups/LoginPopup.css'; // Update the path as necessary

const SchoolLogin = () => {
    let navigate = useNavigate();
    const [schoolId, setSchoolId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/sch_login', {
                schoolId,
                password
            });
        
            if (response.status === 200) {
                console.log('Response:', response.data);
                // Extract the data excluding the password field
                const { PASSWORD, ...userDetails } = response.data;
                // Store the details from the backend
                localStorage.setItem('userDetails', JSON.stringify(userDetails));
                navigate('/school_dashboard'); // Adjust the path as needed
            } else {
                setError('Login failed. Please check your credentials.');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="loginPopup">
            <div className="loginPopupContainer">
                <div className='widget-container'>
                    <div className="loginHeader">
                        <h2 style={{marginLeft:'0%'}}>SCHOOL LOGIN</h2>
                    </div>
                    <div className="loginBody">
                        <div className="inputGroup inputIcon">
                            <h4 className='space widget-align-left'>SCHOOL ID</h4>
                            <i className="fas fa-user widget-align-left"></i>
                            <input 
                                type="text" 
                                placeholder="" 
                                value={schoolId}
                                onChange={(e) => setSchoolId(e.target.value)}
                            />
                        </div>
                        <div className="inputGroup inputIcon">
                            <h4 className='space widget-align-left'>PASSWORD</h4>
                            <i className="fas fa-lock widget-align-left"></i>
                            <input 
                                type="password" 
                                placeholder="" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {error && <div className="error-message">{error}</div>}
                        <div className="button-grid">
                            <button className="forgotPassword widget-align-left">forgot password</button>
                            <button className="loginButton widget-align-right" onClick={handleLogin}>LOGIN</button>
                        </div>
                    </div>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
                </div>
            </div> 
        </div>
    );
};

export default SchoolLogin;