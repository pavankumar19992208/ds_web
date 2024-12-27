import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EcommerceNavbar from '../EcommerceNavbar/ecommerceNavbar';
import './cartPage.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch('http://localhost:8001/cart/1');
        const data = await response.json();
        setCartItems(data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    const fetchProducts = async () => {
        try {
          const response = await fetch('http://localhost:8001/products');
          const data = await response.json();
          setProducts(data);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      };

    fetchCartItems();
    fetchProducts();
  }, []);

  const getProductDetails = (productId) => {
    return products.find(product => product.id === productId);
  };

  return (
    <>
      <EcommerceNavbar />
      <div className="cart-page">
        {cartItems.length > 0 ? (
          cartItems.map((item) => {
            const product = getProductDetails(item.id);
            return product ? (
              <div key={item.id} className="cart-item">
                <div className="image-container">
                  {product.mainImageUrl && (
                    <img src={product.mainImageUrl} alt={`Product`} className="image" />
                  )}
                </div>
                <div className="product-details">
                  <h2>{product.name}</h2>
                  <p>Price: <span className='price'>₹{product.price}</span></p>
                  <p>Quantity: {item.quantity}</p>
                </div>
              </div>
            ) : null;
          })
        ) : (
          <p>Your cart is empty</p>
        )}
      </div>
    </>
  );
};

export default CartPage;