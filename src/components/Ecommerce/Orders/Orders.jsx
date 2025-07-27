import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import EcommerceNavbar from '../EcommerceNavbar/ecommerceNavbar';
import './Orders.css';
import BaseUrl from '../../../config';
import Lottie from 'lottie-react';
import loadingAnimation from '../loader/loader.json';
import { GlobalStateContext } from '../GlobalState';
import { FaFilter, FaChevronDown, FaChevronUp, FaFileInvoiceDollar, FaBoxOpen, FaTruck, FaClipboardCheck, FaHome } from 'react-icons/fa';

const loaderStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  width: '100vw',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 9999,
  backgroundColor: 'rgba(255, 255, 255, 0.25)'
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [addresses, setAddresses] = useState({}); // Store addresses by ID
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useContext(GlobalStateContext);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [error, setError] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState({});

  // Toggle order details expansion
  const toggleOrderDetails = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  // Fetch address by ID
  const fetchAddress = async (addressId) => {
    try {
      const response = await fetch(`${BaseUrl}/addresses/${addressId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch address');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching address:', error);
      return null;
    }
  };

  // Fetch all addresses when an order is expanded if not already fetched
  const fetchAddressesForOrder = async (order) => {
    if (!order.shipping_address_id || addresses[order.shipping_address_id]) {
      return;
    }

    const address = await fetchAddress(order.shipping_address_id);
    if (address) {
      setAddresses(prev => ({
        ...prev,
        [order.shipping_address_id]: address
      }));
    }
  };

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

        const ordersResponse = await fetch(`${BaseUrl}/orders/user/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!ordersResponse.ok) {
          throw new Error(`HTTP error! status: ${ordersResponse.status}`);
        }

        let ordersData = await ordersResponse.json();

        // Ensure ordersData is always an array
        if (!Array.isArray(ordersData)) {
          // Handle different response formats:
          // Case 1: Response is an object with an orders property
          if (ordersData.orders && Array.isArray(ordersData.orders)) {
            ordersData = ordersData.orders;
          }
          // Case 2: Response is empty or malformed
          else {
            ordersData = [];
          }
        }

        console.log('Processed orders data:', ordersData);
        setOrders(ordersData);
        setAllOrders(ordersData);

        // Fetch products
        const productsResponse = await fetch(`${BaseUrl}/products`);
        const productsData = await productsResponse.json();
        setProducts(productsData);

      } catch (error) {
        console.error("Error fetching orders:", error);
        setError(error.message);
        // Set to empty array instead of null/undefined
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

  // Fetch address when order is expanded
  useEffect(() => {
    orders.forEach(order => {
      if (expandedOrders[order.order_id] && order.shipping_address_id) {
        fetchAddressesForOrder(order);
      }
    });
  }, [expandedOrders, orders]);

  const getProductDetails = (productId) => {
    return products.find(product => product.id === productId);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatDateTime = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
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
          name: 'Cartsy',
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

              const updatedOrders = await fetch(`${BaseUrl}/orders/user/${user.id}`, {
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

  // if (isLoading) {
  //   return (
  //     <div style={loaderStyle}>
  //       <Lottie
  //         animationData={loadingAnimation}
  //         loop={true}
  //         style={{ width: 200, height: 200 }}
  //       />
  //     </div>
  //   );
  // }

  const stages = [
    { name: 'Order Placed', icon: <FaFileInvoiceDollar /> },
    { name: 'Packed', icon: <FaBoxOpen /> },
    { name: 'In Transit', icon: <FaTruck /> },
    { name: 'Out for Delivery', icon: <FaClipboardCheck /> },
    { name: 'Delivered', icon: <FaHome /> }
  ];

  // This function maps your backend status to a stage index (0-4)
  const getStatusIndex = (status) => {
    const statusString = status ? status.toLowerCase() : '';
    switch (statusString) {
      case 'created':
      case 'placed':
      case 'pending payment':
        return 0;
      case 'packed':
      case 'processing':
        return 1;
      case 'shipped':
      case 'in_transit':
        return 2;
      case 'out_for_delivery':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 0; // Default to the first stage if status is unknown
    }
  };

  const OrderTracker = ({ status }) => {
    const currentStageIndex = getStatusIndex(status);

    // Calculate the width of the progress bar
    const progressPercentage = currentStageIndex > 0
      ? (currentStageIndex / (stages.length - 1)) * 100
      : 0;

    return (
      <div className="tracker-container">
        <div className="tracker-progress-bar" style={{ width: `${progressPercentage}%` }}></div>
        <div className="tracker-stages">
          {stages.map((stage, index) => {
            const isCompleted = index < currentStageIndex;
            const isActive = index === currentStageIndex;
            const isDelivered = status.toLowerCase() === 'delivered' && index === stages.length - 1;

            let stageClass = 'tracker-stage';
            if (isCompleted || isDelivered) stageClass += ' completed';
            if (isActive) stageClass += ' active';

            return (
              <div key={stage.name} className={stageClass}>
                <div className="stage-icon">{stage.icon}</div>
                <div className="stage-name">{stage.name}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="orders-page">
        {isLoading && (
          <div style={loaderStyle}>
            <Lottie
              animationData={loadingAnimation}
              loop={true}
              style={{ width: 200, height: 200 }}
            />
          </div>
        )}
        <EcommerceNavbar />
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
              {/* <button
                className="reset-filters-button"
                onClick={resetFilters}
              >
                Reset Filters
              </button> */}
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
                          <p style={{ fontSize: '0.8rem' }}>Quantity: {item.quantity}</p>
                          <p style={{ fontSize: '0.8rem' }}>Price: ₹{product.price}</p>
                        </div>
                        <div className="item-total">
                          <p>₹{(product.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>

                {/* Order details section that expands */}
                {expandedOrders[order.order_id] && (
                  <div className="order-details-expanded">
                    <div className="od-detail-row">
                      <span className="od-detail-label">Transaction ID:</span>
                      <span className="od-detail-value">
                        {order.razorpay_payment_id || 'Not available'}
                      </span>
                    </div>
                    <div className="od-detail-row">
                      <span className="od-detail-label">Order Time:</span>
                      <span className="od-detail-value">
                        {formatDateTime(order.order_date)}
                      </span>
                    </div>
                    <div className="od-detail-row">
                      <span className="od-detail-label">Shipping Address:</span>
                      <span className="od-detail-value">
                        {order.shipping_address_id && addresses[order.shipping_address_id] ? (
                          <>
                            <p className='od-address-name'>{addresses[order.shipping_address_id].full_name}</p>
                            <p>{addresses[order.shipping_address_id].line1}</p>
                            {addresses[order.shipping_address_id].landmark && (
                              <p>{addresses[order.shipping_address_id].landmark}</p>
                            )}
                            <p>
                              {addresses[order.shipping_address_id].city}, {addresses[order.shipping_address_id].state}
                            </p>
                            <p>
                              {addresses[order.shipping_address_id].pincode}, {addresses[order.shipping_address_id].country}
                            </p>
                            <p>Phone: {addresses[order.shipping_address_id].mobile_number}</p>
                          </>
                        ) : 'Loading address...'}
                      </span>
                    </div>
                    <div className="od-detail-row tracker-row">
                      {/* <span className="od-detail-label">Order Progress:</span> */}
                      <div className="od-detail-value">
                        <OrderTracker status={order.status} />
                      </div>
                    </div>
                    {/* <div className="od-detail-row">
                      <span className="od-detail-label">Payment Method:</span>
                      <span className="od-detail-value">
                        {order.payment_method || 'Not specified'}
                      </span>
                    </div> */}
                  </div>
                )}

                <div className="order-footer">
                  <div className="od-order-total">
                    <p>Total: ₹{Number(order.total_amount).toFixed(2)}</p>
                  </div>
                  <div className="order-actions">
                    <button
                      className="order-details-button"
                      onClick={() => toggleOrderDetails(order.order_id)}
                    >
                      {expandedOrders[order.order_id] ? (
                        <>
                          <FaChevronUp /> Hide Details
                        </>
                      ) : (
                        <>
                          <FaChevronDown /> Order Details
                        </>
                      )}
                    </button>
                    {order.status.toLowerCase() === 'created' && (
                      <button
                        className="pay-now-button"
                        onClick={() => handlePayment(order.order_id, order.total_amount)}
                      >
                        Complete Payment
                      </button>
                    )}
                    {/* <button
                      className="track-button"
                      onClick={() => navigate(`/order-tracking/${order.order_id}`)}
                    >
                      Track Order
                    </button> */}
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