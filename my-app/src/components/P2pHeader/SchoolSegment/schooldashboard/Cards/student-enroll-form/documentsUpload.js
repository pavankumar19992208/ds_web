import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

export default function DocumentsUpload() {
  const [documentType, setDocumentType] = useState('');
  const [uploadedDocuments, setUploadedDocuments] = useState([]);

  const handleDocumentTypeChange = (event) => {
    setDocumentType(event.target.value);
    setUploadedDocuments([]); // Reset the uploaded documents when type changes
  };

  const handleDocumentUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedDocuments((prevDocuments) => [
          ...prevDocuments,
          { name: file.name, data: e.target.result, type: documentType }
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Document Upload
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            select
            required
            id="documentType"
            label="Document Type"
            fullWidth
            value={documentType}
            onChange={handleDocumentTypeChange}
          >
            <MenuItem value="aadhar">Aadhar</MenuItem>
            <MenuItem value="tc">Transfer Certificate (TC)</MenuItem>
            <MenuItem value="rationcard">Ration Card</MenuItem>
            <MenuItem value="income">Income Certificate</MenuItem>
            <MenuItem value="birth">Birth Certificate</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            type="file"
            id="uploadDocument"
            label="Upload Document"
            fullWidth
            InputLabelProps={{ shrink: true }}
            onChange={handleDocumentUpload}
          />
        </Grid>
        {uploadedDocuments.map((doc, index) => (
          <Grid item xs={12} key={index}>
            <Typography variant="subtitle1">{doc.type}</Typography>
            <img src={doc.data} alt={doc.name} style={{ maxWidth: '100%', maxHeight: '200px' }} />
            <Typography variant="body2">{doc.name}</Typography>
          </Grid>
        ))}
      </Grid>
    </React.Fragment>
  );
}