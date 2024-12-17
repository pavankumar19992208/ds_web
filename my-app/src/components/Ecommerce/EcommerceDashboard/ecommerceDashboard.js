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
  const [demandedProducts, setDemandedProducts] = useState([]);

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

    const fetchDemandedProducts = async () => {
      try {
        const response = await fetch("http://localhost:8000/demanded-products");
        const data = await response.json();
        setDemandedProducts(data);
      } catch (error) {
        console.error("Error fetching demanded products:", error);
      }
    };

    fetchProducts();
    fetchDemandedProducts();
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
            {demandedProducts.length > 0 && (
              <div className='boxes' key={demandedProducts[0].id} style={{ backgroundColor: '#f0f0f0', height: '507px', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
                {demandedProducts[0].imageUrls && demandedProducts[0].imageUrls.length > 0 ? (
                  <Slider {...settings} className="custom-slider">
                    {demandedProducts[0].imageUrls.map((url, index) => (
                      <div key={index}>
                        <img src={url} alt={demandedProducts[0].name} style={{ width:'100%', height: '508px', objectFit: 'contain'}} />
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <p>No image available</p>
                )}
                <Button className='buy-btn' style={{ position: 'absolute', bottom: '10px', left: '10px' }}>Buy Now</Button>
              </div>
            )}
          </Grid>
          <Grid item xs={6}>
            <Grid container spacing={3}>
              {demandedProducts.slice(1, 7).map((product) => (
                <Grid item xs={4} key={product.id}>
                  <div className='boxes' style={{ backgroundColor: '#f0f0f0', height: '242px', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
                    {product.mainImageUrl ? (
                      <img src={product.mainImageUrl} alt={product.name} style={{ display: 'block', margin: 'auto', width: '90%', height: '100%', objectFit: 'contain' }} />
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