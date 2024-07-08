import React, { useState, useEffect } from 'react';
import './ImageSlider.css'

const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); // Cycle through images
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [images.length]);

  return (
    <div className="item">
      <div className="image-container">
        <img src={images[currentIndex]} alt="Description" className='img_slider'/>
      </div>
    </div>
  );
};

export default ImageSlider;