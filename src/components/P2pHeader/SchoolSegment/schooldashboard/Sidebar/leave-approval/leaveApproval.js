import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Sidebar from '../Sidebar';
import Navbar from '../../Navbar/Navbar';
import { GlobalStateContext } from '../../../../../../GlobalStateContext';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

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

function createData(id, fullName, mobileNumber, leaveType, leaveStartDate, leaveEndDate, reason, action) {
  const leaveDuration = dayjs(leaveEndDate).diff(dayjs(leaveStartDate), 'day') + 1;
  return { id, fullName, mobileNumber, leaveType, leaveStartDate, leaveEndDate, leaveDuration, reason, action };
}

const initialRows = [
  createData('T001', 'John Doe', '1234567890', 'Sick Leave', '2023-10-01', '2023-10-05', 'Flu', 'Pending'),
  createData('T002', 'Jane Smith', '0987654321', 'Casual Leave', '2023-10-10', '2023-10-12', 'Personal', 'Pending'),
  createData('T003', 'Alice Johnson', '1122334455', 'Maternity Leave', '2023-11-01', '2023-12-01', 'Maternity', 'Pending'),
  createData('T004', 'Bob Brown', '6677889900', 'Sick Leave', '2023-10-15', '2023-10-20', 'Injury', 'Pending'),
  createData('T005', 'Charlie Davis', '3344556677', 'Casual Leave', '2023-11-01', '2023-11-05', 'Personal', 'Pending'),
  createData('T006', 'David Wilson', '5566778899', 'Sick Leave', '2023-10-25', '2023-10-30', 'Fever', 'Pending'),
  createData('T007', 'Eve Lee', '7788990011', 'Casual Leave', '2023-11-10', '2023-11-15', 'Personal', 'Pending'),
];

export default function LeaveApprove() {
  const { globalData } = React.useContext(GlobalStateContext);
  const [rows, setRows] = React.useState(initialRows);
  const [open, setOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const navigate = useNavigate();

  const handleOpen = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleApprove = (idx) => {
    const updatedRows = rows.map((row, i) => (i === idx ? { ...row, action: 'Approved' } : row));
    setRows(updatedRows);
  };

  const handleReject = (idx) => {
    const updatedRows = rows.map((row, i) => (i === idx ? { ...row, action: 'Rejected' } : row));
    setRows(updatedRows);
  };

  return (
    <React.Fragment>
      <Navbar schoolName={globalData.data.SCHOOL_NAME} schoolLogo={globalData.data.SCHOOL_LOGO} />
      <Sidebar visibleItems={['home', 'leaveApproval']} hideProfile={true} showTitle={false} />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px', height: '80vh' }}>
        <Paper style={{ width: '85%' }}>
          <TableContainer sx={{ maxHeight: 'calc(100% - 60px)' }}>
            <Table stickyHeader sx={{ minWidth: 650 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>ID</StyledTableCell>
                  <StyledTableCell>Full Name</StyledTableCell>
                  <StyledTableCell>Mobile Number</StyledTableCell>
                  <StyledTableCell>Leave Type</StyledTableCell>
                  <StyledTableCell>Leave Start Date</StyledTableCell>
                  <StyledTableCell>Leave End Date</StyledTableCell>
                  <StyledTableCell>Leave Duration</StyledTableCell>
                  <StyledTableCell>Reason</StyledTableCell>
                  <StyledTableCell>Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, idx) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell component="th" scope="row">
                      <a href="#" onClick={() => handleOpen(row)}>{row.id}</a>
                    </StyledTableCell>
                    <StyledTableCell>{row.fullName}</StyledTableCell>
                    <StyledTableCell>{row.mobileNumber}</StyledTableCell>
                    <StyledTableCell>{row.leaveType}</StyledTableCell>
                    <StyledTableCell>{row.leaveStartDate}</StyledTableCell>
                    <StyledTableCell>{row.leaveEndDate}</StyledTableCell>
                    <StyledTableCell>{row.leaveDuration} days</StyledTableCell>
                    <StyledTableCell>{row.reason}</StyledTableCell>
                    <StyledTableCell>
                      {row.action === 'Pending' ? (
                        <>
                          <Button variant="contained" color="primary" onClick={() => handleApprove(idx)}>Approve</Button>
                          <Button variant="contained" color="secondary" onClick={() => handleReject(idx)} style={{ marginLeft: '10px' }}>Reject</Button>
                        </>
                      ) : (
                        row.action
                      )}
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
        <DialogTitle id="dialog-title">Details for {selectedRow?.id}</DialogTitle>
        <DialogContent>
          {selectedRow && (
            <DialogContentText id="dialog-description">
              <strong>Full Name:</strong> {selectedRow.fullName}<br />
              <strong>Mobile Number:</strong> {selectedRow.mobileNumber}<br />
              <strong>Leave Type:</strong> {selectedRow.leaveType}<br />
              <strong>Leave Start Date:</strong> {selectedRow.leaveStartDate}<br />
              <strong>Leave End Date:</strong> {selectedRow.leaveEndDate}<br />
              <strong>Leave Duration:</strong> {selectedRow.leaveDuration} days<br />
              <strong>Reason:</strong> {selectedRow.reason}<br />
              <strong>Action:</strong> {selectedRow.action}
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