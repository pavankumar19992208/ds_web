import React, { useState } from 'react';

const sampleReportCards = [
  { id: 1, name: 'Pavan Kumar', grade: 'A', comments: 'Excellent performance' },
  { id: 2, name: 'Pramod', grade: 'B', comments: 'Good effort' },
  { id: 3, name: 'Ram', grade: 'C', comments: 'Needs improvement' },
];

const bookImages = [
  { id: 1, src: 'path/to/book1.jpg', alt: 'Book 1' },
  { id: 2, src: 'path/to/book2.jpg', alt: 'Book 2' },
  { id: 3, src: 'path/to/book3.jpg', alt: 'Book 3' },
];

export default function TeacherServices(props) {
  const [reportCards, setReportCards] = useState(sampleReportCards);
  const [showReportCards, setShowReportCards] = useState(false);
  const [showUploadHomework, setShowUploadHomework] = useState(false);

  const handleReportCardsClick = () => {
    setShowReportCards(true);
    setShowUploadHomework(false);
  };

  const handleUploadHomeworkClick = () => {
    setShowUploadHomework(true);
    setShowReportCards(false);
  };

  const handleBackClick = () => {
    setShowReportCards(false);
    setShowUploadHomework(false);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
      <p style={{ margin: 0, fontWeight: 'bold' }}>Welcome to Teacher Services</p>
      {!showReportCards && !showUploadHomework && (
        <>
          <button 
            onClick={handleReportCardsClick} 
            style={{ 
              display: 'block', 
              width: '100%', 
              padding: '10px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer', 
              marginTop: '20px' 
            }}
          >
            Student Report Cards
          </button>
          <button 
            onClick={handleUploadHomeworkClick} 
            style={{ 
              display: 'block', 
              width: '100%', 
              padding: '10px', 
              backgroundColor: '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer', 
              marginTop: '20px' 
            }}
          >
            Upload Homework
          </button>
        </>
      )}
      {showReportCards && (
        <div>
          <button 
            onClick={handleBackClick} 
            style={{ 
              display: 'block', 
              width: '100%', 
              padding: '10px', 
              backgroundColor: '#dc3545', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer', 
              marginTop: '20px' 
            }}
          >
            Back
          </button>
          {reportCards.map((report) => (
            <div key={report.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0', borderRadius: '5px' }}>
              <p><b>Student Name:</b> {report.name}</p>
              <p><b>Grade:</b> {report.grade}</p>
              <p><b>Comments:</b> {report.comments}</p>
            </div>
          ))}
        </div>
      )}
      {showUploadHomework && (
        <div>
          <button 
            onClick={handleBackClick} 
            style={{ 
              display: 'block', 
              width: '100%', 
              padding: '10px', 
              backgroundColor: '#dc3545', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer', 
              marginTop: '20px' 
            }}
          >
            Back
          </button>
          <p>Upload Homework for Students</p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {bookImages.map((book) => (
              <img key={book.id} src={book.src} alt={book.alt} style={{ width: '100px', height: '150px', borderRadius: '5px' }} />
            ))}
          </div>
          {/* Add your upload homework form or functionality here */}
        </div>
      )}
    </div>
  );
}