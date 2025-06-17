import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Slider from "react-slick";
import EcommerceNavbar from '../EcommerceNavbar/ecommerceNavbar';
import './productOverview.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Modal from 'react-modal';
import { ToastContainer } from 'react-toastify';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Lottie from 'lottie-react';
import loadingAnimation from '../loader/loader.json';
import BaseUrl from '../../../config';
import zIndex from '@mui/material/styles/zIndex';
import { GlobalStateContext } from '../GlobalState'; // <-- Import context

Modal.setAppElement('#root');

const ProductOverview = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const { user } = useContext(GlobalStateContext) || {}; // <-- Get user from context

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

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${BaseUrl}/products/${productId}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!user || !user.id) {
      toast.error("Please login to add to cart.");
      return;
    }
    try {
      const response = await fetch(`${BaseUrl}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id, // <-- Use logged-in user's id
          id: parseInt(productId),
          quantity: quantity
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add to cart');
      }

      const data = await response.json();
      
      toast.success(
        <div>
          {product.name} <span className="toast-bold-yellow">added to cart!</span>
        </div>, 
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
      
      setIsAddedToCart(true);
      setTimeout(() => {
        setIsAddedToCart(false);
      }, 3000);
      
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const toggleDescription = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const renderDescription = () => {
    if (!product) return '';
    if (isDescriptionExpanded || product.description.length <= 300) {
      return product.description;
    }
    return `${product.description.substring(0, 300)}...`;
  };

  // Slider arrows components
  const NextArrow = ({ onClick }) => (
    <div className="slick-arrow slick-next" onClick={onClick}>Next</div>
  );
  
  const PrevArrow = ({ onClick }) => (
    <div className="slick-arrow slick-prev" onClick={onClick}>Prev</div>
  );

  // Slider settings
  const sliderSettings = (arrows = false) => ({
    dots: product?.imageUrls?.length > 1,
    infinite: product?.imageUrls?.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: product?.imageUrls?.length > 1,
    autoplaySpeed: 2000,
    appendDots: dots => (
      <div style={{ position: 'absolute', bottom: '10px', width: '100%' }}>
        <ul style={{ margin: '0px' }}>{dots}</ul>
      </div>
    ),
    arrows,
    nextArrow: arrows ? <NextArrow /> : null,
    prevArrow: arrows ? <PrevArrow /> : null
  });
  
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

  if (isLoading) return <div className="loading">Loading product...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!product) return <div className="not-found">Product not found</div>;

  return (
    <>
      <EcommerceNavbar />
      <div className='product-overview-page'>
      <div className="product-overview-container">
        <ToastContainer 
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
        <div className="product-overview-grid">
          <div className="product-image-container">
            <Slider {...sliderSettings()} className="main-slider">
              {product.imageUrls?.map((url, index) => (
                <div key={index} className="slider-image-wrapper">
                  <img 
                    src={url} 
                    alt={product.name} 
                    className="product-image"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsModalOpen(true);
                    }}
                  />
                </div>
              ))}
            </Slider>
          </div>

          <div className="product-info-container">
            <div className="product-header">
              <h1>{product.name}</h1>
              <p className="product-price">₹{product.price}</p>
            </div>

            <div className="product-actions">
              <div className="quantity-selector">
                <label>Quantity:</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </div>

              <div className="action-buttons">
                <button className="fav-btn" onClick={() => toast.info("Added to favorites!")}>
                  Add to Favorites
                </button>
                <button 
                  className={`cart-btn ${isAddedToCart ? 'added-to-cart' : ''}`} 
                  onClick={handleAddToCart}
                  disabled={isAddedToCart}
                >
                  {isAddedToCart ? 'Added to Cart!' : 'Add to Cart'}
                </button>
                <button 
                  className="buy-now-btn" 
                  onClick={() => toast.info("Proceeding to checkout!")}
                >
                  Buy Now
                </button>
              </div>
               <div className="product-description-section">
              <h3>Description</h3>
              <div className="description-content">
                <span dangerouslySetInnerHTML={{ __html: renderDescription() }} />
                {product.description.length > 300 && (
                  <button 
                    onClick={toggleDescription} 
                    className="description-toggle"
                  >
                    {isDescriptionExpanded ? 'Show less' : 'Show more'}
                  </button>
                )}
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* Image Modal */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          className="image-modal"
          overlayClassName="modal-overlay"
        >
          <FaTimes 
            className="modal-close" 
            onClick={() => setIsModalOpen(false)} 
          />
          <Slider {...sliderSettings(true)} className="modal-slider">
            {product.imageUrls?.map((url, index) => (
              <div key={index} className="modal-slide">
                <img src={url} alt={product.name} className="modal-image" />
              </div>
            ))}
          </Slider>
        </Modal>
      </div>
      </div>
    </>
  );
};

export default ProductOverview;