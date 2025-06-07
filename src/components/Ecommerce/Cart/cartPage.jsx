import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EcommerceNavbar from '../EcommerceNavbar/ecommerceNavbar';
import './cartPage.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const handleRemoveItem = async (productId) => {
    try {
      const response = await fetch(`http://localhost:8001/cart/1/${productId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setCartItems(cartItems.filter(item => item.id !== productId));
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    const quantity = Math.max(1, newQuantity);
    try {
      const response = await fetch(`http://localhost:8001/cart/1/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });
      if (!response.ok) throw new Error('Failed to update quantity');
      setCartItems(cartItems.map(item => 
        item.id === productId ? { ...item, quantity } : item
      ));
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const product = getProductDetails(item.id);
      return product ? total + (product.price * item.quantity) : total;
    }, 0);
  };

  const calculateTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    
    setLoading(true);
    try {
      // Prepare order data
      const orderData = {
        user_id: 1, // Hardcoded for now, replace with actual user ID
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        })),
        shipping_address: "123 Main St, Anytown, USA", // Replace with actual address
        payment_method: "Credit Card" // Replace with actual payment method
      };

      // Create order
      const response = await fetch('http://localhost:8001/orders/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) throw new Error('Failed to create order');

      const result = await response.json();
      
      // Clear cart after successful order creation
      await Promise.all(
        cartItems.map(item => 
          fetch(`http://localhost:8001/cart/1/${item.id}`, { method: 'DELETE' })
        )
      );
      
      setCartItems([]);
      navigate(`/order-confirmation/${result.order_id}`);
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product-overview/${productId}`);
  };

  return (
    <>
      <EcommerceNavbar />
      <div className="cart-page">
        <div className="cart-items-container">
          <h1>Your Shopping Cart</h1>
          {cartItems.length > 0 ? (
            cartItems.map((item) => {
              const product = getProductDetails(item.id);
              return product ? (
                <div key={item.id} className="cart-item">
                  <div className="image-container">
                    {product.mainImageUrl && (
                      <img 
                        src={product.mainImageUrl} 
                        alt={product.name} 
                        className="image" 
                        onClick={() => handleProductClick(product.id)}
                      />
                    )}
                  </div>
                  <div className="product-details">
                    <h2 onClick={() => handleProductClick(product.id)}>{product.name}</h2>
                    <p>Price: <span className='price'>₹{product.price}</span></p>
                    <div className="quantity-selector">
                      <label>Quantity:</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                      />
                    </div>
                    <button 
                      onClick={() => handleRemoveItem(item.id)}
                      className="remove-button"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : null;
            })
          ) : (
            <p>Your cart is empty</p>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-summary">
            <h2>Cart Summary</h2>
            <div className="summary-item">
              <span>Total Items:</span>
              <span>{calculateTotalItems()}</span>
            </div>
            <div className="summary-item">
              <span>Subtotal:</span>
              <span>₹{calculateSubtotal()}</span>
            </div>
            <button 
              onClick={handleCheckout}
              className="checkout-button"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;