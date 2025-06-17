import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import EcommerceNavbar from '../EcommerceNavbar/ecommerceNavbar';
import './Orders.css';
import BaseUrl from '../../../config';
import Lottie from 'lottie-react';
import loadingAnimation from '../loader/loader.json';
import { GlobalStateContext } from '../GlobalState';
import { FaFilter } from 'react-icons/fa';

const loaderStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  width: '100vw',
  position: 'fixed',
  top: 0,
  left: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  zIndex: 9999
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useContext(GlobalStateContext);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [error, setError] = useState(null);
  
  // Generate month options
  const months = [
    { value: '', label: 'All Months' },
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];
  
  // Generate year options (last 5 years and next 1 year)
  const currentYear = new Date().getFullYear();
  const years = [
    { value: '', label: 'All Years' },
    ...Array.from({ length: 6 }, (_, i) => ({
      value: (currentYear - 4 + i).toString(),
      label: (currentYear - 4 + i).toString()
    }))
  ];

useEffect(() => {
    if (!user || !user.id) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log(`Fetching orders for user ID: ${user.id}`);
        const ordersResponse = await fetch(`${BaseUrl}/orders/user/${user.id}`);
        
        console.log('Response status:', ordersResponse.status);
        const ordersData = await ordersResponse.json();
        console.log('Full response:', ordersData);
        
        if (!ordersResponse.ok) {
          throw new Error(ordersData.detail || `HTTP error! status: ${ordersResponse.status}`);
        }
        
        if (!Array.isArray(ordersData)) {
          throw new Error('Invalid orders data format');
        }
        
        console.log('Orders received:', ordersData);
        setOrders(ordersData);
        setAllOrders(ordersData);

        // Fetch products
        const productsResponse = await fetch(`${BaseUrl}/products`);
        const productsData = await productsResponse.json();
        setProducts(productsData);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        setOrders([]);
        setAllOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Apply filters when month or year changes
  useEffect(() => {
    if (!selectedMonth && !selectedYear) {
      setOrders(allOrders);
      return;
    }

    const filtered = allOrders.filter(order => {
      const orderDate = new Date(order.order_date);
      const orderMonth = String(orderDate.getMonth() + 1).padStart(2, '0');
      const orderYear = String(orderDate.getFullYear());
      
      const monthMatch = !selectedMonth || orderMonth === selectedMonth;
      const yearMatch = !selectedYear || orderYear === selectedYear;
      
      return monthMatch && yearMatch;
    });

    setOrders(filtered);
  }, [selectedMonth, selectedYear, allOrders]);

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
    // Payment endpoints should still require authentication
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const razorpayResponse = await fetch(`${BaseUrl}/api/create-razorpay-order`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100),
        currency: 'INR',
        receipt: `order_${orderId}`,
        order_id: orderId
      })
    });
    
      const razorpayData = await razorpayResponse.json();

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        const options = {
          key: razorpayData.key,
          amount: razorpayData.amount,
          currency: razorpayData.currency,
          name: 'Shoppers',
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
              
              const updatedOrders = await fetch(`${BaseUrl}/orders?user_id=${user.id}`, {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
              });
              const data = await updatedOrders.json();
              setOrders(data);
              setAllOrders(data);
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

  const resetFilters = () => {
    setSelectedMonth('');
    setSelectedYear('');
    setShowFilterDropdown(false);
  };

  if (isLoading) {
    return (
      <div style={loaderStyle}>
        <Lottie 
          animationData={loadingAnimation} 
          loop={true} 
          style={{ width: 300, height: 300 }}
        />
      </div>
    );
  }

  return (
    <>
      <EcommerceNavbar />
      <div className="orders-page">
        <div className="orders-container">
          <div className="orders-header">
            <h1>Your Orders</h1>
            {allOrders.length > 0 && (
              <div className="filter-container">
                <button 
                  className="filter-button"
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                >
                  <FaFilter /> Filter
                </button>
                {showFilterDropdown && (
                  <div className="filter-dropdown">
                    <div className="filter-section">
                      <label>Month:</label>
                      <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                      >
                        {months.map(month => (
                          <option key={month.value} value={month.value}>
                            {month.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="filter-section">
                      <label>Year:</label>
                      <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                      >
                        {years.map(year => (
                          <option key={year.value} value={year.value}>
                            {year.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button 
                      className="reset-filters"
                      onClick={resetFilters}
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {allOrders.length === 0 ? (
            <div className="no-orders">
              <p>You haven't placed any orders yet.</p>
              <button 
                className="shop-now-button"
                onClick={() => navigate('/ecommerce-dashboard')}
              >
                Shop Now
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="no-orders">
              <p>No orders found matching your filters</p>
              <button 
                className="reset-filters-button"
                onClick={resetFilters}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            orders.map((order) => (
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
                    <p>Total: ₹{Number(order.total_amount).toFixed(2)}</p>       
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
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default OrdersPage;