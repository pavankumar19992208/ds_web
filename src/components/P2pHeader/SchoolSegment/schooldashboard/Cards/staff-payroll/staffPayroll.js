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
import AddIcon from '@mui/icons-material/Add'; // Import AddIcon
import GetAppIcon from '@mui/icons-material/GetApp';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Sidebar from '../../Sidebar/Sidebar';
import Navbar from '../../Navbar/Navbar';
import { GlobalStateContext } from '../../../../../../GlobalStateContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { CSVLink } from 'react-csv';
import { useNavigate } from 'react-router-dom';

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

function createData(staffId, staffName, bankAccount, workingHours, leaves, salary, currentSalary) {
  return { staffId, staffName, bankAccount, workingHours, leaves, salary, currentSalary };
}

const initialRows = [
  createData('S001', 'John Doe', '123456789', 160, '2', '$5000', '$4800'),
  createData('S002', 'Jane Smith', '987654321', 150, '3', '$4500', '$4300'),
  createData('S003', 'Alice Johnson', '456789123', 170, '1', '$7000', '$6800'),
  createData('S004', 'Bob Brown', '789123456', 165, '0', '$6000', '$6000'),
];

export default function StaffPayroll() {
  const { globalData } = React.useContext(GlobalStateContext);
  const [rows, setRows] = React.useState(initialRows);
  const [editIdx] = React.useState(-1);
  const [open, setOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const navigate = useNavigate();

  const handleOpen = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);


  const handleChange = (e, name, idx) => {
    const { value } = e.target;
    const updatedRows = rows.map((row, i) => (i === idx ? { ...row, [name]: value } : row));
    setRows(updatedRows);
  };

  const handleAddRow = () => {
    navigate('/staff-enroll');
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Staff ID', 'Staff Name', 'Bank A/C', 'Working Hours', 'Leaves', 'Salary', 'Current Salary']],
      body: rows.map(row => [row.staffId, row.staffName, row.bankAccount, row.workingHours, row.leaves, row.salary, row.currentSalary]),
    });
    doc.save('staff_payroll.pdf');
  };

  const handleDownloadPaySlip = (row) => {
    const doc = new jsPDF();
    doc.text(`Pay Slip for ${row.staffName}`, 10, 10);
    doc.autoTable({
      head: [['Attribute', 'Value']],
      body: [
        ['Staff ID', row.staffId],
        ['Staff Name', row.staffName],
        ['Bank A/C', row.bankAccount],
        ['Working Hours', row.workingHours],
        ['Leaves', row.leaves],
        ['Salary', row.salary],
        ['Current Salary', row.currentSalary],
      ],
    });
    doc.save(`payslip_${row.staffId}.pdf`);
  };

  const csvData = rows.map(row => ({
    StaffID: row.staffId,
    StaffName: row.staffName,
    BankAccount: row.bankAccount,
    WorkingHours: row.workingHours,
    Leaves: row.leaves,
    Salary: row.salary,
    CurrentSalary: row.currentSalary,
  }));

  return (
    <React.Fragment>
      <Navbar schoolName={globalData.data.SCHOOL_NAME} schoolLogo={globalData.data.SCHOOL_LOGO} />
      <Sidebar visibleItems={['home', 'updateStaffPayroll']} hideProfile={true} showTitle={false} />
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
                  <StyledTableCell>Staff ID</StyledTableCell>
                  <StyledTableCell>Staff Name</StyledTableCell>
                  <StyledTableCell>Bank A/C</StyledTableCell>
                  <StyledTableCell>Working Hours</StyledTableCell>
                  <StyledTableCell>Leaves</StyledTableCell>
                  <StyledTableCell>Salary</StyledTableCell>
                  <StyledTableCell>Current Salary</StyledTableCell>
                  <StyledTableCell>Pay Slips</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, idx) => (
                  <StyledTableRow key={row.staffId}>
                    <StyledTableCell component="th" scope="row">
                      <button onClick={() => handleOpen(row)}>{row.staffId}</button>                    </StyledTableCell>
                    <StyledTableCell>
                      {editIdx === idx ? (
                        <input
                          type="text"
                          value={row.staffName}
                          onChange={(e) => handleChange(e, 'staffName', idx)}
                          style={{ width: '100%' }}
                        />
                      ) : (
                        row.staffName
                      )}
                    </StyledTableCell>
                    <StyledTableCell>
                      {editIdx === idx ? (
                        <input
                          type="text"
                          value={row.bankAccount}
                          onChange={(e) => handleChange(e, 'bankAccount', idx)}
                          style={{ width: '100%' }}
                        />
                      ) : (
                        row.bankAccount
                      )}
                    </StyledTableCell>
                    <StyledTableCell>
                      {editIdx === idx ? (
                        <input
                          type="number"
                          value={row.workingHours}
                          onChange={(e) => handleChange(e, 'workingHours', idx)}
                          style={{ width: '100%' }}
                        />
                      ) : (
                        row.workingHours
                      )}
                    </StyledTableCell>
                    <StyledTableCell>
                      {editIdx === idx ? (
                        <input
                          type="text"
                          value={row.leaves}
                          onChange={(e) => handleChange(e, 'leaves', idx)}
                          style={{ width: '100%' }}
                        />
                      ) : (
                        row.leaves
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
                        <input
                          type="text"
                          value={row.currentSalary}
                          onChange={(e) => handleChange(e, 'currentSalary', idx)}
                          style={{ width: '100%' }}
                        />
                      ) : (
                        row.currentSalary
                      )}
                    </StyledTableCell>
                    <StyledTableCell>
                      <IconButton onClick={() => handleDownloadPaySlip(row)}>
                        <GetAppIcon />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="dialog-title">Details for {selectedRow?.staffId}</DialogTitle>
        <DialogContent>
          {selectedRow && (
            <DialogContentText id="dialog-description">
              <strong>Staff Name:</strong> {selectedRow.staffName}<br />
              <strong>Bank A/C:</strong> {selectedRow.bankAccount}<br />
              <strong>Working Hours:</strong> {selectedRow.workingHours}<br />
              <strong>Leaves:</strong> {selectedRow.leaves}<br />
              <strong>Salary:</strong> {selectedRow.salary}<br />
              <strong>Current Salary:</strong> {selectedRow.currentSalary}
            </DialogContentText>
          )}
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