import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EcommerceNavbar from '../EcommerceNavbar/ecommerceNavbar';
import './cartPage.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BaseUrl from '../../../config';


const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch(`${BaseUrl}/cart/1`);
        const data = await response.json();
        setCartItems(data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        toast.error("Failed to load cart items");
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BaseUrl}/products`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
      }
    };

    fetchCartItems();
    fetchProducts();
  }, []);

  const getProductDetails = (productId) => {
    return products.find(product => product.id === productId);
  };

  const confirmRemoveItem = (productId) => {
    setItemToRemove(productId);
    setShowConfirmModal(true);
  };

  const handleRemoveItem = async () => {
    if (!itemToRemove) return;
    
    try {
      const response = await fetch(`${BaseUrl}/cart/1/${itemToRemove}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setCartItems(cartItems.filter(item => item.id !== itemToRemove));
        toast.success("Item removed from cart successfully");
      } else {
        throw new Error('Failed to remove item');
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast.error("Failed to remove item from cart");
    } finally {
      setShowConfirmModal(false);
      setItemToRemove(null);
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    const quantity = Math.max(1, newQuantity);
    try {
      const response = await fetch(`${BaseUrl}/cart/1/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });
      if (!response.ok) throw new Error('Failed to update quantity');
      setCartItems(cartItems.map(item => 
        item.id === productId ? { ...item, quantity } : item
      ));
      toast.success("Quantity updated successfully");
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
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
    if (cartItems.length === 0) {
      toast.warning("Your cart is empty");
      return;
    }
    
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
      const response = await fetch(`${BaseUrl}/orders/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) throw new Error('Failed to create order');

      const result = await response.json();
      
      // Clear cart after successful order creation
      await Promise.all(
        cartItems.map(item => 
          fetch(`${BaseUrl}/cart/1/${item.id}`, { method: 'DELETE' })
        )
      );
      
      setCartItems([]);
      toast.success("Order placed successfully!");
      navigate(`/order-confirmation/${result.order_id}`);
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product-overview/${productId}`);
  };

  const navigateToOrders = () => {
    navigate('/orders');
  };

// In cartPage.jsx, modify the handlePayment function:
const handlePayment = () => {
  navigate('/checkout', {
    state: {
      items: cartItems.map(item => {
        const product = getProductDetails(item.id);
        return {
          id: item.id,
          name: product?.name || 'Unknown Product',
          price: product?.price || 0,
          quantity: item.quantity
        };
      }),
      subtotal: calculateSubtotal()
    }
  });
};

  return (
    <>
      <EcommerceNavbar />
      <div className="cart-page">
        <div className="cart-items-container">
          <div className="cart-header">
            <h2>Your Shopping Cart</h2>
          </div>
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
                      onClick={() => confirmRemoveItem(item.id)}
                      className="remove-button"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : null;
            })
          ) : (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <button 
                onClick={() => navigate('/ecommerce-dashboard')}
                className="continue-shopping-button"
              >
                Continue Shopping
              </button>
            </div>
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
              onClick={handlePayment}
              className="checkout-button"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="modal-overlay">
            <div className="confirmation-modal">
              <h3>Confirm Removal</h3>
              <p>Are you sure you want to remove this item from your cart?</p>
              <div className="modal-buttons">
                <button 
                  onClick={() => {
                    setShowConfirmModal(false);
                    setItemToRemove(null);
                  }}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleRemoveItem}
                  className="confirm-button"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;