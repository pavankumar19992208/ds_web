import React, { useEffect, useState } from 'react';
import { Grid, Container } from '@mui/material';
import './ecommerceDashboard.css';
import EcommerceNavbar from '../EcommerceNavbar/ecommerceNavbar';

const dashboardStyle = {
  padding: '20px',
  fontFamily: 'Arial, sans-serif',
};

const contentStyle = {
  marginTop: '20px',
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

  return (
    <div style={dashboardStyle}>
      <EcommerceNavbar />
      <Container style={contentStyle}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            {products.slice(0, 1).map((product) => (
              <div key={product.id} style={{ backgroundColor: '#f0f0f0', height: '507px', borderRadius: '12px', overflow: 'hidden' }}>
                {product.imageUrls && product.imageUrls.length > 0 ? (
                  <img src={product.imageUrls[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <p>No image available</p>
                )}
              </div>
            ))}
          </Grid>
          <Grid item xs={6}>
            <Grid container spacing={3}>
              {products.slice(1, 5).map((product) => (
                <Grid item xs={6} key={product.id}>
                  <div style={{ backgroundColor: '#f0f0f0', height: '242px', borderRadius: '12px', overflow: 'hidden' }}>
                    {product.imageUrls && product.imageUrls.length > 0 ? (
                      <img src={product.imageUrls[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <p>No image available</p>
                    )}
                  </div>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default EcommerceDashboard;