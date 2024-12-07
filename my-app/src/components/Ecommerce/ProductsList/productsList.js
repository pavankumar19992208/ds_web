import React, { useEffect, useState } from 'react';
import './productsList.css';

const ProductsList = () => {
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

  const handleAddToCart = (productId) => {
    console.log(`Add to Cart clicked for product ID: ${productId}`);
    // Implement add to cart functionality here
  };

  const handleAddToFavourites = (productId) => {
    console.log(`Add to Favourites clicked for product ID: ${productId}`);
    // Implement add to favourites functionality here
  };

  return (
    <div className="dashboard">
        {/* <EcommerceNavbar /> */}
      <div className="product-list">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="product">
              <div className="image-container">
                {product.mainImageUrl && (
                  <img src={product.mainImageUrl} alt={`Product`} className="image" />
                )}
              </div>
              <div className="product-details">
                <h2>{product.name}</h2>
                <p>Price: <span className='price'>₹{product.price}</span></p>
                <p className='stock'>Stock: {product.stock}</p>
                <button className="add-to-cart" onClick={() => handleAddToCart(product.id)}>Add to Cart</button>
                <button className="add-to-favourites" onClick={() => handleAddToFavourites(product.id)}>Add to Favourites</button>
              </div>
            </div>
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
    </div>
  );
};

export default ProductsList;