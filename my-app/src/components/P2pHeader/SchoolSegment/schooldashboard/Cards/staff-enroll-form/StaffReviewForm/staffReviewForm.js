import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, Table, TableBody, TableCell, TableRow, IconButton } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

const personalInfoKeys = ['fullName', 'dob', 'gender', 'contactNumber', 'email'];
const professionalInfoKeys = ['position', 'experience', 'qualification', 'certifications'];
const employmentInfoKeys = ['joiningDate', 'employmentType', 'previousSchool'];
const emergencyContactInfoKeys = ['emergencyContactName', 'emergencyContactNumber', 'relationshipToTeacher'];
const additionalInfoKeys = ['languagesKnown', 'interests', 'availabilityOfExtraCirricularActivities'];

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
                  <TableCell>{formData.personalInfo[key] || ''}</TableCell>
                </TableRow>
              ))}
              {formData.personalInfo.profilePic && (
                <TableRow>
                  <TableCell>Profile Picture</TableCell>
                  <TableCell>
                    <img src={formData.personalInfo.profilePic} alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" className={classes.reviewSectionTitle}>Professional Info</Typography>
          <Table>
            <TableBody>
              {professionalInfoKeys.map((key) => (
                <TableRow key={key}>
                  <TableCell>{key}</TableCell>
                  <TableCell>{formData.professionalInfo[key] || ''}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" className={classes.reviewSectionTitle}>Subject Specialization</Typography>
          <Table>
            <TableBody>
              {formData.professionalInfo.grades.map((grade, index) => (
                <TableRow key={index}>
                  <TableCell>{`Class ${grade.value}`}</TableCell>
                  <TableCell>{(grade.subjects || []).join(', ')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" className={classes.reviewSectionTitle}>Employment Info</Typography>
          <Table>
            <TableBody>
              {employmentInfoKeys.map((key) => (
                <TableRow key={key}>
                  <TableCell>{key}</TableCell>
                  <TableCell>{formData.employmentInfo[key] || ''}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" className={classes.reviewSectionTitle}>Emergency Contact Info</Typography>
          <Table>
            <TableBody>
              {emergencyContactInfoKeys.map((key) => (
                <TableRow key={key}>
                  <TableCell>{key}</TableCell>
                  <TableCell>{formData.emergencyContactInfo[key] || ''}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" className={classes.reviewSectionTitle}>Additional Info</Typography>
          <Table>
            <TableBody>
              {additionalInfoKeys.map((key) => (
                <TableRow key={key}>
                  <TableCell>{key}</TableCell>
                  <TableCell>{formData.additionalInfo[key] || ''}</TableCell>
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
                        <img src={doc.url} alt={doc.name} style={{ width: '100%' }} />
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
  expandedDoc: PropTypes.number,
  setExpandedDoc: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default ReviewForm;