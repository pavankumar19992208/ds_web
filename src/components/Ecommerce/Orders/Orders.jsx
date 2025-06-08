import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EcommerceNavbar from '../EcommerceNavbar/ecommerceNavbar';
import './orders.css';
import BaseUrl from '../../../config';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch orders data
        const ordersResponse = await fetch(`${BaseUrl}/orders?user_id=1`);
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
  }, []);

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

  if (loading) {
    return <div className="loading">Loading your orders...</div>;
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
                  <button 
                    className="track-button"
                    onClick={() => navigate(`/order-tracking/${order.order_id}`)}
                  >
                    Track Order
                  </button>
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