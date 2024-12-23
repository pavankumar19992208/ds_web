import React from 'react';
import { TextField, MenuItem, FormControl, InputLabel, Select, Button, IconButton } from '@material-ui/core';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import CloseIcon from '@material-ui/icons/Close';
import './attachDocumentStudent.css'; // Import the CSS file

const AttachDocumentStudent = ({ onClose }) => {
  const [formValues, setFormValues] = React.useState({
    admissionNo: '',
    dob: '',
    surname: '',
    firstname: '',
    lastname: '',
    fullname: '',
    documentType: '',
    documentFile: null,
  });

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    setFormValues({
      ...formValues,
      [name]: files ? files[0] : value,
    });
  };

  const handleAttach = () => {
    // Handle the attach action here
    console.log('Document attached:', formValues);
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <IconButton className="close-button" onClick={onClose}>
          <CloseIcon />
        </IconButton>
        <form noValidate autoComplete="off">
          <TextField
            label="Admission No"
            name="admissionNo"
            value={formValues.admissionNo}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="DOB"
            name="dob"
            type="date"
            value={formValues.dob}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Surname / Firstname"
            name="surname"
            value={formValues.surname}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Lastname"
            name="lastname"
            value={formValues.lastname}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Fullname"
            name="fullname"
            value={formValues.fullname}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Type of document you want to attach</InputLabel>
            <Select
              name="documentType"
              value={formValues.documentType}
              onChange={handleChange}
            >
              <MenuItem value="aadhar">Aadhar</MenuItem>
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="casteAndBirth">Caste and Birth</MenuItem>
              <MenuItem value="bankPassbook">Bank Passbook</MenuItem>
              <MenuItem value="passportPhoto">Passport Size Photo</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Upload Document"
            name="documentFile"
            type="file"
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button
            className="attach-button"
            variant="contained"
            color="primary"
            startIcon={<AttachFileIcon />}
            onClick={handleAttach}
          >
            Attach
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AttachDocumentStudent;