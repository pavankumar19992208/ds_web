import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  Typography, 
  Table, 
  TableBody, 
  TableRow, 
  TableCell, 
  IconButton,
  Paper,
  Button,
  Divider,
  Box
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  Description as DocIcon,
  InsertDriveFile as FileIcon
} from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import BaseUrl from '../../../../../../../config'; // Adjust the import path as necessary

const useStyles = makeStyles((theme) => ({
  reviewTitle: {
    color: theme.palette.primary.main,
    fontSize: '1.5rem',
    textAlign: 'center',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    fontFamily: '"Urbanist", sans-serif',
    textDecoration: 'underline',
  },
  reviewSectionTitle: {
    color: theme.palette.secondary.main,
    fontSize: '1.2rem',
    marginBottom: theme.spacing(2),
    fontFamily: '"Urbanist", sans-serif',
  },
  documentTable: {
    marginTop: theme.spacing(2),
    '& .MuiTableCell-root': {
      padding: theme.spacing(1),
    },
  },
  documentPreview: {
    width: '100%',
    maxHeight: '300px',
    objectFit: 'contain',
    marginTop: theme.spacing(1),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
  },
  pdfPreview: {
    width: '100%',
    height: '500px',
    marginTop: theme.spacing(1),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
  },
  documentIcon: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
  sectionPaper: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  documentName: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
    fontWeight: 500,
  },
  documentRow: {
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

const personalInfoKeys = [
  { key: 'student_name', label: 'Student Name' },
  { key: 'dob', label: 'Date of Birth', format: 'date' },
  { key: 'gender', label: 'Gender' },
  { key: 'grade', label: 'Grade' },
  { key: 'previous_school', label: 'Previous School' },
  { key: 'languagesKnown', label: 'Languages Known', type: 'array' },
  { key: 'religion', label: 'Religion' },
  { key: 'category', label: 'Category' },
  { key: 'nationality', label: 'Nationality' },
  { key: 'aadhar_number', label: 'Aadhar Number' },
];

const guardianInfoKeys = [
  { key: 'mother_name', label: 'Mother Name' },
  { key: 'father_name', label: 'Father Name' },
  { key: 'guardian_name', label: 'Guardian Name' },
  { key: 'mobile_number', label: 'Mobile Number' },
  { key: 'email', label: 'Email' },
  { key: 'emergency_contact', label: 'Emergency Contact' },
  { key: 'parent_occupation', label: 'Parent Occupation' },
  { key: 'parent_qualification', label: 'Parent Qualification' },
];

const academicInfoKeys = [
  { key: 'previous_percentage', label: 'Previous Percentage' },
  { key: 'blood_group', label: 'Blood Group' },
  { key: 'medical_disability', label: 'Medical Disability' },
];

const addressKeys = [
  { key: 'line1', label: 'Address Line 1' },
  { key: 'line2', label: 'Address Line 2' },
  { key: 'landmark', label: 'Landmark' },
  { key: 'locality', label: 'Locality' },
  { key: 'city', label: 'City' },
  { key: 'district', label: 'District' },
  { key: 'state', label: 'State' },
  { key: 'country', label: 'Country' },
  { key: 'pincode', label: 'Pincode' },
  { key: 'address_type', label: 'Address Type' },
];

// Add this mapping object near the top of your file (after imports)
const DOCUMENT_TYPE_LABELS = {
  'aadhar': 'Aadhar Card',
  'birth_certificate': 'Birth Certificate',
  'medical_history': 'Medical History',
  'previous_school_tc': 'Previous School TC',
  'passport_photo': 'Passport Photo',
  'parent_id_proof': 'Parent ID Proof',
  'caste_certificate': 'Caste Certificate'
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB');
};

const getDocumentIcon = (fileType) => {
  if (!fileType) return <FileIcon />;
  if (fileType.includes('pdf')) return <PdfIcon />;
  if (fileType.includes('image')) return <ImageIcon />;
  if (fileType.includes('document') || fileType.includes('msword') || fileType.includes('wordprocessing')) return <DocIcon />;
  return <FileIcon />;
};

function ReviewForm({ formData, expandedDoc, setExpandedDoc }) {
  const classes = useStyles();
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/languages`);
        setLanguages(response.data.languages);
      } catch (error) {
        console.error("Error fetching languages:", error);
        // Fallback to languages from formData if API fails
        if (formData.personalInfo?.languagesKnown) {
          const langNames = formData.personalInfo.languagesKnown.map(lang => lang.language_name);
          setLanguages(langNames.filter((v, i, a) => a.indexOf(v) === i).map(name => ({
            language_id: name.toLowerCase().replace(' ', '_'),
            language_name: name
          })));
        }
      }
    };
    fetchLanguages();
  }, [formData.personalInfo]);

  const renderValue = (item, data) => {
    if (!data) return 'N/A';
  
    if (item.format === 'date') return formatDate(data);
    if (item.type === 'array') {
      if (item.key === 'languagesKnown') {
        // Handle both API response structure and form data structure
        return data
          .map(lang => {
            // Check if language is already in name format (from form)
            if (typeof lang === 'string') {
              return lang;
            }
            // Handle object structure from API
            const languageName = 
              lang.language_name || 
              (languages.find(l => l.language_id === lang.language_id)?.language_name) || 
              'Unknown';
            const languageType = lang.language_type ? `(${lang.language_type.replace('_', ' ')})` : '';
            return `${languageName} ${languageType}`.trim();
          })
          .filter(Boolean) // Remove any empty strings
          .join(', ');
      }
      return Array.isArray(data) ? data.join(', ') : '';
    }
      if (item.type === 'image') {
      const photoDoc = formData.documents?.find(doc =>
        doc.document_type.toLowerCase().includes('passport') ||
        doc.document_type.toLowerCase().includes('photo')
      );
      
      return (
        <Box>
          <Button 
            size="small" 
            startIcon={<ImageIcon />}
            onClick={() => setExpandedDoc(expandedDoc === item.key ? null : item.key)}
          >
            {expandedDoc === item.key ? 'Hide Photo' : 'View Photo'}
          </Button>
          {expandedDoc === item.key && photoDoc && (
            <>
              <Typography variant="body2" className={classes.documentName}>
                {photoDoc.file_name || 'Student Photo'}
              </Typography>
              <img 
                src={photoDoc.file_url} 
                alt="Student" 
                className={classes.documentPreview}
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Available';
                }}
              />
            </>
          )}
        </Box>
      );
    }
    return typeof data === 'object' ? JSON.stringify(data) : data;
  };

  const renderDocumentPreview = (doc) => {
    const fileType = doc.file_type || doc.originalFile?.type || 'application/octet-stream';
  
    return (
      <Box>
        {fileType.includes('image') ? (
          <img
            src={doc.file_url || URL.createObjectURL(doc.originalFile)}
            alt={doc.file_name || 'Document'}
            className={classes.documentPreview}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Available';
            }}
          />
        ) : fileType.includes('pdf') ? (
          <embed
            src={doc.file_url || URL.createObjectURL(doc.originalFile)}
            type="application/pdf"
            className={classes.pdfPreview}
          />
        ) : (
          <Box className={classes.documentPreview}>
            <Typography variant="body1" color="textSecondary" align="center">
              Preview not available for this file type
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<FileIcon />}
              onClick={() => {
                const link = document.createElement('a');
                link.href = doc.file_url || URL.createObjectURL(doc.originalFile);
                link.download = doc.file_name || 'document';
                link.click();
              }}
              sx={{ mt: 2 }}
            >
              Download File
            </Button>
          </Box>
        )}
      </Box>
    );
  };

// Then update the renderDocumentRow function:
const renderDocumentRow = (doc, index) => {
  const fileType = doc.file_type || doc.originalFile?.type || 'application/octet-stream';
  const isExpanded = expandedDoc === `doc-${index}`;
  const documentName = doc.file_name || doc.name || `Document ${index + 1}`;
  
  // Get the human-readable label or fall back to the document type
  const documentType = DOCUMENT_TYPE_LABELS[doc.document_type || doc.type] || 
                      doc.document_type || 
                      doc.type || 
                      'Document';

  return (
    <React.Fragment key={index}>
      <TableRow className={classes.documentRow}>
        <TableCell>
          <Box display="flex" alignItems="center">
            <span className={classes.documentIcon}>
              {getDocumentIcon(fileType)}
            </span>
            <Typography variant="body2">
              {documentName}
            </Typography>
          </Box>
        </TableCell>
        <TableCell>{documentType}</TableCell>
        <TableCell align="right">
          <IconButton
            size="small"
            onClick={() => setExpandedDoc(isExpanded ? null : `doc-${index}`)}
          >
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      {isExpanded && (
        <TableRow>
          <TableCell colSpan={3}>
            {renderDocumentPreview(doc)}
            <Box mt={1}>
              <Typography variant="caption">
                {doc.file_size_kb && `Size: ${doc.file_size_kb} KB | `}
                {!doc.file_size_kb && doc.size && `Size: ${Math.round(doc.size)} KB | `}
                Type: {fileType}
              </Typography>
            </Box>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
};

  return (
    <div>
      <Typography variant="h4" gutterBottom className={classes.reviewTitle}>
        Review Your Details
      </Typography>

      <Paper elevation={2} className={classes.sectionPaper}>
        <Typography variant="h6" className={classes.reviewSectionTitle}>
          Personal Information
        </Typography>
        <Divider />
        <Table className={classes.documentTable}>
          <TableBody>
            {personalInfoKeys.map((item) => (
              <TableRow key={item.key}>
                <TableCell>{item.label}</TableCell>
                <TableCell>
                  {renderValue(item, formData.personalInfo?.[item.key])}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Paper elevation={2} className={classes.sectionPaper}>
        <Typography variant="h6" className={classes.reviewSectionTitle}>
          Guardian Information
        </Typography>
        <Divider />
        <Table className={classes.documentTable}>
          <TableBody>
            {guardianInfoKeys.map((item) => (
              <TableRow key={item.key}>
                <TableCell>{item.label}</TableCell>
                <TableCell>
                  {renderValue(item, formData.guardianInfo?.[item.key])}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {formData.guardianInfo?.address && (
        <Paper elevation={2} className={classes.sectionPaper}>
          <Typography variant="h6" className={classes.reviewSectionTitle}>
            Address Details
          </Typography>
          <Divider />
          <Table className={classes.documentTable}>
            <TableBody>
              {addressKeys.map((item) => (
                <TableRow key={item.key}>
                  <TableCell>{item.label}</TableCell>
                  <TableCell>
                    {formData.guardianInfo.address[item.key] || 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      <Paper elevation={2} className={classes.sectionPaper}>
        <Typography variant="h6" className={classes.reviewSectionTitle}>
          Academic & Medical Information
        </Typography>
        <Divider />
        <Table className={classes.documentTable}>
          <TableBody>
            {academicInfoKeys.map((item) => (
              <TableRow key={item.key}>
                <TableCell>{item.label}</TableCell>
                <TableCell>
                  {renderValue(item, formData.academicInfo?.[item.key])}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Paper elevation={2} className={classes.sectionPaper}>
        <Typography variant="h6" className={classes.reviewSectionTitle}>
          Uploaded Documents
        </Typography>
        <Divider />
        {formData.documents?.length > 0 ? (
          <Table className={classes.documentTable}>
            <TableBody>
              {formData.documents.map((doc, index) => renderDocumentRow(doc, index))}
            </TableBody>
          </Table>
        ) : (
          <Typography variant="body1" color="textSecondary" style={{ marginTop: 16 }}>
            No documents uploaded
          </Typography>
        )}
      </Paper>
    </div>
  );
}

ReviewForm.propTypes = {
  formData: PropTypes.shape({
    personalInfo: PropTypes.object,
    guardianInfo: PropTypes.object,
    academicInfo: PropTypes.object,
    documents: PropTypes.arrayOf(PropTypes.shape({
      file_name: PropTypes.string,
      file_type: PropTypes.string,
      file_url: PropTypes.string,
      document_type: PropTypes.string,
      file_size_kb: PropTypes.number,
    })),
  }).isRequired,
  expandedDoc: PropTypes.string,
  setExpandedDoc: PropTypes.func.isRequired,
};

export default ReviewForm;