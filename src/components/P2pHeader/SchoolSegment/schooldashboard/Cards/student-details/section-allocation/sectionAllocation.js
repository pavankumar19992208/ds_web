import React, { useState } from 'react';
import { Select, MenuItem, Button, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid } from '@mui/material';
import { useDrag, useDrop } from 'react-dnd';
import './sectionAllocation.css';

const ItemTypes = {
    STUDENT: 'student',
};

const DraggableRow = ({ student, section, moveStudent }) => {
    const [, ref] = useDrag({
        type: ItemTypes.STUDENT,
        item: { student, section },
    });

    const [, drop] = useDrop({
        accept: ItemTypes.STUDENT,
        drop: (item) => {
            if (item.section !== section) {
                moveStudent(item.student, item.section, section);
            }
        },
    });

    return (
        <TableRow ref={(node) => ref(drop(node))}>
            <TableCell>{student.rollNo}</TableCell>
            <TableCell>{student.name}</TableCell>
            <TableCell>{student.percentage}</TableCell>
        </TableRow>
    );
};

const SectionAllocation = () => {
    const [selectedClass, setSelectedClass] = useState('');
    const [open, setOpen] = useState(false);
    const [percentages, setPercentages] = useState({ sectionA: '', sectionB: '', sectionC: '' });
    const [numSections, setNumSections] = useState('');
    const [dummyData, setDummyData] = useState({
        sectionA: [
            { rollNo: 1, name: 'John Doe', percentage: 85 },
            { rollNo: 2, name: 'Jane Smith', percentage: 90 },
            { rollNo: 3, name: 'John Doe', percentage: 85 },
            { rollNo: 4, name: 'Jane Smith', percentage: 90 },
            { rollNo: 5, name: 'John Doe', percentage: 85 },
            { rollNo: 6, name: 'Jane Smith', percentage: 90 },
            { rollNo: 7, name: 'John Doe', percentage: 85 },
            { rollNo: 8, name: 'Jane Smith', percentage: 90 },
            { rollNo: 9, name: 'John Doe', percentage: 85 },
            { rollNo: 10, name: 'Jane Smith', percentage: 90 },

        ],
        sectionB: [
            { rollNo: 1, name: 'Alice Johnson', percentage: 88 },
            { rollNo: 2, name: 'Bob Brown', percentage: 92 },
            { rollNo: 3, name: 'Alice Johnson', percentage: 88 },
            { rollNo: 4, name: 'Alice Johnson', percentage: 88 },
            { rollNo: 5, name: 'Bob Brown', percentage: 92 },
            { rollNo: 6, name: 'Alice Johnson', percentage: 88 },
            { rollNo: 7, name: 'Alice Johnson', percentage: 88 },
            { rollNo: 8, name: 'Bob Brown', percentage: 92 },
            { rollNo: 9, name: 'Alice Johnson', percentage: 88 },
            { rollNo: 10, name: 'Alice Johnson', percentage: 88 },
        ],
        sectionC: [
            { rollNo: 1, name: 'Charlie Davis', percentage: 87 },
            { rollNo: 2, name: 'Dana White', percentage: 91 },
            { rollNo: 3, name: 'Alice Johnson', percentage: 88 },
            { rollNo: 4, name: 'Bob Brown', percentage: 92 },
            { rollNo: 5, name: 'Alice Johnson', percentage: 88 },
            { rollNo: 6, name: 'Alice Johnson', percentage: 88 },
            { rollNo: 7, name: 'Bob Brown', percentage: 92 },
            { rollNo: 8, name: 'Alice Johnson', percentage: 88 },
            { rollNo: 9, name: 'Alice Johnson', percentage: 88 },
            { rollNo: 10, name: 'Bob Brown', percentage: 92 },
        ],
    });

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
        console.log('Allocating with percentages:', percentages);
        handleClose();
    };

    const handleNumSectionsChange = (event) => {
        const value = event.target.value;
        if (/^\d$/.test(value)) {
            setNumSections(value);
        }
    };

    const moveStudent = (student, fromSection, toSection) => {
        setDummyData((prevData) => {
            const fromList = prevData[fromSection].filter((s) => s.rollNo !== student.rollNo);
            const toList = [...prevData[toSection], student];
            return {
                ...prevData,
                [fromSection]: fromList,
                [toSection]: toList,
            };
        });
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
                        style={{ borderRadius: 10, height: 50 }}
                    >
                        <MenuItem value=""><em>None</em></MenuItem>
                        <MenuItem value={'class1'}>Class 1</MenuItem>
                        <MenuItem value={'class2'}>Class 2</MenuItem>
                        <MenuItem value={'class3'}>Class 3</MenuItem>
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
                                                <DraggableRow
                                                    key={student.rollNo}
                                                    student={student}
                                                    section="sectionA"
                                                    moveStudent={moveStudent}
                                                />
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
                                                <DraggableRow
                                                    key={student.rollNo}
                                                    student={student}
                                                    section="sectionB"
                                                    moveStudent={moveStudent}
                                                />
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
                                                <DraggableRow
                                                    key={student.rollNo}
                                                    student={student}
                                                    section="sectionC"
                                                    moveStudent={moveStudent}
                                                />
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { width: '480px', borderRadius: '10px' } }}>
                <DialogTitle>Auto Allocate</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <FormControl variant="outlined" fullWidth margin="normal" size="small" >
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
                                size="small"
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
                        size="small"
                    />
                    <TextField
                        margin="normal"
                        label="Percentage for Section B"
                        type="number"
                        fullWidth
                        value={percentages.sectionB}
                        onChange={handlePercentageChange('sectionB')}
                        inputProps={{ max: 100 }}
                        size="small"
                    />
                    <TextField
                        margin="normal"
                        label="Percentage for Section C"
                        type="number"
                        fullWidth
                        value={percentages.sectionC}
                        onChange={handlePercentageChange('sectionC')}
                        inputProps={{ max: 100 }}
                        size="small"
                    />
                </DialogContent>
                <DialogActions className='dialog-actions'>
                    <Button onClick={handleClose} className='dialog-cancel-button' sx={{ textTransform: 'none' }}>
                        Cancel
                    </Button>
                    <Button onClick={handleAllocate} className='dialog-submit-button' sx={{ textTransform: 'none' }}>
                        Allocate
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default SectionAllocation;