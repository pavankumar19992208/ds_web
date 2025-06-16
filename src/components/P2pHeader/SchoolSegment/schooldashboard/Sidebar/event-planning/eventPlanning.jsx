import React, { useState } from 'react';
import Navbar from '../../Navbar/Navbar';
import Sidebar from '../../Sidebar/Sidebar';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import './eventPlanning.css'; // Import the form component
import { GlobalStateContext } from '../../../../../../GlobalStateContext';

const EventPlanning = () => {
  const { globalData } = React.useContext(GlobalStateContext);
  const [eventNumber, setEventNumber] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imagePreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prevImages) => [...prevImages, ...imagePreviews]); // Append new images to the existing ones
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      eventNumber,
      title,
      description,
      images: images.map((img) => img.file), // Only send the file objects
    });
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index)); // Remove image by index
  };

  return (
    <div className="school-dashboard">
      <div className="ep-homepage">
        <Navbar schoolName={globalData.data.school_name} schoolLogo={globalData.data.school_logo} />
        <Sidebar visibleItems={['home', 'attachDocument', 'subjectAllocation', 'attendanceTracking', 'leaveApprovals', 'academicPerformance', 'teacherAlert', 'eventPlanning', 'careerGuidance', 'inventoryManagement']} />
        <main className="ep-main-content">
          <h2>Event Planning</h2>
          <div className="event-form-container">
            <form className="event-form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <TextField
                    select
                    id="event-number"
                    label="Event Number"
                    value={eventNumber}
                    onChange={(e) => setEventNumber(e.target.value)}
                    fullWidth
                    required
                  >
                    <MenuItem value="">Select Event Number</MenuItem>
                    <MenuItem value="1">Event 1</MenuItem>
                    <MenuItem value="2">Event 2</MenuItem>
                    <MenuItem value="3">Event 3</MenuItem>
                    <MenuItem value="4">Event 4</MenuItem>
                    <MenuItem value="5">Event 5</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    id="event-title"
                    label="Event Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter event title"
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="event-description"
                    label="Event Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter detailed description of the event"
                    multiline
                    rows={4}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <label htmlFor="event-images" className="ep-file-upload-label">
                    Upload Images
                  </label>
                  <input
                    type="file"
                    id="event-images"
                    multiple
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="ep-file-upload-input"
                  />
                  <small className="form-text text-muted">
                    You can upload multiple images for this event
                  </small>
                  <div className="image-preview-container">
                    {images.map((img, index) => (
                      <div key={index} className="image-preview">
                        <img src={img.preview} alt={`Preview ${index}`} />
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() => handleRemoveImage(index)}
                        >
                          ✖
                        </button>
                      </div>
                    ))}
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <button type="submit" variant="contained" color="primary" fullWidth className="ep-save-btn">
                    Save Event
                  </button>
                </Grid>
              </Grid>
            </form>
          </div>
        </main>
        <div className="school-id-box">
          School ID: {globalData.data.SCHOOL_ID}
        </div>
      </div>
    </div>
  );
};

export default EventPlanning;