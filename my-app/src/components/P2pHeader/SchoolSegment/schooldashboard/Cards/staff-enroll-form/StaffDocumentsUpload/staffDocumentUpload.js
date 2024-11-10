import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { storage } from '../../../../../../connections/firebase'; // Adjust the import path as necessary
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const useStyles = makeStyles((theme) => ({
  typography: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    color: '#3f51b5',
  },
  textField: {
    marginLeft: theme.spacing(2),
    width: '92%',
  },
}));

export default function StaffDocumentUploadForm({ formData = { documents: [] }, setFormData }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [uploadedDoc, setUploadedDoc] = useState({});
  const [fileNames, setFileNames] = useState({});

  useEffect(() => {
    const storedFileNames = formData.documents.reduce((acc, doc) => {
      acc[doc.type] = doc.name;
      return acc;
    }, {});
    setFileNames(storedFileNames);
  }, [formData.documents]);

  const handleDocumentUpload = async (event, documentType) => {
    const file = event.target.files[0];
    if (file) {
      const storageRef = ref(storage, `documents/${file.name}`);
      await uploadBytes(storageRef, file);
      const fileURL = await getDownloadURL(storageRef);

      const newDocument = { name: file.name, url: fileURL, type: documentType };
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
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" className={`${classes.typography} urbanist-font`}>Resume / CV :</Typography>
          <TextField
            required
            type="file"
            id="resume"
            name="resume"
            label="Upload Resume / CV"
            fullWidth
            InputLabelProps={{ shrink: true }}
            onChange={(event) => handleDocumentUpload(event, 'resume')}
            className={`${classes.textField} urbanist-font`}
          />
          {fileNames.resume && <Typography variant="body2" className={`${classes.typography} urbanist-font`}>{fileNames.resume}</Typography>}
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" className={classes.typography}>Photo ID :</Typography>
          <TextField
            required
            type="file"
            id="photoID"
            name="photoID"
            label="Upload Photo ID"
            fullWidth
            InputLabelProps={{ shrink: true }}
            onChange={(event) => handleDocumentUpload(event, 'photoID')}
            className={`${classes.textField} urbanist-font`}
          />
          {fileNames.photoID && <Typography variant="body2" className={`${classes.typography} urbanist-font`}>{fileNames.photoID}</Typography>}
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" className={`${classes.typography} urbanist-font`}>Educational Certificates (optional) :</Typography>
          <TextField
            type="file"
            id="educationalCertificates"
            name="educationalCertificates"
            label="Upload Educational Certificates"
            fullWidth
            InputLabelProps={{ shrink: true }}
            onChange={(event) => handleDocumentUpload(event, 'educationalCertificates')}
            className={`${classes.textField} urbanist-font`}
          />
          {fileNames.educationalCertificates && <Typography variant="body2" className={`${classes.typography} urbanist-font`}>{fileNames.educationalCertificates}</Typography>}
        </Grid>
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Document Uploaded</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`The document "${uploadedDoc.name}" of type "${uploadedDoc.type}" has been successfully uploaded.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}