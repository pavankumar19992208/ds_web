import React, { useState, useEffect } from 'react';
import './StudentRegistration.css';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../../../connections/firebase';

const StudentRegistration = () => {
	const [formData, setFormData] = useState({
		SCHOOL_ID: '',
		STUDENT_NAME: '',
		GRADE: '',
		SECTION: '',
		AADHAR_NO: '',
		GUARDIAN_NAME: '',
		RELATION: '',
		GUARDIAN_MOBILE: '',
		GUARDIAN_EMAIL: '',
		DOC_ID: '',
		D_NO: '',
		STREET: '',
		AREA: '',
		CITY: '',
		DISTRICT: '',
		STATE: '',
		PIN_CODE: ''
	});

	const [profilePic, setProfilePic] = useState(null);

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
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};

	const handleFileChange = (e) => {
		setProfilePic(e.target.files[0]);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		let profilePicUrl = '';
		if (profilePic) {
			const storageRef = ref(storage, `profile_pics/${profilePic.name}`);
			await uploadBytes(storageRef, profilePic);
			profilePicUrl = await getDownloadURL(storageRef);
		}

		const response = await fetch('http://127.0.0.1:8000/st_register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ ...formData, STUDENT_PIC: profilePicUrl })
		});
		const result = await response.json();
		alert(`Student ID: ${result.student_id}, Password: ${result.password}`);
	};

	return (
		<div className="student-registration">
			<h2>Student Registration</h2>
			<form onSubmit={handleSubmit}>
				{Object.keys(formData).map((key) => (
					<div key={key} className="form-group">
						<label>{key.replace('_', ' ')}</label>
						<input
							type="text"
							name={key}
							value={formData[key]}
							onChange={handleChange}
							required
						/>
					</div>
				))}
				<div className="form-group">
					<label>Profile Picture</label>
					<input
						type="file"
						onChange={handleFileChange}
					/>
				</div>
				<button className="bst" type="submit">Register</button>
			</form>
		</div>
	);
};

export default StudentRegistration;