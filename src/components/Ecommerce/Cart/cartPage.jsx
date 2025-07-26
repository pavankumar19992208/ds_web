import React, { useEffect, useState, useContext } from 'react';
import { data, useNavigate } from 'react-router-dom';
import EcommerceNavbar from '../EcommerceNavbar/ecommerceNavbar';
import './cartPage.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BaseUrl from '../../../config';
import Lottie from 'lottie-react';
import { FaTrash } from 'react-icons/fa';
import loadingAnimation from '../loader/loader.json';
import { GlobalStateContext } from '../GlobalState'; // <-- Import context

const 
loaderStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  width: '100vw',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 9999
};

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(GlobalStateContext); // <-- Get user

  useEffect(() => {
    if (!user || !user.id) return; // Wait for user to be available
    const fetchCartItems = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${BaseUrl}/cart/${user.id}`);
        const data = await response.json();
        setCartItems(data);
        // Initialize all items as selected by default
        setSelectedItems(data.map(item => item.id));
      } catch (error) {
        console.error("Error fetching cart items:", error);
        toast.error("Failed to load cart items");
      } finally {
        setIsLoading(false);
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
  }, [user]);

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
      const response = await fetch(`${BaseUrl}/cart/clear-selected/${user.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_ids: [itemToRemove] })
      });
      console.log("Response status:", response);
      if (response.ok) {
        setCartItems(cartItems.filter(item => item.id !== itemToRemove));
        setSelectedItems(selectedItems.filter(id => id !== itemToRemove));
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
      setIsLoading(true);
      const response = await fetch(`${BaseUrl}/cart/${user.id}/${productId}`, {
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
    } finally {
      setIsLoading(false);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      if (!selectedItems.includes(item.id)) return total;
      const product = getProductDetails(item.id);
      return product ? total + (product.price * item.quantity) : total;
    }, 0);
  };

  const calculateTotalItems = () => {
    return cartItems.reduce((total, item) => {
      return selectedItems.includes(item.id) ? total + item.quantity : total;
    }, 0);
  };

  const handleCheckout = async () => {
    const itemsToCheckout = cartItems.filter(item => selectedItems.includes(item.id));

    if (itemsToCheckout.length === 0) {
      toast.warning("Please select at least one item to checkout");
      return;
    }

    setLoading(true);
    try {
      // Prepare order data with only selected items
      const orderData = {
        user_id: user.id,
        items: itemsToCheckout.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        })),
        shipping_address: "123 Main St, Anytown, USA",
        payment_method: "Credit Card"
      };

      const response = await fetch(`${BaseUrl}/orders/public`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          items: itemsToCheckout.map(item => ({
            product_id: item.id,
            quantity: item.quantity
          }))
        })
      });

      if (!response.ok) throw new Error('Failed to create order');

      const result = await response.json();

      // Remove only the selected items from cart after successful order
      await Promise.all(
        itemsToCheckout.map(item =>
          fetch(`${BaseUrl}/cart/${user.id}/${item.id}`, { method: 'DELETE' })
        )
      );

      // Update cart and selected items state
      const remainingItems = cartItems.filter(item => !selectedItems.includes(item.id));
      setCartItems(remainingItems);
      setSelectedItems([]);

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

  const handlePayment = () => {
    const itemsToCheckout = cartItems.filter(item => selectedItems.includes(item.id));

    if (itemsToCheckout.length === 0) {
      toast.warning("Please select at least one item to checkout");
      return;
    }

    navigate('/checkout', {
      state: {
        user_id: user.id,
        items: itemsToCheckout.map(item => {
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

    // Clear selected items after navigation
    setSelectedItems([]);
  };
  const toggleItemSelection = (productId) => {
    setSelectedItems(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map(item => item.id));
    }
  };

  if (isLoading) {
    return (
      <div style={loaderStyle}>
        <Lottie
          animationData={loadingAnimation}
          loop={true}
          style={{ width: 200, height: 200 }}
        />
      </div>
    );
  }

  return (
    <>
      <div className="cart-page">
        <EcommerceNavbar />
        <div className="cart-items-container">
          <div className="cart-header">
            <h2>Your Shopping Cart</h2>
            {cartItems.length > 0 && (
              <div className="select-all">
                <input
                  type="checkbox"
                  checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                  onChange={toggleSelectAll}
                  id="select-all"
                />
                <label htmlFor="select-all">
                  {selectedItems.length === cartItems.length && cartItems.length > 0
                    ? 'Deselect All'
                    : 'Select All'}
                </label>
              </div>
            )}
          </div>
          <div className='cart-items-list'>
            {cartItems.length > 0 ? (
              cartItems.map((item) => {
                const product = getProductDetails(item.id);
                return product ? (
                  <div key={item.id} className="cart-item">
                    <div className="item-selection">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleItemSelection(item.id)}
                        id={`select-${item.id}`}
                      />
                    </div>
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
                      <p className='ct-product-name' onClick={() => handleProductClick(product.id)}>{product.name}</p>
                      <div className='ct-sections'>
                        <div className='ct-left-section'>
                          <p>Price: <span className='price'>₹{product.price}</span></p>
                        </div>
                        <div className='ct-right-section'>
                          <div className="quantity-selector">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                            />
                          </div>
                          <div className='ct-remove-btn'>
                            <button
                              onClick={() => confirmRemoveItem(item.id)}
                              className="remove-button"
                            >
                              <FaTrash />                  
                            </button>
                          </div>
                        </div>
                      </div>
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
        </div>

        {cartItems.length > 0 && (
          <div className="cart-summary">
            <h2>Cart Summary</h2>
            <div className="summary-item">
              <span>Selected Items:</span>
              <span>{calculateTotalItems()}</span>
            </div>
            <div className="summary-item">
              <span>Subtotal:</span>
              <span>₹{calculateSubtotal()}</span>
            </div>
            <button
              onClick={handlePayment}
              className="checkout-button"
              disabled={loading || selectedItems.length === 0}
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