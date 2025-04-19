import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { makeStyles } from '@mui/styles';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

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
  checkboxContainer: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
}));

export default function DocumentsUpload({ formData, setFormData }) {
  const classes = useStyles();
  const [uploadedDoc, setUploadedDoc] = useState({});
  const [fileNames, setFileNames] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [casteCertificateRequired, setCasteCertificateRequired] = useState(false);

  useEffect(() => {
    const storedFileNames = formData.documents.reduce((acc, doc) => {
      acc[doc.type] = doc.name;
      return acc;
    }, {});
    setFileNames(storedFileNames);
    setCasteCertificateRequired(formData.personalInfo.category !== 'General');
  }, [formData.documents, formData.personalInfo.category]);

  const getDocumentTypeId = (documentType) => {
    // Map document types to their IDs (these should match your document_type table)
    const typeMap = {
      'aadhar': 1,
      'birth_certificate': 2,
      'medical_history': 3,
      'previous_school_tc': 4,
      'passport_photo': 5,
      'parent_id_proof': 6,
      'caste_certificate': 7
    };
    return typeMap[documentType];
  };
  
  const handleDocumentUpload = (event, documentType) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileData = e.target.result;
        const fileSizeKB = file.size / 1024; // Convert bytes to KB
        const fileType = file.type;
        
        const newDocument = { 
          name: file.name, 
          data: fileData, 
          type: documentType,
          size: fileSizeKB,
          originalFile: file  // Store original file reference for metadata
        };
        
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
        setTimeout(() => setShowAlert(false), 3000);
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <React.Fragment>
      <Grid container spacing={3}>
        {/* Passport Size Photo */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" className={classes.typography}>
            Passport Size Photo (Recent, White Background):
          </Typography>
          <TextField
            type="file"
            id="passport_photo"
            name="passport_photo"
            label="Upload Passport Photo"
            fullWidth
            InputLabelProps={{ shrink: true }}
            inputProps={{ accept: "image/*" }}
            onChange={(event) => handleDocumentUpload(event, 'passport_photo')}
            className={classes.textField}
          />
          {fileNames.passport_photo && (
            <Typography variant="body2" className={classes.typography}>
              {fileNames.passport_photo}
            </Typography>
          )}
        </Grid>

        {/* Aadhar Card */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" className={classes.typography}>
            Aadhar Card (Front & Back):
          </Typography>
          <TextField
            type="file"
            id="aadhar"
            name="aadhar"
            label="Upload Aadhar Card"
            fullWidth
            InputLabelProps={{ shrink: true }}
            onChange={(event) => handleDocumentUpload(event, 'aadhar')}
            className={classes.textField}
          />
          {fileNames.aadhar && (
            <Typography variant="body2" className={classes.typography}>
              {fileNames.aadhar}
            </Typography>
          )}
        </Grid>

        {/* Birth Certificate */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" className={classes.typography}>
            Birth Certificate:
          </Typography>
          <TextField
            type="file"
            id="birth_certificate"
            label="Upload Birth Certificate"
            fullWidth
            InputLabelProps={{ shrink: true }}
            onChange={(event) => handleDocumentUpload(event, 'birth_certificate')}
            className={classes.textField}
          />
          {fileNames.birth_certificate && (
            <Typography variant="body2" className={classes.typography}>
              {fileNames.birth_certificate}
            </Typography>
          )}
        </Grid>

        {/* Medical History */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" className={classes.typography}>
            Medical History/Disability Certificate (if applicable):
          </Typography>
          <TextField
            type="file"
            id="medical_history"
            label="Upload Medical History"
            fullWidth
            InputLabelProps={{ shrink: true }}
            onChange={(event) => handleDocumentUpload(event, 'medical_history')}
            className={classes.textField}
          />
          {fileNames.medical_history && (
            <Typography variant="body2" className={classes.typography}>
              {fileNames.medical_history}
            </Typography>
          )}
        </Grid>

        {/* Previous School TC */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" className={classes.typography}>
            Previous School Transfer Certificate:
          </Typography>
          <TextField
            type="file"
            id="previous_school_tc"
            label="Upload Transfer Certificate"
            fullWidth
            InputLabelProps={{ shrink: true }}
            onChange={(event) => handleDocumentUpload(event, 'previous_school_tc')}
            className={classes.textField}
          />
          {fileNames.previous_school_tc && (
            <Typography variant="body2" className={classes.typography}>
              {fileNames.previous_school_tc}
            </Typography>
          )}
        </Grid>

        {/* Parent ID Proof */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" className={classes.typography}>
            Parent/Guardian ID Proof (Aadhar/Voter ID/Driving License):
          </Typography>
          <TextField
            type="file"
            id="parent_id_proof"
            label="Upload Parent ID Proof"
            fullWidth
            InputLabelProps={{ shrink: true }}
            onChange={(event) => handleDocumentUpload(event, 'parent_id_proof')}
            className={classes.textField}
          />
          {fileNames.parent_id_proof && (
            <Typography variant="body2" className={classes.typography}>
              {fileNames.parent_id_proof}
            </Typography>
          )}
        </Grid>

        {/* Caste Certificate (conditional) */}
        {casteCertificateRequired && (
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" className={classes.typography}>
              Caste Certificate (For {formData.personalInfo.category} category):
            </Typography>
            <TextField
              type="file"
              id="caste_certificate"
              label="Upload Caste Certificate"
              fullWidth
              InputLabelProps={{ shrink: true }}
              onChange={(event) => handleDocumentUpload(event, 'caste_certificate')}
              className={classes.textField}
            />
            {fileNames.caste_certificate && (
              <Typography variant="body2" className={classes.typography}>
                {fileNames.caste_certificate}
              </Typography>
            )}
          </Grid>
        )}

        {/* Declaration Checkbox */}
        <Grid item xs={12}>
          <div className={classes.checkboxContainer}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.documentsDeclaration || false}
                  onChange={(e) => setFormData({
                    ...formData,
                    documentsDeclaration: e.target.checked
                  })}
                  color="primary"
                />
              }
              label="I hereby declare that all the documents uploaded are genuine and belong to the student/parents as applicable. I understand that providing false documents may lead to cancellation of admission."
            />
          </div>
        </Grid>
      </Grid>

      {showAlert && (
        <Stack className={classes.alert} spacing={2}>
          <Alert severity="success" sx={{ backgroundColor: 'rgb(237, 247, 237)' }}>
            {`Uploaded "${uploadedDoc.name}".`}
          </Alert>
        </Stack>
      )}
    </React.Fragment>
  );
}