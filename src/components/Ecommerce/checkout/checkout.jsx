import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import EcommerceNavbar from '../EcommerceNavbar/ecommerceNavbar';
import './checkout.css';
import BaseUrl from '../../../config';
import { GlobalStateContext } from '../GlobalState';

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

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(GlobalStateContext);
  const [addresses, setAddresses] = useState([]);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    orderId: '',
    userId: user?.id || '',
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
    const fetchAddresses = async () => {
      try {
        const response = await fetch(`${BaseUrl}/user/addresses/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        const mapped = Array.isArray(data)
          ? data.map(addr => ({
            ...addr,
            isDefault: addr.is_default,
          }))
          : [];
        setAddresses(mapped);
        const def = mapped.find(addr => addr.isDefault || addr.is_default);
        setDefaultAddress(def || null);
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };

    const fetchCartData = async () => {
      try {
        if (location.state?.items) {
          setOrderDetails(prev => ({
            ...prev,
            items: location.state.items || [],
            orderId: location.state.orderId || Date.now().toString(),
            userId: user?.id || ''
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
            orderId: cartData.orderId || Date.now().toString(),
            userId: user?.id || ''
          }));
        }
        fetchAddresses();
      } catch (error) {
        console.error('Failed to fetch cart data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchAddresses();
      fetchCartData();
    }
  }, [location.state, user]);

  const handlePayment = async () => {
    setProcessing(true);
    setError(null);
    setPaymentCompleted(false);

    try {
      const calculatedTotal = calculateTotal();
      if (calculatedTotal <= 0) {
        throw new Error('Invalid order total amount');
      }

      if (!defaultAddress) {
        throw new Error('No default shipping address selected');
      }

      // 1. Create order first
      const orderResponse = await fetch(`${BaseUrl}/orders/public`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          user_id: user.id,
          items: orderDetails.items.map(item => ({
            product_id: item.id,
            quantity: item.quantity
          })),
          shipping_address_id: defaultAddress.id
        })
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.detail || 'Failed to create order');
      }

      const orderData = await orderResponse.json();
      setConfirmedOrder(orderData);

      // 2. Clear the selected items from cart
      try {
        const clearCartResponse = await fetch(`${BaseUrl}/cart/clear-selected/${user.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({item_ids: orderDetails.items.map(item => item.id)})
        });

        if (!clearCartResponse.ok) {
          console.error("Failed to clear cart items, but order was created");
        }
      } catch (cartError) {
        console.error("Error clearing cart:", cartError);
      }

      // 3. Proceed to payment
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
        name: 'Cartsy',
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

            setPaymentCompleted(true);
            setConfirmedOrder(result.order);
            setShowConfirmation(true);
            setProcessing(false);
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

      // Add event handlers
      rzp.on('payment.failed', (response) => {
        setError(`Payment failed: ${response.error.description}`);
        setShowConfirmation(true);
        setProcessing(false);
      });

      rzp.on('modal.close', () => {
        if (!paymentCompleted) {
          setShowConfirmation(true);
        }
        setProcessing(false);
      });

      rzp.open();

    } catch (err) {
      setError(err.message);
      setProcessing(false);
    }
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
    <div className="checkout-page">
      <EcommerceNavbar />
      <div className="checkout-container">
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
            <h4>Shipping Information</h4>
            {defaultAddress ? (
              <div className="address-card default">
                <div className="default-badge">Default</div>
                <div className="address-content">
                  <h3>{defaultAddress.full_name}</h3>
                  <p>{defaultAddress.line1}</p>
                  {defaultAddress.landmark && <p>Landmark: {defaultAddress.landmark}</p>}
                  <p>{defaultAddress.city}, {defaultAddress.state} - {defaultAddress.pincode}</p>
                  <p>{defaultAddress.country}</p>
                  <p>Phone: {defaultAddress.mobile_number}</p>
                  {defaultAddress.lat && defaultAddress.lon && (
                    <p>Lat/Lon: {defaultAddress.lat}, {defaultAddress.lon}</p>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <p style={{fontSize: 'small'}}>No default address found. Please add and set a default address in your <a href="/addresses">Addresses</a>.</p>
              </div>
            )}
            <div style={{ marginTop: 24 }}>
              {error && <div className="payment-error">{error}</div>}
              <button
                onClick={handlePayment}
                disabled={processing || displayTotal <= 0 || !defaultAddress}
                className={`pay-button ${processing ? 'processing' : ''}`}
              >
                {processing ? 'Processing...' : `Make Payment ₹${displayTotal.toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>
      </div>
      {showConfirmation && (
        <div className="confirmation-popup">
          <div className="popup-content">
            <h3>
              {paymentCompleted
                ? 'Order Confirmed!'
                : 'Order Created!'}
            </h3>
            <p>
              {paymentCompleted
                ? `Your order #${confirmedOrder?.order_id} has been placed and paid successfully.`
                : `Your order #${confirmedOrder?.order_id} has been created. You can complete payment from your orders page.`}
            </p>
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
      </div>
    </>
  );
};

export default CheckoutPage;