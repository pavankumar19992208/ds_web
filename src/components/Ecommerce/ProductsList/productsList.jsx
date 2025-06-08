import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import EcommerceNavbar from '../EcommerceNavbar/ecommerceNavbar';
import BaseUrl from '../../../config';
import './productsList.css';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const category = params.get('category');
        const search = params.get('search');
        let url = `${BaseUrl}/products`;
        if (category) {
          url += `?category=${category}`;
        } else if (search) {
          url += `?keywords=${search}`;
        }
        const response = await fetch(url);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [location.search]);

  const handleAddToCart = async (productId) => {
    console.log(`Add to Cart clicked for product ID: ${productId}`);
    // Implement add to cart functionality here
    try {
      const response = await fetch(`${BaseUrl}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: 1, id: productId, quantity: 1 })
      });
      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }
      console.log('Product added to cart');
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleAddToFavourites = (productId) => {
    console.log(`Add to Favourites clicked for product ID: ${productId}`);
    // Implement add to favourites functionality here
  };

  const handleProductClick = (productId) => {
    navigate(`/product-overview/${productId}`);
  };

  return (
    <>
    <EcommerceNavbar />
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
                <h2 onClick={() => handleProductClick(product.id)}>{product.name}</h2>
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
    
    </>
  );
};

export default ProductsList;