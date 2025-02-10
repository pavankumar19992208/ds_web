import React, { useState, useContext } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import PublishIcon from "@mui/icons-material/Publish";
import GetAppIcon from "@mui/icons-material/GetApp"; // Icon for download template
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { GlobalStateContext } from '../../../../../../GlobalStateContext';
import Navbar from "../../Navbar/Navbar";
import Sidebar from "../../Sidebar/Sidebar";
import * as XLSX from "xlsx"; // For XLSX file parsing
import "./studentBulkEnroll.css";
import BaseUrl from '../../../../../../config';


const StudentTable = () => {
  const { globalData } = useContext(GlobalStateContext);
  const [showAcademicYear, setShowAcademicYear] = useState(false);
  const toggleAcademicYear = () => {
    setShowAcademicYear(!showAcademicYear);
  };
    const [UserId, setUserId] = useState('');
    const [Password, setPassword] = useState('');
      const [setsuccessDialogOpen, setSuccessDialogOpen] = useState(false);
    
  

  const initialRows = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    fullName: "",
    grade: "",
    previousSchool: "",
    gender: "",
    dateOfBirth: "",
    fatherName: "",
    motherName: "",
    parentQualification: "",
    parentOccupation: "",
    address: "",
    languagesKnown: "",
    phoneNumber: "",
    nationality: "",
    aadharNumber: "",
    previousClass: "",
    previousPercentage: "",
    email: "",
    guardianName: "",
    category: "",
    religion: "",
  }));

  const [rows, setRows] = useState(initialRows);
  const [columnWidths, setColumnWidths] = useState({
    fullName: 150,
    grade: 100,
    previousSchool: 150,
    gender: 100,
    dateOfBirth: 150,
    fatherName: 150,
    motherName: 150,
    parentQualification: 150,
    parentOccupation: 150,
    address: 200,
    languagesKnown: 150,
    phoneNumber: 150,
    nationality: 150,
    aadharNumber: 150,
    previousClass: 150,
    previousPercentage: 150,
    email: 200,
    guardianName: 150,
    category: 100,
    religion: 100,
  });

  const [history, setHistory] = useState([]); // For undo functionality
  const [future, setFuture] = useState([]); // For redo functionality
  const [selectedRow, setSelectedRow] = useState(null); // Track the selected row
  const [focusedDateCell, setFocusedDateCell] = useState(null); // Track focused Date of Birth cell

  const handleResize = (index, event, { size }) => {
    const newWidths = { ...columnWidths };
    newWidths[index] = size.width;
    setColumnWidths(newWidths);
  };

  const addRow = () => {
    const newRow = {
      id: rows.length + 1,
      fullName: "",
      grade: "",
      previousSchool: "",
      gender: "",
      dateOfBirth: "",
      fatherName: "",
      motherName: "",
      parentQualification: "",
      parentOccupation: "",
      address: "",
      languagesKnown: "",
      phoneNumber: "",
      nationality: "",
      aadharNumber: "",
      previousClass: "",
      previousPercentage: "",
      email: "",
      guardianName: "",
      category: "",
      religion: "",
    };
    const newRows = [...rows, newRow];
    setRows(newRows);
    updateHistory(newRows);
  };

  const deleteRow = () => {
    if (selectedRow === null) return;
    const newRows = rows.filter((row) => row.id !== selectedRow);
    setRows(newRows);
    updateHistory(newRows);
    setSelectedRow(null); // Reset selected row after deletion
  };

  const handleInputChange = (id, field, value) => {
    const updatedRows = rows.map((row) => {
      if (row.id === id) {
        return { ...row, [field]: value };
      }
      return row;
    });
    setRows(updatedRows);
    updateHistory(updatedRows);
  };

  const updateHistory = (newRows) => {
    setHistory([...history, rows]); // Save current state to history
    setFuture([]); // Clear future states when a new action is performed
    setRows(newRows);
  };

  const undo = () => {
    if (history.length === 0) return;
    const previousState = history[history.length - 1];
    setFuture([...future, rows]); // Save current state to future
    setHistory(history.slice(0, -1)); // Remove last state from history
    setRows(previousState);
  };

  const redo = () => {
    if (future.length === 0) return;
    const nextState = future[future.length - 1];
    setHistory([...history, rows]); // Save current state to history
    setFuture(future.slice(0, -1)); // Remove last state from future
    setRows(nextState);
  };

  // Handle file import
  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary", cellDates: true }); // Enable cellDates to handle dates
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet, { raw: false }); // Use raw: false to get dates as strings

      // Map the parsed data to the rows format
      const newRows = parsedData.map((row, index) => ({
        id: rows.length + index + 1,
        fullName: row["Full Name"] || "",
        grade: row["Grade"] || "",
        previousSchool: row["Previous School"] || "",
        gender: row["Gender"] || "",
        dateOfBirth: row["Date of Birth"] || "", // Keep the date as a string
        fatherName: row["Father Name"] || "",
        motherName: row["Mother Name"] || "",
        parentQualification: row["Parent Qualification"] || "",
        parentOccupation: row["Parent Occupation"] || "",
        address: row["Address"] || "",
        languagesKnown: row["Languages Known"] || "",
        phoneNumber: row["Phone Number"] || "",
        nationality: row["Nationality"] || "",
        aadharNumber: row["Aadhar Number"] || "",
        previousClass: row["Previous Class"] || "",
        previousPercentage: row["Previous Percentage"] || "",
        email: row["Email"] || "",
        guardianName: row["Guardian Name"] || "",
        category: row["Category"] || "",
        religion: row["Religion"] || "",
      }));

      setRows(newRows);
      updateHistory(newRows);
    };
    reader.readAsBinaryString(file);
  };

  // Download template
  const downloadTemplate = () => {
    const templateData = [
      {
        "Full Name": "",
        "Grade": "",
        "Previous School": "",
        "Gender": "",
        "Date of Birth": "",
        "Father Name": "",
        "Mother Name": "",
        "Parent Qualification": "",
        "Parent Occupation": "",
        "Address": "",
        "Languages Known": "",
        "Phone Number": "",
        "Nationality": "",
        "Aadhar Number": "",
        "Previous Class": "",
        "Previous Percentage": "",
        "Email": "",
        "Guardian Name": "",
        "Category": "",
        "Religion": "",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, "Student_Enrollment_Template.xlsx");
  };

  // Prepare payload and send to backend
  const sendToBackend = async () => {
    const payload = rows.map(row => ({
      SchoolId: globalData.data.SCHOOL_ID,
      StudentName: row.fullName,
      DOB: row.dateOfBirth,
      Gender: row.gender,
      // Photo: "", // Assuming photo URL is not available in bulk enroll
      Grade: row.grade,
      PreviousSchool: row.previousSchool,
      // LanguagesKnown: '',
      Religion: row.religion,
      Category: row.category,
      MotherName: row.motherName,
      FatherName: row.fatherName,
      Nationality: row.nationality,
      AadharNumber: row.aadharNumber,
      GuardianName: row.guardianName,
      MobileNumber: row.phoneNumber,
      Email: row.email,
      // EmergencyContact: "", // Assuming emergency contact is not available in bulk enroll
      // CurrentAddress: '',
      // PermanentAddress: '',
      PreviousPercentage: parseFloat(row.previousPercentage),
      // BloodGroup: "", // Assuming blood group is not available in bulk enroll
      // MedicalDisability: "", // Assuming medical disability is not available in bulk enroll
      // Documents: {}, // Assuming documents are not available in bulk enroll
      ParentOccupation: row.parentOccupation,
      ParentQualification: row.parentQualification,
    }));
    console.log('Payload to send to backend:', payload);

    try {
      const response = await fetch(`${BaseUrl}/registerstudent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

            // ...existing code...
      
      if (!response.ok) {
        if (response.status === 409) { // Assuming 409 is the status code for user already exists
          setSuccessDialogOpen(true);
          setUserId('');
          setPassword('');
        } else {
          throw new Error('Form submission failed');
        }
      } else {
        const data = await response.json();
        console.log('Form data sent to backend successfully:', data);
        setUserId(data.UserId);
        setPassword(data.Password);
        // Print user ID and password to console
        console.log('User ID:', data.UserId);
        console.log('Password:', data.Password);
        // Clear local storage after successful submission
        localStorage.removeItem('uploadedDocuments');
        // Open success dialog
        setSuccessDialogOpen(true);
      }
      
      // ...existing code...
    } catch (error) {
      console.error('Error sending form data to backend:', error);
    }
  };

  return (
    <div className='bulk-screen'>
      <div className="bulk-container">
        <Navbar 
          schoolName={globalData.data.SCHOOL_NAME} 
          schoolLogo={globalData.data.SCHOOL_LOGO} 
          onStartNewAcademicYear={toggleAcademicYear}
        />
        <Sidebar visibleItems={['home', 'attachDocument', 'subjectAllocation', 'attendanceTracking', 'leaveApprovals', 'academicPerformance', 'schoolStatistics', 'teacherAlert', 'eventPlanning', 'careerGuidance', 'inventoryManagement']} showTitle={true} selectedItem="home" />
        <h1>Student Bulk Enrollment</h1>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
          <div>
            <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={addRow} style={{ marginRight: "10px" }}>
              Add Row
            </Button>
            <Button variant="contained" startIcon={<DeleteIcon />} onClick={deleteRow} disabled={selectedRow === null} style={{ marginRight: "10px" }}>
              Delete Row
            </Button>
            <Button variant="contained" startIcon={<UndoIcon />} onClick={undo} disabled={history.length === 0} style={{ marginRight: "10px" }}>
              Undo
            </Button>
            <Button variant="contained" startIcon={<RedoIcon />} onClick={redo} disabled={future.length === 0}>
              Redo
            </Button>
          </div>
          <div>
            <Button
              variant="contained"
              startIcon={<GetAppIcon />}
              onClick={downloadTemplate}
              style={{ marginRight: "10px" }}
            >
              Download Template
            </Button>
            <input
              type="file"
              accept=".csv, .xlsx"
              id="file-import"
              style={{ display: "none" }}
              onChange={handleFileImport}
            />
            <label htmlFor="file-import">
              <Button variant="contained" startIcon={<PublishIcon />} component="span">
                Import CSV/XLSX
              </Button>
            </label>
          </div>
        </div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {Object.keys(columnWidths).map((key) => (
                  <TableCell key={key} sx={{ minWidth: columnWidths[key], padding: "12px", borderRight: "1px solid #ccc", backgroundColor: "#f4f4f4" }}>
                    <ResizableBox
                      width={columnWidths[key]}
                      height={20}
                      axis="x"
                      resizeHandles={["e"]}
                      minConstraints={[100, 20]} // Set minimum width constraint
                      onResize={(e, data) => handleResize(key, e, data)}
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1").trim()}
                    </ResizableBox>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ height: "40px", backgroundColor: selectedRow === row.id ? "#e3f2fd" : "inherit" }}
                  onClick={() => setSelectedRow(row.id)} // Set selected row on click
                >
                  {Object.keys(columnWidths).map((key) => (
                    <TableCell key={key} sx={{ minWidth: columnWidths[key], padding: "4px", borderRight: "1px solid #ccc" }}>
                      <TextField
                        value={row[key]}
                        onChange={(e) => handleInputChange(row.id, key, e.target.value)}
                        variant="standard" // Removes the outlined border
                        size="small" // Makes the field compact
                        type={key === "dateOfBirth" && focusedDateCell === row.id ? "date" : "text"} // Show date picker only when focused
                        sx={{ width: "100%" }}
                        InputProps={{ disableUnderline: true }} // Removes the underline
                        onFocus={() => key === "dateOfBirth" && setFocusedDateCell(row.id)} // Set focused cell
                        onBlur={() => key === "dateOfBirth" && setFocusedDateCell(null)} // Unset focused cell
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button variant="contained" onClick={sendToBackend} style={{ marginTop: "20px" }}>
          Submit to Backend
        </Button>
      </div>
    </div>
  );
};

export default StudentTable;