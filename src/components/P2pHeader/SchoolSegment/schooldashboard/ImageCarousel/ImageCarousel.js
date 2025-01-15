import React from 'react';
import Slider from 'react-slick';
import { Box } from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './ImageCarousel.css';

const images = [
  'https://via.placeholder.com/800x400?text=Image+1',
  'https://via.placeholder.com/800x400?text=Image+2',
  'https://via.placeholder.com/800x400?text=Image+3',
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
          <Box key={index} component="img" src={image} alt={`Slide ${index + 1}`} sx={{ width: '100%' }} />
        ))}
      </Slider>
    </Box>
  );
};

export default ImageCarousel;