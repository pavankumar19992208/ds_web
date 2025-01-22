import React from 'react';
import Slider from 'react-slick';
import { Box } from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './ImageCarousel.css';

// Import local images
import image1 from './sch_img1.jpg';
import image2 from './sch_img2.jpg';
import image3 from './sch_img3.jpg';

const images = [
  image1,
  image2,
  image3,
];

const ImageCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 800, margin: '0 auto' }}>
      <Slider {...settings}>
        {images.map((image, index) => (
          <Box key={index} component="img" src={image} alt={`Slide ${index + 1}`} className="carousel-image" />
        ))}
      </Slider>
    </Box>
  );
};

export default ImageCarousel;