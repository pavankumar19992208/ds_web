import React, { useEffect, useState, useContext } from "react";
import BaseUrl from "../../../../config.jsx";
import { GlobalStateContext } from "../../GlobalState.jsx";
import { useNavigate } from 'react-router-dom';



const AgentOrders = () => {
    const Navigate = useNavigate();
    const { agent } = useContext(GlobalStateContext);
    const agentId = agent?.id; // agent ID from global state
    const [orders, setOrders] = useState([]);
      const [sidebarOpen, setSidebarOpen] = useState(false);
      const handleLogout = () => {
    localStorage.removeItem('agentToken');
    localStorage.removeItem('agentData');
    window.location.href = '/agent-login';
  };


    useEffect(() => {
        if (!agentId) return;
        fetch(`${BaseUrl}/orders/agent/${agentId}`)
            .then(res => res.json())
            .then(data => setOrders(data.orders || []))
            .catch(() => setOrders([]));
    }, [agentId]);

    return (
        <div className="agent-orders-container">
            <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={() => setSidebarOpen(false)}>×</button>
        <ul>
          <li>
            <span role="img" aria-label="profile">👤</span> Profile
          </li>
          <li onClick={handleLogout} className="logout">
            <span role="img" aria-label="logout">🚪</span> Logout
          </li>
        </ul>
      </div>

      {/* Header with title, hamburger menu and notifications */}
      <header className="header">
        <div className="hamburger-menu" onClick={() => setSidebarOpen(true)}>☰</div>
        <div className="header-title">Shoppers</div>
        <div className="notifications">🔔</div>
      </header>
            <h3>Your Orders</h3>
            {orders.length === 0 ? (
                <p>No orders assigned.</p>
            ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {orders.map(order => (
                        <li key={order.id} style={{
                            border: "1px solid #eee",
                            borderRadius: 8,
                            marginBottom: 12,
                            padding: 16,
                            background: "#fafbfc"
                        }}>
                            <div><strong>{order.user_name}</strong></div>
                            <div><strong>Order ID:</strong> {order.description}</div>
                            <div><strong>Address:</strong> {order.address}</div>
                        </li>
                    ))}
                </ul>
            )}
        <footer className="agt-footer">
        <div className="home-icon" onClick={() => Navigate('/agent-dashboard')}>⌂</div>
        <div className='agt-orders-btn' onClick={() => Navigate('/agent-orders')}> Order</div>
      </footer>
        </div>
    );
};

export default AgentOrders;