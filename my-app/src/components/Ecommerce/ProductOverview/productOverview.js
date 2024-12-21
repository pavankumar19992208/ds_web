import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Slider from "react-slick";
import EcommerceNavbar from '../EcommerceNavbar/ecommerceNavbar';
import './productOverview.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';

const ProductOverview = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8001/products/${productId}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  if (!product) {
    return <p>Loading...</p>;
  }

  const handleAddToCart = () => {
    console.log(`Add to Cart clicked for product ID: ${productId}`);
    // Implement add to cart functionality here
  };

  const handleAddToFavourites = () => {
    console.log(`Add to Favourites clicked for product ID: ${productId}`);
    // Implement add to favourites functionality here
  };

  const handleBuyNow = () => {
    console.log(`Buy Now clicked for product ID: ${productId}`);
    // Implement buy now functionality here
  };

  const toggleDescription = (e) => {
    e.preventDefault();
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const renderDescription = () => {
    if (isDescriptionExpanded || product.description.length <= 300) {
      return product.description;
    }
    return `${product.description.substring(0, 300)}...`;
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const NextArrow = (props) => {
    const { onClick } = props;
    return (
      <div className="slick-arrow slick-next" onClick={onClick} style={{ backgroundColor: 'gray', zIndex: 1, marginRight: '10px', padding: '12px 10px 10px' }}>
        Next
      </div>
    );
  };
  
  const PrevArrow = (props) => {
    const { onClick } = props;
    return (
      <div className="slick-arrow slick-prev" onClick={onClick} style={{ backgroundColor: 'gray', zIndex: 1, marginLeft: '10px', padding: '12px 10px 10px' }}>
        Prev
      </div>
    );
  };

  const mainSliderSettings = {
    dots: product.imageUrls.length > 1,
    infinite: product.imageUrls.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: product.imageUrls.length > 1,
    autoplaySpeed: 2000, // 2 seconds,
    appendDots: dots => (
      <div style={{ position: 'absolute', bottom: '10px', width: '100%' }}>
        <ul style={{ margin: '0px' }}> {dots} </ul>
      </div>
    ),
    arrows: false // Remove arrows from the main slider
  };

  const modalSliderSettings = {
    dots: product.imageUrls.length > 1,
    infinite: product.imageUrls.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: product.imageUrls.length > 1,
    autoplaySpeed: 2000, // 2 seconds,
    appendDots: dots => (
      <div style={{ position: 'absolute', bottom: '10px', width: '100%' }}>
        <ul style={{ margin: '0px' }}> {dots} </ul>
      </div>
    ),
    nextArrow: product.imageUrls.length > 1 ? <NextArrow /> : null,
    prevArrow: product.imageUrls.length > 1 ? <PrevArrow /> : null
  };

  return (
    <div className="product-overview">
      <EcommerceNavbar />
      <div className="product-overview-grid">
      <div className="product-image" onClick={openModal}>
          <Slider {...mainSliderSettings} className="custom-slider">
            {product.imageUrls.map((url, index) => (
              <div key={index}>
                <img src={url} alt={product.name} style={{ width:'100%', height: '508px', objectFit: 'contain'}} />
              </div>
            ))}
          </Slider>
        </div>
        <div className="product-info">
          <div className="product-details">
            <h1>{product.name}</h1>
            <p>Price: ₹{product.price}</p>
            <p>Stock: {product.stock}</p>
          </div>
          <div className="product-description-buttons">
            <div className="product-description">
              <p>Description: <br/><br/>{renderDescription()}</p>
              {product.description.length > 300 && (
                <a href="#" onClick={toggleDescription}>
                  {isDescriptionExpanded ? 'less' : 'more'}
                </a>
              )}
            </div>
            <div className="btns">
              <button onClick={handleAddToFavourites}>Add to Favourites</button>
              <button onClick={handleAddToCart}>Add to Cart</button>
              <button onClick={handleBuyNow}>Buy Now</button>
            </div>
          </div>
        </div>
      </div>
      <Modal
       isOpen={isModalOpen}
       onRequestClose={closeModal} 
       contentLabel="Product Images"
       style={{
        content: {
          top: '55%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '92%',
          height: '80%'
        }
      }}
      >
        <FaTimes onClick={closeModal} style={{ cursor: 'pointer', position: 'absolute', top: '10px', right: '10px', fontSize: '24px' }} />
        <Slider {...modalSliderSettings} className="custom-slider">
          {product.imageUrls.map((url, index) => (
            <div key={index}>
              <img src={url} alt={product.name} style={{ width:'100%', height: '508px', objectFit: 'contain'}} />
            </div>
          ))}
        </Slider>
      </Modal>
    </div>
  );
};

export default ProductOverview;