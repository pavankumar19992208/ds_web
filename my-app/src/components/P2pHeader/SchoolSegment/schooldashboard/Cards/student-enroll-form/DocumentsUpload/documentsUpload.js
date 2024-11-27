import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

const useStyles = makeStyles((theme) => ({
  typography: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    color: '#3f51b5',
    fontFamily: '"Urbanist", sans-serif',
    fontOpticalSizing: 'auto',
    fontWeight: 500,
  },
  textField: {
    marginLeft: theme.spacing(2),
    width: '92%',
    fontFamily: '"Urbanist", sans-serif',
    fontOpticalSizing: 'auto',
    fontWeight: 500,
  },
  alert: {
    position: 'fixed',
    top: theme.spacing(8),
    right: theme.spacing(0),
    zIndex: 1000,
  },
}));

export default function DocumentsUpload({ formData, setFormData }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [uploadedDoc, setUploadedDoc] = useState({});
  const [fileNames, setFileNames] = useState({});
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const storedFileNames = formData.documents.reduce((acc, doc) => {
      acc[doc.type] = doc.name;
      return acc;
    }, {});
    setFileNames(storedFileNames);
  }, [formData.documents]);

  const handleDocumentUpload = (event, documentType) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileData = e.target.result;
        const newDocument = { name: file.name, data: fileData, type: documentType };
        setFormData((prevFormData) => {
          const updatedDocuments = prevFormData.documents.filter(doc => doc.type !== documentType);
          const newDocuments = [...updatedDocuments, newDocument];
          return {
            ...prevFormData,
            documents: newDocuments,
          };
        });
        setUploadedDoc(newDocument);
        setFileNames((prevFileNames) => ({
          ...prevFileNames,
          [documentType]: file.name,
        }));
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000); // Hide alert after 3 seconds
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" className={classes.typography}>Aadhar :</Typography>
          <TextField
            type="file"
            id="Aadhar"
            name="Aadhar"
            label="Upload Aadhar"
            fullWidth
            InputLabelProps={{ shrink: true }}
            onChange={(event) => handleDocumentUpload(event, 'aadhar')}
            className={classes.textField}
          />
          {fileNames.aadhar && <Typography variant="body2" className={classes.typography}>{fileNames.aadhar}</Typography>}
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" className={classes.typography}>Transfer Certificate (TC) :</Typography>
          <TextField
            type="file"
            id="uploadDocument-tc"
            label="Upload Transfer Certificate (TC)"
            fullWidth
            InputLabelProps={{ shrink: true }}
            onChange={(event) => handleDocumentUpload(event, 'tc')}
            className={classes.textField}
          />
          {fileNames.tc && <Typography variant="body2" className={classes.typography}>{fileNames.tc}</Typography>}
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" className={classes.typography}>Ration Card :</Typography>
          <TextField
            type="file"
            id="uploadDocument-rationcard"
            label="Upload Ration Card"
            fullWidth
            InputLabelProps={{ shrink: true }}
            onChange={(event) => handleDocumentUpload(event, 'rationcard')}
            className={classes.textField}
          />
          {fileNames.rationcard && <Typography variant="body2" className={classes.typography}>{fileNames.rationcard}</Typography>}
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" className={classes.typography}>Income Certificate :</Typography>
          <TextField
            type="file"
            id="uploadDocument-income"
            label="Upload Income Certificate"
            fullWidth
            InputLabelProps={{ shrink: true }}
            onChange={(event) => handleDocumentUpload(event, 'income')}
            className={classes.textField}
          />
          {fileNames.income && <Typography variant="body2" className={classes.typography}>{fileNames.income}</Typography>}
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" className={classes.typography}>Birth Certificate :</Typography>
          <TextField
            type="file"
            id="uploadDocument-birth"
            label="Upload Birth Certificate"
            fullWidth
            InputLabelProps={{ shrink: true }}
            onChange={(event) => handleDocumentUpload(event, 'birth')}
            className={classes.textField}
          />
          {fileNames.birth && <Typography variant="body2" className={classes.typography}>{fileNames.birth}</Typography>}
        </Grid>
      </Grid>
      {showAlert && (
        <Stack className={classes.alert} spacing={2}>
          <Alert severity="success" sx={{ backgroundColor: 'rgb(237, 247, 237)' }}>{`uploaded "${uploadedDoc.name}".`}</Alert>
        </Stack>
      )}
    </React.Fragment>
  );
}