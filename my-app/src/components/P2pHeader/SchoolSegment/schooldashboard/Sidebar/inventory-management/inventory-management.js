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
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';

const categories = {
  "Academic Materials": ["Textbooks", "Reference Books", "Teaching Aids", "Classroom Stationery (chalk, markers, whiteboard supplies)"],
  "Office Supplies": ["Writing Instruments (pens, pencils, markers)", "Paper Products (notebooks, copier paper, envelopes)", "Filing and Storage (files, folders, organizers)", "General Office Items (staplers, tape dispensers, scissors)"],
  "Technology and Electronics": ["Computers and Laptops", "Projectors and Screens", "Printers and Scanners", "Audio-Visual Equipment (microphones, speakers, cameras)", "Networking Equipment (routers, modems)"],
  "Furniture": ["Desks and Chairs (for classrooms and offices)", "Cabinets and Shelves", "Student Lockers", "Staff Room Furniture", "Meeting Room Furniture (tables, podiums)"],
  "Cleaning and Maintenance Supplies": ["Cleaning Equipment (mops, brooms, vacuum cleaners)", "Cleaning Agents (detergents, disinfectants)", "Waste Management (bins, recycling containers)"],
  "Facilities and Utilities": ["Lighting Equipment (bulbs, fixtures)", "Heating and Cooling (AC units, heaters)", "Plumbing Supplies (faucets, pipes)", "Repair Tools and Equipment (toolkits, hammers)"],
  "Sports and Extracurricular Equipment": ["Sports Gear (balls, rackets, nets)", "Gym Equipment (weights, mats)", "Art Supplies (paints, brushes, canvases)", "Musical Instruments"],
  "Laboratory Supplies (if applicable)": ["Chemicals and Reagents", "Lab Instruments (microscopes, thermometers)", "Glassware (beakers, test tubes)", "Safety Gear (gloves, goggles)"],
  "Uniforms and Apparel": ["Student Uniforms", "Staff Uniforms (janitorial, security staff)", "Sports Team Apparel"]
};

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

function createData(id, itemName, quantity, category, subcategory, status) {
  return { id, itemName, quantity, category, subcategory, status };
}

const initialRows = [
  createData('I001', 'Projector', 10, 'Technology and Electronics', 'Projectors and Screens', 'Available'),
  createData('I002', 'Whiteboard', 15, 'Furniture', 'Meeting Room Furniture', 'Available'),
  createData('I003', 'Laptop', 5, 'Technology and Electronics', 'Computers and Laptops', 'In Use'),
  createData('I004', 'Desk', 20, 'Furniture', 'Desks and Chairs', 'Available'),
];

export default function InventoryManagement() {
  const [rows, setRows] = React.useState(initialRows);
  const [open, setOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [newItem, setNewItem] = React.useState({ id: '', itemName: '', quantity: '', category: '', subcategory: '', status: '' });
  const [subCategories, setSubCategories] = React.useState([]);
  const navigate = useNavigate();

  const handleOpen = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleEdit = (idx) => {
    const item = rows[idx];
    setSelectedRow(item);
    setSubCategories(categories[item.category] || []);
    setIsEditing(true);
    setOpen(true);
  };

  const handleSave = () => {
    if (isEditing) {
      const updatedRows = rows.map((row) => (row.id === selectedRow.id ? selectedRow : row));
      setRows(updatedRows);
    } else {
      setRows([...rows, newItem]);
    }
    setOpen(false);
    setIsEditing(false);
    setNewItem({ id: '', itemName: '', quantity: '', category: '', subcategory: '', status: '' });
  };

  const handleDelete = (idx) => {
    const updatedRows = rows.filter((row, i) => i !== idx);
    setRows(updatedRows);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      setSubCategories(categories[value]);
      if (isEditing) {
        setSelectedRow({ ...selectedRow, [name]: value, subcategory: '' });
      } else {
        setNewItem({ ...newItem, [name]: value, subcategory: '' });
      }
    } else {
      if (isEditing) {
        setSelectedRow({ ...selectedRow, [name]: value });
      } else {
        setNewItem({ ...newItem, [name]: value });
      }
    }
  };

  return (
    <React.Fragment>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px', height: '80vh' }}>
        <Paper style={{ width: '85%' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setIsEditing(false);
                setOpen(true);
              }}
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
              Add Item
            </Button>
          </div>
          <TableContainer sx={{ maxHeight: 'calc(100% - 60px)' }}>
            <Table stickyHeader sx={{ minWidth: 650 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>ID</StyledTableCell>
                  <StyledTableCell>Item Name</StyledTableCell>
                  <StyledTableCell>Quantity</StyledTableCell>
                  <StyledTableCell>Category</StyledTableCell>
                  <StyledTableCell>Subcategory</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell>Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, idx) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell component="th" scope="row">
                      {row.id}
                    </StyledTableCell>
                    <StyledTableCell>{row.itemName}</StyledTableCell>
                    <StyledTableCell>{row.quantity}</StyledTableCell>
                    <StyledTableCell>{row.category}</StyledTableCell>
                    <StyledTableCell>{row.subcategory}</StyledTableCell>
                    <StyledTableCell>{row.status}</StyledTableCell>
                    <StyledTableCell>
                      <IconButton onClick={() => handleEdit(idx)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(idx)}>
                        <DeleteIcon />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Item' : 'Add New Item'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="ID"
            type="text"
            fullWidth
            name="id"
            value={isEditing ? selectedRow.id : newItem.id}
            onChange={handleChange}
            disabled={isEditing}
          />
          <TextField
            margin="dense"
            label="Item Name"
            type="text"
            fullWidth
            name="itemName"
            value={isEditing ? selectedRow.itemName : newItem.itemName}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            name="quantity"
            value={isEditing ? selectedRow.quantity : newItem.quantity}
            onChange={handleChange}
          />
          <Select
            margin="dense"
            label="Category"
            fullWidth
            name="category"
            value={isEditing ? selectedRow.category : newItem.category}
            onChange={handleChange}
            displayEmpty
          >
            <MenuItem value="" disabled>
              <em>Select Category</em>
            </MenuItem>
            {Object.keys(categories).map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
          <Select
            margin="dense"
            label="Subcategory"
            fullWidth
            name="subcategory"
            value={isEditing ? selectedRow.subcategory : newItem.subcategory}
            onChange={handleChange}
            displayEmpty
            disabled={!subCategories.length}
          >
            <MenuItem value="" disabled>
              <em>Select Subcategory</em>
            </MenuItem>
            {subCategories.map((subcategory) => (
              <MenuItem key={subcategory} value={subcategory}>
                {subcategory}
              </MenuItem>
            ))}
          </Select>
          <TextField
            margin="dense"
            label="Status"
            type="text"
            fullWidth
            name="status"
            value={isEditing ? selectedRow.status : newItem.status}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}