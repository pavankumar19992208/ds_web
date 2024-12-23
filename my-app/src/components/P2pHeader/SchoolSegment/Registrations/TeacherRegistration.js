import React, { useState, useEffect } from 'react';
import { storage } from '../../../connections/firebase'; // Ensure you have configured Firebase
import axios from 'axios';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import './TeacherRegistration.css'; // Import the CSS file

const subjectsList = [
    { value: 'ENGLISH', label: 'ENGLISH' },
    { value: 'TELUGU', label: 'TELUGU' },
    { value: 'MATHEMATICS', label: 'MATHEMATICS' },
    { value: 'SCIENCE', label: 'SCIENCE' },
    { value: 'SOCIAL', label: 'SOCIAL' },
    { value: 'HINDI', label: 'HINDI' }
];

const animatedComponents = makeAnimated();

const TeacherRegistration = () => {
    const [formData, setFormData] = useState({
        SCHOOL_ID: '',
        TEACHER_NAME: '',
        QUALIFICATION: '',
        AADHAR_NO: '',
        TEACHER_MOBILE: '',
        TEACHER_EMAIL: '',
        DOC_ID: '',
        D_NO: '',
        STREET: '',
        AREA: '',
        CITY: '',
        DISTRICT: '',
        STATE: '',
        PIN_CODE: '',
        SUBJECTS: [],
        TEACHER_PIC: ''
    });
    const [teacherPicFile, setTeacherPicFile] = useState(null);

    useEffect(() => {
        const userDetails = JSON.parse(localStorage.getItem('userDetails'));
        if (userDetails) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                SCHOOL_ID: userDetails.data.SCHOOL_ID
            }));
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
        setTeacherPicFile(e.target.files[0]);
    };

    const handleSubjectsChange = (selectedOptions) => {
        const selectedSubjects = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setFormData({
            ...formData,
            SUBJECTS: selectedSubjects
        });
    };

    const generateTeacherId = (teacher) => {
        const randomDigits = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('');
        const teacherId = ('t' + teacher.TEACHER_NAME.slice(0, 2) + teacher.SCHOOL_ID.slice(3, 6) + randomDigits).toUpperCase();
        return teacherId;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let teacherPicUrl = '';
            if (teacherPicFile) {
                const storageRef = ref(storage, `teacher_pics/${teacherPicFile.name}`);
                await uploadBytes(storageRef, teacherPicFile);
                teacherPicUrl = await getDownloadURL(storageRef);
            }

            const teacherId = generateTeacherId(formData);
            const finalFormData = { ...formData, TEACHER_ID: teacherId, TEACHER_PIC: teacherPicUrl };
            const response = await axios.post('http://127.0.0.1:8000/tregister', finalFormData);
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <form className="teacher-registration-form" onSubmit={handleSubmit}>
            {Object.keys(formData).map((key) => (
                key !== 'SUBJECTS' && key !== 'TEACHER_PIC' && (
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
                )
            ))}
            <div className="form-group">
                <label>
                    Subjects:
                    <Select
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        isMulti
                        options={subjectsList}
                        onChange={handleSubjectsChange}
                        required
                    />
                </label>
                <div>
                    Selected Subjects: {formData.SUBJECTS.join(', ')}
                </div>
            </div>
            <div className="form-group">
                <label>
                    Teacher Picture:
                    <input
                        type="file"
                        accept=".svg,.png,.jpg,.jpeg"
                        onChange={handleFileChange}
                    />
                </label>
            </div>
            <button type="submit" className="submit-button">Register Teacher</button>
        </form>
    );
};

export default TeacherRegistration;