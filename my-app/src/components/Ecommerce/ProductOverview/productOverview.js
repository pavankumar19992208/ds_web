import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EcommerceNavbar from '../EcommerceNavbar/ecommerceNavbar';
import './productOverview.css';

const ProductOverview = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8000/products/${productId}`);
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

  return (
    <div className="product-overview">
      <EcommerceNavbar />
      <div className="product-overview-grid">
        <div className="product-image">
          <img src={product.mainImageUrl} alt={product.name} />
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
    </div>
  );
};

export default ProductOverview;