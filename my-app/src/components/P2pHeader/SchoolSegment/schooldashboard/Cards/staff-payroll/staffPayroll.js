import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import UpdateIcon from '@mui/icons-material/Update';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import GetAppIcon from '@mui/icons-material/GetApp';
import Button from '@mui/material/Button';
import Sidebar from '../../Sidebar/Sidebar';
import Navbar from '../../Navbar/Navbar';
import { GlobalStateContext } from '../../../../../../GlobalStateContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { CSVLink } from 'react-csv';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function createData(sno, candidateId, candidateName, qualification, experience, subjectsTaught, salary) {
  return { sno, candidateId, candidateName, qualification, experience, subjectsTaught, salary };
}

const initialRows = [
  createData(1, 'C001', 'John Doe', 'MSc', '5 years', 'Math, Science', '$5000'),
  createData(2, 'C002', 'Jane Smith', 'BEd', '3 years', 'English, History', '$4500'),
  createData(3, 'C003', 'Alice Johnson', 'PhD', '10 years', 'Physics, Chemistry', '$7000'),
  createData(4, 'C004', 'Bob Brown', 'MA', '8 years', 'History, Geography', '$6000'),
];

export default function StaffPayroll() {
  const { globalData } = React.useContext(GlobalStateContext);
  const [rows, setRows] = React.useState(initialRows);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editIdx, setEditIdx] = React.useState(-1);

  const handleEdit = (idx) => {
    setEditIdx(idx);
    setIsEditing(true);
  };

  const handleSave = () => {
    setEditIdx(-1);
    setIsEditing(false);
  };

  const handleDelete = (idx) => {
    const updatedRows = rows.filter((row, i) => i !== idx);
    setRows(updatedRows);
  };

  const handleChange = (e, name, idx) => {
    const { value } = e.target;
    const updatedRows = rows.map((row, i) => (i === idx ? { ...row, [name]: value } : row));
    setRows(updatedRows);
  };

  const handleAddRow = () => {
    const newRow = createData(
      rows.length + 1,
      '',
      '',
      '',
      '',
      '',
      ''
    );
    setRows([...rows, newRow]);
    setEditIdx(rows.length);
    setIsEditing(true);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['S.No', 'Name', 'ID', 'Subjects Taught', 'Qualification', 'Experience', 'Salary']],
      body: rows.map(row => [row.sno, row.candidateName, row.candidateId, row.subjectsTaught, row.qualification, row.experience, row.salary]),
    });
    doc.save('staff_payroll.pdf');
  };

  const csvData = rows.map(row => ({
    SNo: row.sno,
    Name: row.candidateName,
    ID: row.candidateId,
    SubjectsTaught: row.subjectsTaught,
    Qualification: row.qualification,
    Experience: row.experience,
    Salary: row.salary,
  }));

  return (
    <React.Fragment>
      <Navbar schoolName={globalData.data.SCHOOL_NAME} schoolLogo={globalData.data.SCHOOL_LOGO} />
      <Sidebar visibleItems={['home']} hideProfile={true} showTitle={false} />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px', height: '80vh' }}>
        <Paper style={{ width: '85%' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddRow}
              sx={{
                background: 'white',
                color: '#f1200e',
                marginRight: '10px',
                '&:hover': {
                  background: '#f99990',
                  color: 'white',
                },
              }}
            >
              Add
            </Button>
            <Button
              variant="contained"
              startIcon={<GetAppIcon />}
              onClick={handleDownloadPDF}
              sx={{
                background: 'white',
                color: 'black',
                marginRight: '10px',
                '&:hover': {
                  background: 'black',
                  color: 'white',
                },
              }}
            >
              Download PDF
            </Button>
            <CSVLink data={csvData} filename="staff_payroll.csv" style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                startIcon={<GetAppIcon />}
                sx={{
                  background: 'white',
                  color: 'black',
                  '&:hover': {
                    background: 'black',
                    color: 'white',
                  },
                }}
              >
                Download CSV
              </Button>
            </CSVLink>
          </div>
          <TableContainer sx={{ maxHeight: 'calc(100% - 60px)' }}>
            <Table stickyHeader sx={{ minWidth: 650 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>S.No</StyledTableCell>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell>ID</StyledTableCell>
                  <StyledTableCell>Subjects Taught</StyledTableCell>
                  <StyledTableCell sx={{ width: '150px' }}>Qualification</StyledTableCell>
                  <StyledTableCell sx={{ width: '150px' }}>Experience</StyledTableCell>
                  <StyledTableCell>Salary</StyledTableCell>
                  <StyledTableCell>Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, idx) => (
                  <StyledTableRow key={row.sno}>
                    <StyledTableCell component="th" scope="row">
                      {row.sno}
                    </StyledTableCell>
                    <StyledTableCell>
                      {editIdx === idx ? (
                        <input
                          type="text"
                          value={row.candidateName}
                          onChange={(e) => handleChange(e, 'candidateName', idx)}
                          style={{ width: '100%' }}
                        />
                      ) : (
                        row.candidateName
                      )}
                    </StyledTableCell>
                    <StyledTableCell>
                      {editIdx === idx ? (
                        <input
                          type="text"
                          value={row.candidateId}
                          onChange={(e) => handleChange(e, 'candidateId', idx)}
                          style={{ width: '100%' }}
                        />
                      ) : (
                        row.candidateId
                      )}
                    </StyledTableCell>
                    <StyledTableCell>
                      {editIdx === idx ? (
                        <input
                          type="text"
                          value={row.subjectsTaught}
                          onChange={(e) => handleChange(e, 'subjectsTaught', idx)}
                          style={{ width: '100%' }}
                        />
                      ) : (
                        row.subjectsTaught
                      )}
                    </StyledTableCell>
                    <StyledTableCell sx={{ width: '150px' }}>
                      {editIdx === idx ? (
                        <input
                          type="text"
                          value={row.qualification}
                          onChange={(e) => handleChange(e, 'qualification', idx)}
                          style={{ width: '100%' }}
                        />
                      ) : (
                        row.qualification
                      )}
                    </StyledTableCell>
                    <StyledTableCell sx={{ width: '150px' }}>
                      {editIdx === idx ? (
                        <input
                          type="text"
                          value={row.experience}
                          onChange={(e) => handleChange(e, 'experience', idx)}
                          style={{ width: '100%' }}
                        />
                      ) : (
                        row.experience
                      )}
                    </StyledTableCell>
                    <StyledTableCell>
                      {editIdx === idx ? (
                        <input
                          type="text"
                          value={row.salary}
                          onChange={(e) => handleChange(e, 'salary', idx)}
                          style={{ width: '100%' }}
                        />
                      ) : (
                        row.salary
                      )}
                    </StyledTableCell>
                    <StyledTableCell>
                      {editIdx === idx ? (
                        <IconButton onClick={handleSave}>
                          <SaveIcon />
                        </IconButton>
                      ) : (
                        <>
                          <IconButton onClick={() => handleEdit(idx)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(idx)}>
                            <DeleteIcon />
                          </IconButton>
                        </>
                      )}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    </React.Fragment>
  );
}