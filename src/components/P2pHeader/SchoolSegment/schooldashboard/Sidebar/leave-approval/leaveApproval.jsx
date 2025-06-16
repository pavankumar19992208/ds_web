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
import BaseUrl from '../../../../../../config';
import { GlobalStateContext } from '../../../../../../GlobalStateContext';

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

export default function LeaveApprove() {
  const { globalData } = React.useContext(GlobalStateContext);
  const [rows, setRows] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);

  React.useEffect(() => {
    // Fetch pending leaves from the backend
    fetch(`${BaseUrl}/pending-leaves`)
      .then((response) => response.json())
      .then((data) => setRows(data))
      .catch((error) => console.error('There was an error fetching the leave data!', error));
  }, []);

  const handleOpen = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleApprove = async (idx) => {
    const row = rows[idx];
    try {
      const response = await fetch(`${BaseUrl}/update-leave-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leave_id: row.leave_id,
          approved_by: 'Admin', // Replace with the actual approver's name
          status: 'Approved',
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.detail}`);
      }
  
      const data = await response.json();
      console.log(data.message);
  
      // Update the local state to reflect the new status
      const updatedRows = rows.map((row, i) =>
        i === idx ? { ...row, status: 'Approved' } : row
      );
      setRows(updatedRows);
    } catch (error) {
      console.error('Error approving leave:', error);
    }
  };

  const handleReject = async (idx) => {
    const row = rows[idx];
    try {
      const response = await fetch(`${BaseUrl}/update-leave-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leave_id: row.leave_id,
          approved_by: 'Admin', // Replace with the actual approver's name
          status: 'Rejected',
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data.message);
  
      // Update the local state to reflect the new status
      const updatedRows = rows.map((row, i) =>
        i === idx ? { ...row, status: 'Rejected' } : row
      );
      setRows(updatedRows);
    } catch (error) {
      console.error('Error rejecting leave:', error);
    }
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
                  <StyledTableCell>Teacher ID</StyledTableCell>
                  <StyledTableCell>Teacher Name</StyledTableCell>
                  <StyledTableCell>Reason</StyledTableCell>
                  <StyledTableCell>Start Date</StyledTableCell>
                  <StyledTableCell>End Date</StyledTableCell>
                  <StyledTableCell>Requested At</StyledTableCell>
                  <StyledTableCell>Leaves Count</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell>Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, idx) => (
                  <StyledTableRow key={row.leave_id}>
                    <StyledTableCell component="th" scope="row">
                      <button onClick={() => handleOpen(row)}>{row.leave_id}</button>
                    </StyledTableCell>
                    <StyledTableCell>{row.teacherid}</StyledTableCell>
                    <StyledTableCell>{row.teacher_name}</StyledTableCell>
                    <StyledTableCell>{row.reason}</StyledTableCell>
                    <StyledTableCell>{row.start_date}</StyledTableCell>
                    <StyledTableCell>{row.end_date}</StyledTableCell>
                    <StyledTableCell>{row.requested_date}</StyledTableCell>
                    <StyledTableCell>{row.leaves_count}</StyledTableCell>
                    <StyledTableCell>{row.status}</StyledTableCell>
                    <StyledTableCell>
                      {row.status === 'Pending' ? (
                        <>
                          <Button variant="contained" color="primary" onClick={() => handleApprove(idx)}>
                            Approve
                          </Button>
                          <Button variant="contained" color="secondary" onClick={() => handleReject(idx)} style={{ marginLeft: '10px' }}>
                            Reject
                          </Button>
                        </>
                      ) : (
                        row.status
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
        <DialogTitle id="dialog-title">Details for {selectedRow?.leave_id}</DialogTitle>
        <DialogContent>
          {selectedRow && (
            <DialogContentText id="dialog-description">
              <strong>Teacher ID:</strong> {selectedRow.teacherid}<br />
              <strong>Teacher Name:</strong> {selectedRow.teacher_name}<br />
              <strong>Reason:</strong> {selectedRow.reason}<br />
              <strong>Start Date:</strong> {selectedRow.start_date}<br />
              <strong>End Date:</strong> {selectedRow.end_date}<br />
              <strong>Requested At:</strong> {selectedRow.requested_date}<br />
              <strong>Leaves Count:</strong> {selectedRow.leaves_count}<br />
              <strong>Status:</strong> {selectedRow.status}
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