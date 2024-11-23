import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Grid, Table, TableBody, TableRow, TableCell, IconButton } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

const personalInfoKeys = ['StudentName', 'DOB', 'Gender', 'Photo', 'Grade', 'PreviousSchool', 'languagesKnown', 'Religion', 'Category', 'Nationality', 'AadharNumber'];
const guardianInfoKeys = ['MotherName', 'FatherName', 'GuardianName', 'MobileNumber', 'Email', 'EmergencyContact', 'ParentOccupation', 'ParentQualification'];
const academicInfoKeys = ['PreviousPercentage', 'BloodGroup', 'MedicalDisability'];

function ReviewForm({ formData, expandedDoc, setExpandedDoc, classes }) {
  return (
    <div>
      <Typography variant="h6" gutterBottom className={classes.reviewTitle}>
        Review Your Details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" className={classes.reviewSectionTitle}>Personal details</Typography>
          <Table>
            <TableBody>
              {personalInfoKeys.map((key) => (
                <TableRow key={key}>
                  <TableCell>{key}</TableCell>
                  <TableCell>
                    {key === 'Photo' ? (
                      <div>
                        <Typography>{formData.personalInfo.PhotoName}</Typography>
                        <IconButton onClick={() => setExpandedDoc(expandedDoc === key ? null : key)}>
                          {expandedDoc === key ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                        {expandedDoc === key && (
                          <img src={formData.personalInfo.Photo} alt="User's uploaded photo" style={{ width: '100%' }} />
                        )}
                      </div>
                    ) : key === 'languagesKnown' ? (
                      formData.personalInfo.languagesKnown ? formData.personalInfo.languagesKnown.join(', ') : ''
                    ) : (
                      typeof formData.personalInfo[key] === 'object' ? JSON.stringify(formData.personalInfo[key]) : formData.personalInfo[key] || ''
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" className={classes.reviewSectionTitle}>Guardian Info</Typography>
          <Table>
            <TableBody>
              {guardianInfoKeys.map((key) => (
                <TableRow key={key}>
                  <TableCell>{key}</TableCell>
                  <TableCell>
                    {typeof formData.guardianInfo[key] === 'object' ? JSON.stringify(formData.guardianInfo[key]) : formData.guardianInfo[key] || ''}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
        {formData.guardianInfo.currentAddress && Object.keys(formData.guardianInfo.currentAddress).length > 0 && (
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" className={classes.reviewSectionTitle}>Current Address</Typography>
            <Table>
              <TableBody>
                {Object.entries(formData.guardianInfo.currentAddress).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell>{key}</TableCell>
                    <TableCell>{value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
        )}
        {formData.guardianInfo.permanentAddress && Object.keys(formData.guardianInfo.permanentAddress).length > 0 && (
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" className={classes.reviewSectionTitle}>Permanent Address</Typography>
            <Table>
              <TableBody>
                {Object.entries(formData.guardianInfo.permanentAddress).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell>{key}</TableCell>
                    <TableCell>{value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
        )}
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" className={classes.reviewSectionTitle}>Academic & Medical Info</Typography>
          <Table>
            <TableBody>
              {academicInfoKeys.map((key) => (
                <TableRow key={key}>
                  <TableCell>{key}</TableCell>
                  <TableCell>
                    {typeof formData.academicInfo[key] === 'object' ? JSON.stringify(formData.academicInfo[key]) : formData.academicInfo[key] || ''}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" className={classes.reviewSectionTitle}>Uploaded Documents</Typography>
          <Table>
            <TableBody>
              {formData.documents.map((doc, index) => (
                <React.Fragment key={index}>
                  <TableRow>
                    <TableCell>{doc.name.length > 10 ? `${doc.name.substring(0, 10)}...` : doc.name}</TableCell>
                    <TableCell>{doc.type}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => setExpandedDoc(expandedDoc === index ? null : index)}>
                        {expandedDoc === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  {expandedDoc === index && (
                    <TableRow>
                      <TableCell colSpan={3}>
                        <img src={doc.data} alt={doc.name} style={{ width: '100%' }} />
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </div>
  );
}

ReviewForm.propTypes = {
  formData: PropTypes.object.isRequired,
  expandedDoc: PropTypes.any,
  setExpandedDoc: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default ReviewForm;