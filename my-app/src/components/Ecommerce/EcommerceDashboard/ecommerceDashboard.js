import React, { useEffect, useState } from 'react';
import { Grid, Container, Button } from '@mui/material';
import Slider from "react-slick";
import './ecommerceDashboard.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import EcommerceNavbar from '../EcommerceNavbar/ecommerceNavbar';
import Categories from '../Categories/categories';
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const dashboardStyle = {
  padding: '20px',
  fontFamily: 'Arial, sans-serif',
};

const contentStyle = {
  marginTop: '80px',
  maxWidth: '1800px', // Adjust the maxWidth as needed
};

function EcommerceDashboard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8000/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const updateImageUrl = async (productId, imageUrl) => {
    try {
      const storage = getStorage();
      const imageRef = ref(storage, imageUrl);
      const url = await getDownloadURL(imageRef);
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId ? { ...product, imageUrls: [url] } : product
        )
      );
    } catch (error) {
      console.error("Error updating image URL:", error);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000, // 2 seconds,
    appendDots: dots => (
      <div style={{ position: 'absolute', bottom: '10px', width: '100%' }}>
        <ul style={{ margin: '0px' }}> {dots} </ul>
      </div>
    )
  };

  return (
    <div className="dashboardStyle" style={dashboardStyle}>
      <EcommerceNavbar />
      <Container style={contentStyle}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            {products.slice(0, 1).map((product) => (
              <div className='boxes' key={product.id} style={{ backgroundColor: '#f0f0f0', height: '507px', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
                {product.imageUrls && product.imageUrls.length > 0 ? (
                  <Slider {...settings} className="custom-slider">
                    {product.imageUrls.map((url, index) => (
                      <div key={index}>
                        <img src={url} alt={product.name} style={{ width: '100%', height: '507px', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <p>No image available</p>
                )}
                <Button className='buy-btn' style={{ position: 'absolute', bottom: '10px', left: '10px' }}>Buy Now</Button>
              </div>
            ))}
          </Grid>
          <Grid item xs={6}>
            <Grid container spacing={3}>
              {products.slice(1, 7).map((product) => (
                <Grid item xs={4} key={product.id}>
                  <div className='boxes' style={{ backgroundColor: '#f0f0f0', height: '242px', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
                    {product.imageUrls && product.imageUrls.length > 0 ? (
                      <img src={product.imageUrls[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <p>No image available</p>
                    )}
                    <Button className='buy-btn' style={{ position: 'absolute', bottom: '10px', left: '10px' }}>Buy Now</Button>
                  </div>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
        <Categories />
      </Container>
    </div>
  );
}
export default EcommerceDashboard;