import React, { useEffect, useState } from 'react';
import { Grid, Container, Button } from '@mui/material';
import Slider from "react-slick";
import { useNavigate } from 'react-router-dom';
import './ecommerceDashboard.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import EcommerceNavbar from '../EcommerceNavbar/ecommerceNavbar';
import Categories from '../Categories/categories';

const dashboardStyle = {
  fontFamily: 'Arial, sans-serif',
};

const contentStyle = {
  marginTop: '80px',
  maxWidth: '1800px', // Adjust the maxWidth as needed
};

function EcommerceDashboard() {
  const [demandedProducts, setDemandedProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8001/products");
        const data = await response.json();
        setDemandedProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchDemandedProducts = async () => {
      try {
        const response = await fetch("http://localhost:8001/demanded-products");
        const data = await response.json();
        setDemandedProducts(data);
      } catch (error) {
        console.error("Error fetching demanded products:", error);
      }
    };

    fetchProducts();
    fetchDemandedProducts();
  }, []);

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

  const handleGridClick = (productId) => {
    navigate(`/product-overview/${productId}`);
  };

  return (
    <div className="dashboardStyle" style={dashboardStyle}>
      <EcommerceNavbar />
      <Container style={contentStyle}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {demandedProducts.length > 0 && (
              <div className='demanded-container' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', borderRadius: '12px', padding: '20px', marginBottom: '20px', height: '60vh' }}>
                <div style={{ flex: '0 0 50%' }}>
                  <h3>{demandedProducts[0].name}</h3>
                  <Button style={{ left: '20%' }} variant="contained" color="primary" onClick={() => handleGridClick(demandedProducts[0].id)}>Buy Now</Button>
                </div>
                <div style={{ flex: '0 0 50%' }}>
                  {demandedProducts[0].mainImageUrl ? (
                    <img src={demandedProducts[0].mainImageUrl} alt={demandedProducts[0].name} style={{ width:'100%', height: '400px', objectFit: 'contain'}} />
                  ) : (
                    <p>No image available</p>
                  )}
                </div>
              </div>
            )}
          </Grid>
          <Grid item xs={6}>
            {demandedProducts.length > 0 && (
              <div className='boxes' key={demandedProducts[0].id} style={{ backgroundColor: '#fff', height: '416px', borderRadius: '12px', overflow: 'hidden', position: 'relative' }} onClick={() => handleGridClick(demandedProducts[0].id)}>
                {Array.isArray(demandedProducts[0].imageUrls) && demandedProducts[0].imageUrls.length > 0 ? (
                  <Slider {...settings} className="custom-slider">
                    {demandedProducts[0].imageUrls.map((url, index) => (
                      <div key={index}>
                        <img src={url} alt={demandedProducts[0].name} style={{ width:'100%', height: '400px', objectFit: 'contain'}} />
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <p>No image available</p>
                )}
              </div>
            )}
          </Grid>
          <Grid item xs={6}>
            <Grid container spacing={2}>
              {demandedProducts.slice(1, 7).map((product) => (
                <Grid item xs={4} key={product.id}>
                  <div className='boxes' style={{ backgroundColor: '#fff', height: '200px', borderRadius: '12px', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => handleGridClick(product.id)}>
                    {product.mainImageUrl ? (
                      <img src={product.mainImageUrl} alt={product.name} style={{ display: 'block', margin: 'auto', width: '90%', height: '90%', objectFit: 'contain' }} />
                    ) : (
                      <p>No image available</p>
                    )}
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