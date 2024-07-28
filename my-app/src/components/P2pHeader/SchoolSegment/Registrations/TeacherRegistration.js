import React, { useState, useEffect } from 'react';
import { storage } from '../../../connections/firebase'; // Ensure you have configured Firebase
import axios from 'axios';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './TeacherRegistration.css'; // Import the CSS file

const subjectsList = ['ENGLISH', 'TELUGU', 'MATHEMATICS', 'SCIENCE', 'SOCIAL', 'HINDI'];

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

    const handleSubjectsChange = (e) => {
        const { options } = e.target;
        const selectedSubjects = [];
        for (let i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                selectedSubjects.push(options[i].value);
            }
        }
        setFormData({
            ...formData,
            SUBJECTS: selectedSubjects
        });
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

            const finalFormData = { ...formData, TEACHER_PIC: teacherPicUrl };
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
                    <select
                        multiple
                        name="SUBJECTS"
                        value={formData.SUBJECTS}
                        onChange={handleSubjectsChange}
                        required
                    >
                        {subjectsList.map((subject) => (
                            <option key={subject} value={subject}>
                                {subject}
                            </option>
                        ))}
                    </select>
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
                        required
                    />
                </label>
            </div>
            <button type="submit" className="submit-button">Register Teacher</button>
        </form>
    );
};

export default TeacherRegistration;