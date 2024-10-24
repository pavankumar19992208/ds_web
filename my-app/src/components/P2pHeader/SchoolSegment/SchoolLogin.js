import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalStateContext } from '../../../GlobalStateContext';
import '../../popups/LoginPopup.css'; // Update the path as necessary
import BASE_URL from '../../../config';

const SchoolLogin = () => {
    let navigate = useNavigate();
    const { setGlobalData } = useContext(GlobalStateContext);
    const [schoolId, setSchoolId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch(`${BASE_URL}/sch_login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ schoolId, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            console.log(data);
            setGlobalData(data);
            navigate('/school_dashboard');
        } catch (error) {
            setError('Invalid school ID or password');
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
                            <input
                                type="text"
                                value={schoolId}
                                onChange={(e) => setSchoolId(e.target.value)}
                                className="loginInput"
                            />
                        </div>
                        <div className="inputGroup inputIcon">
                            <h4 className='space widget-align-left'>PASSWORD</h4>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="loginInput"
                            />
                        </div>
                        {error && <div className="error">{error}</div>}
                        <button onClick={handleLogin} className="loginButton">Login</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchoolLogin;