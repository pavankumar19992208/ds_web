import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import EcommerceNavbar from '../EcommerceNavbar/ecommerceNavbar';
import './checkout.css';
import BaseUrl from '../../../config';

const loadRazorpay = () => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(window.Razorpay);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(window.Razorpay);
    };
    script.onerror = () => {
      reject(new Error('Failed to load Razorpay script'));
    };
    document.body.appendChild(script);
  });
};

const CheckoutForm = ({ orderDetails, onPaymentSuccess }) => {
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const calculateTotal = () => {
    if (!orderDetails?.items?.length) return 0;
    return orderDetails.items.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return sum + (price * quantity);
    }, 0);
  };

  const handlePayment = async () => {
    setProcessing(true);
    setError(null);

    try {
      const calculatedTotal = calculateTotal();
      if (calculatedTotal <= 0) {
        throw new Error('Invalid order total amount');
      }

      const orderResponse = await fetch(`${BaseUrl}/orders`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          user_id: 1,
          items: orderDetails.items.map(item => ({
            product_id: item.id,
            quantity: item.quantity
          }))
        })
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.detail || 'Failed to create order');
      }

      const orderData = await orderResponse.json();

      const razorpayResponse = await fetch(`${BaseUrl}/api/create-razorpay-order`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: Math.round(calculatedTotal * 100),
          currency: 'INR',
          receipt: `order_${orderData.order_id}`,
          order_id: orderData.order_id
        })
      });

      if (!razorpayResponse.ok) {
        const errorData = await razorpayResponse.json();
        throw new Error(errorData.detail || 'Failed to create payment order');
      }

      const razorpayData = await razorpayResponse.json();

      const Razorpay = await loadRazorpay();
      
      const options = {
        key: razorpayData.key,
        amount: razorpayData.amount,
        currency: razorpayData.currency,
        name: 'Your Store',
        description: `Order #${orderData.order_id}`,
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
                order_id: orderData.order_id
              })
            });

            const result = await verifyResponse.json();
            if (!verifyResponse.ok || result.status !== 'success') {
              throw new Error(result.message || 'Payment verification failed');
            }
            
            rzp.close();
            onPaymentSuccess(result.order);
          } catch (err) {
            setError(err.message);
            setProcessing(false);
          }
        },
        prefill: {
          name: orderDetails.shippingInfo.name,
          email: orderDetails.shippingInfo.email,
          contact: orderDetails.shippingInfo.phone
        },
        theme: {
          color: '#3399cc'
        }
      };

      const rzp = new Razorpay(options);
      rzp.open();
      
      rzp.on('payment.failed', (response) => {
        setError(`Payment failed: ${response.error.description}`);
        setProcessing(false);
      });

    } catch (err) {
      setError(err.message);
      setProcessing(false);
    }
  };

  const displayTotal = calculateTotal();

  return (
    <div className="payment-form">
      {error && <div className="payment-error">{error}</div>}
      <button 
        onClick={handlePayment}
        disabled={processing || displayTotal <= 0}
        className={`pay-button ${processing ? 'processing' : ''}`}
      >
        {processing ? 'Processing...' : `Pay ₹${displayTotal.toFixed(2)}`}
      </button>
    </div>
  );
};

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [orderDetails, setOrderDetails] = useState({
    orderId: '',
    userId: localStorage.getItem('userId') || '',
    items: [],
    shippingInfo: {
      name: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      phone: '',
      email: ''
    }
  });
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const calculateTotal = () => {
    if (!orderDetails?.items?.length) return 0;
    return orderDetails.items.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return sum + (price * quantity);
    }, 0);
  };

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        if (location.state?.items) {
          setOrderDetails(prev => ({
            ...prev,
            items: location.state.items || [],
            orderId: location.state.orderId || Date.now().toString()
          }));
          setLoading(false);
          return;
        }

        const response = await fetch(`${BaseUrl}/api/cart`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const cartData = await response.json();
          setOrderDetails(prev => ({
            ...prev,
            items: cartData.items || [],
            orderId: cartData.orderId || Date.now().toString()
          }));
        }
      } catch (error) {
        console.error('Failed to fetch cart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails(prev => ({
      ...prev,
      shippingInfo: {
        ...prev.shippingInfo,
        [name]: value
      }
    }));
  };

  const handlePaymentSuccess = (orderData) => {
    setConfirmedOrder(orderData);
    setShowConfirmation(true);
  };

  if (loading) {
    return (
      <>
        <EcommerceNavbar />
        <div className="checkout-loading">Loading your order...</div>
      </>
    );
  }

  const displayTotal = calculateTotal();

  return (
    <>
      <EcommerceNavbar />
      <div className="checkout-container">
        <div className="checkout-steps">
          <div className={`step ${step === 1 ? 'active' : ''}`}>1. Shipping</div>
          <div className={`step ${step === 2 ? 'active' : ''}`}>2. Payment</div>
        </div>

        <div className="checkout-content">
          <div className="order-summary">
            <h3>Order Summary</h3>
            {orderDetails.items.map(item => (
              <div key={item.id} className="order-item">
                <span>{item.name} × {item.quantity}</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="order-total">
              <span>Total</span>
              <span>₹{displayTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="checkout-form">
            {step === 1 ? (
              <>
                <h2>Shipping Information</h2>
                <form>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={orderDetails.shippingInfo.name}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={orderDetails.shippingInfo.email}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <input 
                      type="text" 
                      name="address" 
                      value={orderDetails.shippingInfo.address}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>City</label>
                      <input 
                        type="text" 
                        name="city" 
                        value={orderDetails.shippingInfo.city}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <input 
                        type="text" 
                        name="state" 
                        value={orderDetails.shippingInfo.state}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>ZIP Code</label>
                      <input 
                        type="text" 
                        name="zip" 
                        value={orderDetails.shippingInfo.zip}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input 
                        type="tel" 
                        name="phone" 
                        value={orderDetails.shippingInfo.phone}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="next-button"
                    onClick={() => setStep(2)}
                    disabled={!Object.values(orderDetails.shippingInfo).every(Boolean)}
                  >
                    Continue to Payment
                  </button>
                </form>
              </>
            ) : (
              <>
                <h2>Payment Method</h2>
                <div className="payment-methods">
                  <CheckoutForm 
                    orderDetails={{...orderDetails, total: displayTotal}} 
                    onPaymentSuccess={handlePaymentSuccess} 
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {showConfirmation && (
        <div className="confirmation-popup">
          <div className="popup-content">
            <h3>Order Confirmed!</h3>
            <p>Your order #{confirmedOrder?.order_id} has been placed successfully.</p>
            <div className="popup-buttons">
              <button 
                onClick={() => navigate('/ecommerce-dashboard')}
                className="continue-shopping"
              >
                Continue Shopping
              </button>
              <button 
                onClick={() => navigate('/orders')}
                className="view-orders"
              >
                View Your Orders
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CheckoutPage;