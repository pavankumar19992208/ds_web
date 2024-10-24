import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

export default function DocumentsUpload() {
  const [uploadedDocuments, setUploadedDocuments] = useState({
    aadhar: null,
    tc: null,
    rationcard: null,
    income: null,
    birth: null,
  });

  const handleDocumentUpload = (event, documentType) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedDocuments((prevDocuments) => ({
          ...prevDocuments,
          [documentType]: { name: file.name, data: e.target.result, type: documentType },
        }));
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
          <Typography variant="subtitle1">Aadhar</Typography>
          <TextField
            type="file"
            id="uploadDocument-aadhar"
            label="Upload Aadhar"
            fullWidth
            InputLabelProps={{ shrink: true }}
            onChange={(event) => handleDocumentUpload(event, 'aadhar')}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1">Transfer Certificate (TC)</Typography>
          <TextField
            type="file"
            id="uploadDocument-tc"
            label="Upload Transfer Certificate (TC)"
            fullWidth
            InputLabelProps={{ shrink: true }}
            onChange={(event) => handleDocumentUpload(event, 'tc')}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1">Ration Card</Typography>
          <TextField
            type="file"
            id="uploadDocument-rationcard"
            label="Upload Ration Card"
            fullWidth
            InputLabelProps={{ shrink: true }}
            onChange={(event) => handleDocumentUpload(event, 'rationcard')}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1">Income Certificate</Typography>
          <TextField
            type="file"
            id="uploadDocument-income"
            label="Upload Income Certificate"
            fullWidth
            InputLabelProps={{ shrink: true }}
            onChange={(event) => handleDocumentUpload(event, 'income')}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1">Birth Certificate</Typography>
          <TextField
            type="file"
            id="uploadDocument-birth"
            label="Upload Birth Certificate"
            fullWidth
            InputLabelProps={{ shrink: true }}
            onChange={(event) => handleDocumentUpload(event, 'birth')}
          />
        </Grid>
        {Object.values(uploadedDocuments).some(doc => doc) && (
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Uploaded Documents
            </Typography>
            {Object.entries(uploadedDocuments).map(([type, doc], index) => (
              doc && (
                <Grid container spacing={2} key={index}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1">{doc.type}</Typography>
                    <img src={doc.data} alt={doc.name} style={{ maxWidth: '100%', maxHeight: '200px' }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">{doc.name}</Typography>
                  </Grid>
                </Grid>
              )
            ))}
          </Grid>
        )}
      </Grid>
    </React.Fragment>
  );
}