import React, { useState } from 'react';
import { Select, MenuItem, Button, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, IconButton, Popover } from '@mui/material';
import './sectionAllocation.css';

const SectionAllocation = () => {
    const [selectedClass, setSelectedClass] = useState(''); // State to manage selected class
    const [open, setOpen] = useState(false); // State to manage modal open/close
    const [percentages, setPercentages] = useState({ sectionA: '', sectionB: '', sectionC: '' }); // State to manage percentages
    const [numSections, setNumSections] = useState(''); // State to manage number of sections
    const [hoveredRowA, setHoveredRowA] = useState(null); // State to manage hovered row for section A
    const [hoveredRowB, setHoveredRowB] = useState(null); // State to manage hovered row for section B
    const [hoveredRowC, setHoveredRowC] = useState(null); // State to manage hovered row for section C
    const [anchorEl, setAnchorEl] = useState(null); // State to manage menu anchor
    const [currentStudent, setCurrentStudent] = useState(null); // State to manage current student
    const [currentSection, setCurrentSection] = useState(null); // State to manage current section

    const handleClassChange = (event) => {
        setSelectedClass(event.target.value);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handlePercentageChange = (section) => (event) => {
        const value = event.target.value;
        if (value <= 100) {
            setPercentages({ ...percentages, [section]: value });
        }
    };

    const handleAllocate = () => {
        // Add your allocation logic here
        console.log('Allocating with percentages:', percentages);
        handleClose();
    };

    const handleNumSectionsChange = (event) => {
        const value = event.target.value;
        if (/^\d$/.test(value)) {
            setNumSections(value);
        }
    };

    const dummyData = {
        sectionA: [
            { rollNo: 1, name: 'John Doe', percentage: 85 },
            { rollNo: 2, name: 'Jane Smith', percentage: 90 },
            { rollNo: 3, name: 'Alice Johnson', percentage: 88 },
            { rollNo: 4, name: 'Bob Brown', percentage: 92 },
            { rollNo: 5, name: 'Jane Smith', percentage: 90 },
            { rollNo: 6, name: 'Alice Johnson', percentage: 88 },
            { rollNo: 7, name: 'Bob Brown', percentage: 92 },
            { rollNo: 8, name: 'John Doe', percentage: 85 },
            { rollNo: 9, name: 'Jane Smith', percentage: 90 },
            { rollNo: 10, name: 'Bob Brown', percentage: 92 },
        ],
        sectionB: [
            { rollNo: 1, name: 'Alice Johnson', percentage: 88 },
            { rollNo: 2, name: 'Bob Brown', percentage: 92 },
            { rollNo: 3, name: 'John Doe', percentage: 85 },
            { rollNo: 4, name: 'Jane Smith', percentage: 90 },
            { rollNo: 5, name: 'Bob Brown', percentage: 92 },
            { rollNo: 6, name: 'John Doe', percentage: 85 },
            { rollNo: 7, name: 'Jane Smith', percentage: 90 },
            { rollNo: 8, name: 'Alice Johnson', percentage: 88 },
            { rollNo: 9, name: 'Bob Brown', percentage: 92 },
            { rollNo: 10, name: 'Jane Smith', percentage: 90 },
        ],
        sectionC: [
            { rollNo: 1, name: 'Charlie Davis', percentage: 87 },
            { rollNo: 2, name: 'Dana White', percentage: 91 },
            { rollNo: 3, name: 'Alice Johnson', percentage: 88 },
            { rollNo: 4, name: 'Bob Brown', percentage: 92 },
            { rollNo: 5, name: 'Bob Brown', percentage: 92 },
            { rollNo: 6, name: 'Alice Johnson', percentage: 88 },
            { rollNo: 7, name: 'Bob Brown', percentage: 92 },
            { rollNo: 8, name: 'John Doe', percentage: 85 },
            { rollNo: 9, name: 'Jane Smith', percentage: 90 },
            { rollNo: 10, name: 'Bob Brown', percentage: 92 },
        ],
    };

    return (
        <div className='section-allocation-container'>
            <div className='section-allocation-header'>
                <FormControl variant="outlined" className="select-class-dropdown">
                    <InputLabel id="select-class-label">Select Class</InputLabel>
                    <Select
                        labelId="select-class-label"
                        value={selectedClass}
                        onChange={handleClassChange}
                        label="Select Class"
                        style={{ borderRadius: 10, height: 50 }} // Adjust the height here
                    >
                        <MenuItem value=""><em>None</em></MenuItem>
                        <MenuItem value={'class1'}>Class 1</MenuItem>
                        <MenuItem value={'class2'}>Class 2</MenuItem>
                        <MenuItem value={'class3'}>Class 3</MenuItem>
                        {/* Add more classes as needed */}
                    </Select>
                </FormControl>
                <Button className='auto-allocate-button' variant="contained" color="primary" onClick={handleClickOpen}>
                    Auto Allocate
                </Button>
            </div>
            <TableContainer component={Paper} style={{ marginTop: 16, borderRadius: 10 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Section A</TableCell>
                            <TableCell>Section B</TableCell>
                            <TableCell>Section C</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <div className="scrollable-table" style={{ maxHeight: 350, overflow: 'auto' }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell className="sticky-header">Roll No</TableCell>
                                                <TableCell className="sticky-header">Name</TableCell>
                                                <TableCell className="sticky-header">Percentage</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {dummyData.sectionA.map((student) => (
                                                <TableRow
                                                    key={student.rollNo}
                                                    onMouseEnter={() => setHoveredRowA(student.rollNo)}
                                                    onMouseLeave={() => setHoveredRowA(null)}
                                                >
                                                    <TableCell>{student.rollNo}</TableCell>
                                                    <TableCell>{student.name}</TableCell>
                                                    <TableCell>{student.percentage}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="scrollable-table" style={{ maxHeight: 350, overflow: 'auto' }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell className="sticky-header">Roll No</TableCell>
                                                <TableCell className="sticky-header">Name</TableCell>
                                                <TableCell className="sticky-header">Percentage</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {dummyData.sectionB.map((student) => (
                                                <TableRow
                                                    key={student.rollNo}
                                                    onMouseEnter={() => setHoveredRowB(student.rollNo)}
                                                    onMouseLeave={() => setHoveredRowB(null)}
                                                >
                                                    <TableCell>{student.rollNo}</TableCell>
                                                    <TableCell>{student.name}</TableCell>
                                                    <TableCell>{student.percentage}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="scrollable-table" style={{ maxHeight: 350, overflow: 'auto' }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell className="sticky-header">Roll No</TableCell>
                                                <TableCell className="sticky-header">Name</TableCell>
                                                <TableCell className="sticky-header">Percentage</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {dummyData.sectionC.map((student) => (
                                                <TableRow
                                                    key={student.rollNo}
                                                    onMouseEnter={() => setHoveredRowC(student.rollNo)}
                                                    onMouseLeave={() => setHoveredRowC(null)}
                                                >
                                                    <TableCell>{student.rollNo}</TableCell>
                                                    <TableCell>{student.name}</TableCell>
                                                    <TableCell>{student.percentage}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Auto Allocate</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <FormControl variant="outlined" fullWidth margin="normal">
                                <InputLabel id="select-class-modal-label">Select Class</InputLabel>
                                <Select
                                    labelId="select-class-modal-label"
                                    value={selectedClass}
                                    onChange={handleClassChange}
                                    label="Select Class"
                                >
                                    <MenuItem value=""><em>None</em></MenuItem>
                                    <MenuItem value={'class1'}>Class 1</MenuItem>
                                    <MenuItem value={'class2'}>Class 2</MenuItem>
                                    <MenuItem value={'class3'}>Class 3</MenuItem>
                                    {/* Add more classes as needed */}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                margin="normal"
                                label="Number of Sections"
                                type="number"
                                fullWidth
                                value={numSections}
                                onChange={handleNumSectionsChange}
                                inputProps={{ min: 1, maxLength: 1 }}
                            />
                        </Grid>
                    </Grid>
                    <TextField
                        margin="normal"
                        label="Percentage for Section A"
                        type="number"
                        fullWidth
                        value={percentages.sectionA}
                        onChange={handlePercentageChange('sectionA')}
                        inputProps={{ max: 100 }}
                    />
                    <TextField
                        margin="normal"
                        label="Percentage for Section B"
                        type="number"
                        fullWidth
                        value={percentages.sectionB}
                        onChange={handlePercentageChange('sectionB')}
                        inputProps={{ max: 100 }}
                    />
                    <TextField
                        margin="normal"
                        label="Percentage for Section C"
                        type="number"
                        fullWidth
                        value={percentages.sectionC}
                        onChange={handlePercentageChange('sectionC')}
                        inputProps={{ max: 100 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleAllocate} color="primary">
                        Allocate
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default SectionAllocation;