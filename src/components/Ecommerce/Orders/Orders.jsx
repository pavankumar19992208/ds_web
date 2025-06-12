import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import EcommerceNavbar from '../EcommerceNavbar/ecommerceNavbar';
import './orders.css';
import BaseUrl from '../../../config';
import { GlobalStateContext } from '../GlobalStateContext'; // <-- Import context

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(GlobalStateContext); // <-- Get user

  useEffect(() => {
    if (!user || !user.id) return; // Wait for user to be available

    const fetchData = async () => {
      try {
        // Fetch orders data
        const ordersResponse = await fetch(`${BaseUrl}/orders?user_id=${user.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const ordersData = await ordersResponse.json();
        setOrders(ordersData);

        // Fetch products data
        const productsResponse = await fetch(`${BaseUrl}/products`);
        const productsData = await productsResponse.json();
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getProductDetails = (productId) => {
    return products.find(product => product.id === productId);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleProductClick = (productId) => {
    navigate(`/product-overview/${productId}`);
  };

  const handlePayment = async (orderId, amount) => {
    try {
      // Create Razorpay order
      const razorpayResponse = await fetch(`${BaseUrl}/api/create-razorpay-order`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100),
          currency: 'INR',
          receipt: `order_${orderId}`,
          order_id: orderId
        })
      });

      const razorpayData = await razorpayResponse.json();

      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        const options = {
          key: razorpayData.key,
          amount: razorpayData.amount,
          currency: razorpayData.currency,
          name: 'Your Store',
          description: `Order #${orderId}`,
          order_id: razorpayData.id,
          handler: async (response) => {
            try {
              const verifyResponse = await fetch(`${BaseUrl}/api/verify-payment`, {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  order_id: orderId
                })
              });

              const result = await verifyResponse.json();
              if (!verifyResponse.ok || result.status !== 'success') {
                alert('Payment verification failed');
                return;
              }
              
              // Refresh orders after successful payment
              const updatedOrders = await fetch(`${BaseUrl}/orders?user_id=${user.id}`, {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
              });
              setOrders(await updatedOrders.json());
            } catch (err) {
              console.error('Payment verification error:', err);
            }
          },
          theme: {
            color: '#3399cc'
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };
      document.body.appendChild(script);
    } catch (error) {
      console.error('Payment initiation error:', error);
    }
  };

  if (loading) {
    return (
      <>
        <EcommerceNavbar />
        <div className="loading">Loading your orders...</div>
      </>
    );
  }

  return (
    <>
      <EcommerceNavbar />
      <div className="orders-page">
        <h1>Your Orders</h1>
        
        {orders.length > 0 ? (
          <div className="orders-container">
            {orders.map((order) => (
              <div key={order.order_id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>Order #{order.order_id}</h3>
                    <p className="order-date">Placed on {formatDate(order.order_date)}</p>
                  </div>
                  <div className="order-status">
                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="order-items">
                  {order.items.map((item) => {
                    const product = getProductDetails(item.product_id);
                    return product ? (
                      <div key={item.product_id} className="order-item">
                        <div className="item-image" onClick={() => handleProductClick(product.id)}>
                          <img src={product.mainImageUrl} alt={product.name} />
                        </div>
                        <div className="item-details">
                          <h4 onClick={() => handleProductClick(product.id)}>{product.name}</h4>
                          <p>Quantity: {item.quantity}</p>
                          <p>Price: ₹{product.price}</p>
                        </div>
                        <div className="item-total">
                          <p>₹{(product.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <p>Total: ₹{order.total_amount.toFixed(2)}</p>
                  </div>
                  <div className="order-actions">
                    {order.status.toLowerCase() === 'created' && (
                      <button 
                        className="pay-now-button"
                        onClick={() => handlePayment(order.order_id, order.total_amount)}
                      >
                        Complete Payment
                      </button>
                    )}
                    <button 
                      className="track-button"
                      onClick={() => navigate(`/order-tracking/${order.order_id}`)}
                    >
                      Track Order
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-orders">
            <p>You haven't placed any orders yet.</p>
            <button 
              className="shop-now-button"
              onClick={() => navigate('/ecommerce-dashboard')}
            >
              Shop Now
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default OrdersPage;