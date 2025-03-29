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
import BaseUrl from '../../../../../../config';
import { useEffect } from 'react';
import LinearProgress from '@mui/material/LinearProgress'; // Import LinearProgress
import Sidebar from '../../Sidebar/Sidebar';
import Navbar from '../../Navbar/Navbar';
import { GlobalStateContext } from '../../../../../../GlobalStateContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { CSVLink } from 'react-csv';
import { useNavigate } from 'react-router-dom';
import './staffPayroll.css';

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

export default function StaffPayroll() {
  const { globalData } = React.useContext(GlobalStateContext);
  const [rows, setRows] = React.useState([]);
  const [editIdx] = React.useState(-1);
  const [searchTerm, setSearchTerm] = React.useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false); // Add loading state
  const schoolId = globalData.data.SCHOOL_ID;

  useEffect(() => {
    // Fetch data from the backend
    const fetchStaffDetails = async () => {
      setLoading(true);
      try {
        console.log(`Fetching staff details for schoolId: ${schoolId}`);
        const response = await fetch(`${BaseUrl}/teachers?schoolId=${schoolId}`);
        const data = await response.json();
        console.log('Fetched staff details:', data);
        const formattedData = data.teachers.map(teacher => ({
          staffId: teacher.teacherid,
          staffName: teacher.Name,
          bankAccount: teacher.bankAccount || 'N/A', // Assuming bankAccount is part of the teacher object
          workingHours: teacher.workingHours || 0, // Assuming workingHours is part of the teacher object
          leaves: teacher.leaves || 0, // Assuming leaves is part of the teacher object
          salary: teacher.salary || 'N/A', // Assuming salary is part of the teacher object
          currentSalary: teacher.currentSalary || 'N/A', // Assuming currentSalary is part of the teacher object
        }));
        setRows(formattedData);
      } catch (error) {
        console.error('Error fetching staff details:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    if (schoolId) {
      fetchStaffDetails();
    }
  }, [schoolId]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredRows = rows.filter(row =>
    String(row.staffId).toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.staffName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="staff-payroll">
      <Navbar schoolName={globalData.data.SCHOOL_NAME} schoolLogo={globalData.data.SCHOOL_LOGO} />
      <Sidebar visibleItems={['home', 'updateStaffPayroll']} hideProfile={true} showTitle={false} />
      <div className='staff-payroll-container' >
      {loading && <LinearProgress />} {/* Display loader bar when loading */}
        <Paper style={{ width: '100%', margin: 'auto', marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
          <div className="srch-bar-container" >
                    <input
                        type="text"
                        placeholder="Search by ID or Name"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="srch-bar"
                    />
                </div>
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
          <TableContainer sx={{ maxHeight: 520 }}> {/* Set a fixed height */}
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
                {filteredRows.map((row, idx) => (
                  <StyledTableRow key={row.staffId}>
                    <StyledTableCell component="th" scope="row">
                      {row.staffId}
                    </StyledTableCell>
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
    </div>
  );
}