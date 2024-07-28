import React, { useState, useEffect } from 'react';
import { storage } from '../connections/firebase'; // Ensure you have configured Firebase
import axios from 'axios';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './SchoolRegistration.css'; // Import the CSS file

const SchoolRegistration = () => {
    const [formData, setFormData] = useState({
        SCHOOL_ID: '',
        D_NO: '',
        STREET: '',
        AREA: '',
        CITY: '',
        DISTRICT: '',
        STATE: '',
        PIN_CODE: '',
        GEO_TAG: '',
        SCHOOL_NAME: '',
        SYLLABUS_TYPE: '',
        ADH_NAME: '',
        ADH_MOBILE: '',
        ADH_EMAIL: ''
    });
    const [schoolLogoFile, setSchoolLogoFile] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setFormData((prevFormData) => ({
                        ...prevFormData,
                        GEO_TAG: `${latitude},${longitude}`
                    }));
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setSchoolLogoFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let schoolLogoUrl = '';
            if (schoolLogoFile) {
                const fileExtension = schoolLogoFile.name.split('.').pop();
                const storageRef = ref(storage, `school_logos/${formData.SCHOOL_ID}.${fileExtension}`);
                await uploadBytes(storageRef, schoolLogoFile);
                schoolLogoUrl = await getDownloadURL(storageRef);
            }

            const finalFormData = { ...formData, SCHOOL_LOGO: schoolLogoUrl };
            const response = await axios.post('http://127.0.0.1:8000/schregister', finalFormData);
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <form className="school-registration-form" onSubmit={handleSubmit}>
            {Object.keys(formData).map((key) => (
                <div className="form-group" key={key}>
                    <label>
                        {key.replace('_', ' ')}:
                        <input
                            type="text"
                            name={key}
                            value={formData[key]}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
            ))}
            <div className="form-group">
                <label>
                    School Logo:
                    <input
                        type="file"
                        accept=".svg,.png,.jpg,.jpeg"
                        onChange={handleFileChange}
                        required
                    />
                </label>
            </div>
            <button type="submit" className="submit-button">Register School</button>
        </form>
    );
};

export default SchoolRegistration;