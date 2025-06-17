import React, { useContext, useEffect, useState } from 'react';
import { Grid, Container, Button, Typography } from '@mui/material';
import Slider from "react-slick";
import { useNavigate } from 'react-router-dom';
import './ecommerceDashboard.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import EcommerceNavbar from '../EcommerceNavbar/ecommerceNavbar';
import Categories from '../Categories/categories';
import Lottie from 'lottie-react';
import loadingAnimation from '../loader/loader.json';
import BaseUrl from '../../../config';
import AuthWrapper from '../Authentication/AuthWrapper';
import { GlobalStateContext } from '../GlobalState';

const dashboardStyle = {
  fontFamily: 'Arial, sans-serif',
};

const contentStyle = {
  marginTop: '90px',
  maxWidth: '1800px',
};

const loaderStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  width: '100vw',
  position: 'fixed',
  top: 0,
  left: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  zIndex: 9999
};

function EcommerceDashboard() {
  const [demandedProducts, setDemandedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const { user, isAuthenticated, loginUser, logoutUser } = useContext(GlobalStateContext);
  const navigate = useNavigate();

  // Fetch user data after login
  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.id) {
        try {
          const res = await fetch(`${BaseUrl}/user/${user.id}`);
          if (res.ok) {
            const data = await res.json();
            setUserData(data);
          }
        } catch (err) {
          console.error('Failed to fetch user data:', err);
        }
      }
    };
    fetchUserData();
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [productsResponse, demandedResponse] = await Promise.all([
          fetch(`${BaseUrl}/products`),
          fetch(`${BaseUrl}/demanded-products`)
        ]);
        const productsData = await productsResponse.json();
        const demandedData = await demandedResponse.json();
        setDemandedProducts(demandedData.length > 0 ? demandedData : productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    appendDots: dots => (
      <div style={{ position: 'absolute', bottom: '10px', width: '100%' }}>
        <ul style={{ margin: '0px' }}> {dots} </ul>
      </div>
    )
  };

  const handleGridClick = (productId) => {
    navigate(`/product-overview/${productId}`);
  };

  const handleCloseAuth = () => {
    setShowAuth(false);
  };

  const handleOpenAuth = () => {
    setShowAuth(true);
  };

  if (isLoading) {
    return (
      <div style={loaderStyle}>
        <Lottie 
          animationData={loadingAnimation} 
          loop={true} 
          style={{ width: 300, height: 300 }}
        />
      </div>
    );
  }

  // Ensure we have at least 6 products to display
  const productsToDisplay = demandedProducts.length >= 6 ? demandedProducts : [
    ...demandedProducts,
    ...Array(6 - demandedProducts.length).fill({ id: `placeholder-${Math.random()}`, isPlaceholder: true })
  ];

  return (
    <div className="dashboardStyle" style={dashboardStyle}>
      <EcommerceNavbar onLoginClick={handleOpenAuth} />
      <Container style={contentStyle}>
        {isAuthenticated && userData && (
          <div style={{ background: '#fefae0', border: '1px #fefae0', padding: '10px 22px', borderRadius: '200px' }}>
            <Typography style={{ fontWeight: '600'}}>Welcome, {userData.name}!</Typography>
          </div>
        )}
        
        <div className="new-container">
          <div className="new-main-area">
            <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
              {/* Box 1 - Main featured product with name and buy button */}
              <div className="new-box-1" onClick={() => productsToDisplay[0]?.id && !productsToDisplay[0]?.isPlaceholder && handleGridClick(productsToDisplay[0].id)}>
                <div className="box-1-content">
                  <div className="box-1-text">
                    <h3>{productsToDisplay[0]?.name || "Featured Product"}</h3>
                    <button className="buy-now-button">Buy Now</button>
                  </div>
                  <div className="box-1-image">
                    {productsToDisplay[0]?.mainImageUrl ? (
                      <img src={productsToDisplay[0].mainImageUrl} alt={productsToDisplay[0].name}/>
                    ) : (
                      <div className="placeholder-image">No image available</div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="new-bottom-container">
                <div className="new-bottom-row">
                  {/* Box 4 */}
                  <div 
                    className="new-box-4" 
                    onClick={() => productsToDisplay[3]?.id && !productsToDisplay[3]?.isPlaceholder && handleGridClick(productsToDisplay[3].id)}
                  >
                    {productsToDisplay[3]?.mainImageUrl ? (
                      <>
                        <img src={productsToDisplay[3].mainImageUrl} alt={productsToDisplay[3].name}/>
                        <div className="slider-arrows">
                          <span className="arrow right">→</span>
                        </div>
                      </>
                    ) : (
                      <div className="placeholder-image">No image available</div>
                    )}
                  </div>
                  
                  {/* Box 5 */}
                  <div 
                    className="new-box-5" 
                    onClick={() => productsToDisplay[4]?.id && !productsToDisplay[4]?.isPlaceholder && handleGridClick(productsToDisplay[4].id)}
                  >
                    {productsToDisplay[4]?.mainImageUrl ? (
                      <>
                        <img src={productsToDisplay[4].mainImageUrl} alt={productsToDisplay[4].name}/>
                        <div className="slider-arrows">
                          <span className="arrow right">→</span>
                        </div>
                      </>
                    ) : (
                      <div className="placeholder-image">No image available</div>
                    )}
                  </div>
                  
                  {/* Box 6 */}
                  <div 
                    className="new-box-6" 
                    onClick={() => productsToDisplay[5]?.id && !productsToDisplay[5]?.isPlaceholder && handleGridClick(productsToDisplay[5].id)}
                  >
                    {productsToDisplay[5]?.mainImageUrl ? (
                      <>
                        <img src={productsToDisplay[5].mainImageUrl} alt={productsToDisplay[5].name}/>
                        <div className="slider-arrows">
                          <span className="arrow right">→</span>
                        </div>
                      </>
                    ) : (
                      <div className="placeholder-image">No image available</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="new-side-column">
              {/* Box 2 */}
              <div 
                className="new-box-2" 
                onClick={() => productsToDisplay[1]?.id && !productsToDisplay[1]?.isPlaceholder && handleGridClick(productsToDisplay[1].id)}
              >
                {productsToDisplay[1]?.mainImageUrl ? (
                  <>
                    <img src={productsToDisplay[1].mainImageUrl} alt={productsToDisplay[1].name}/>
                    <div className="slider-arrows">
                      <span className="arrow right">→</span>
                    </div>
                  </>
                ) : (
                  <div className="placeholder-image">No image available</div>
                )}
              </div>
              
              {/* Box 3 */}
              <div 
                className="new-box-3" 
                onClick={() => productsToDisplay[2]?.id && !productsToDisplay[2]?.isPlaceholder && handleGridClick(productsToDisplay[2].id)}
              >
                {productsToDisplay[2]?.mainImageUrl ? (
                  <>
                    <img src={productsToDisplay[2].mainImageUrl} alt={productsToDisplay[2].name}/>
                    <div className="slider-arrows">
                      <span className="arrow right">→</span>
                    </div>
                  </>
                ) : (
                  <div className="placeholder-image">No image available</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Categories />
      </Container>
      
      {/* Auth modal - only shown when explicitly triggered */}
      {showAuth && (
        <AuthWrapper onClose={handleCloseAuth} />
      )}
    </div>
  );
}

export default EcommerceDashboard;