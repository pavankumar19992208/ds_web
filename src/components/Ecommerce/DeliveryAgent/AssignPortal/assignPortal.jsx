import React, { useState } from "react";
import { useEffect } from "react";
import BaseUrl from "../../../../config.jsx";

// --- SVG Checkmark Icon Component ---
const CheckIcon = ({ size = 20, color = "#fff" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ marginRight: "10px" }}
    >
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);


// --- Main Component ---
const AssignPortal = () => {
    const [agents, setAgents] = useState([]);
    const [orders, setOrders] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState("");
    // State now holds an array of numbers (order IDs)
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [message, setMessage] = useState("");
    const [assignedAgents, setAssignedAgents] = useState([]);
    const [expandedAgents, setExpandedAgents] = useState({});

    // Fetch agents from backend
    useEffect(() => {
        fetch(`${BaseUrl}/agents`) // Adjust the URL if your API is prefixed (e.g., /api/agents)
            .then((res) => res.json())
            .then((data) => setAgents(data.agents || []))
            .catch(() => setAgents([]));
    }, []);

    useEffect(() => {
        fetch(`${BaseUrl}/orders/all`)
            .then((res) => res.json())
            .then((data) => setOrders(data.orders || []))
            .catch(() => setOrders([]));
    }, []);

    useEffect(() => {
        fetch(`${BaseUrl}/orders/assigned`)
            .then((res) => res.json())
            .then((data) => setAssignedAgents(data || []))
            .catch(() => setAssignedAgents([]));
    }, []);

    // Toggles an order's selection status
    const handleOrderToggle = (orderId) => {
        setSelectedOrders((prevSelected) =>
            prevSelected.includes(orderId)
                ? prevSelected.filter((id) => id !== orderId) // Unselect
                : [...prevSelected, orderId] // Select
        );
    };

    // Toggle expand/collapse for agent
    const handleExpandAgent = (agentId) => {
        setExpandedAgents((prev) => ({
            ...prev,
            [agentId]: !prev[agentId]
        }));
    };

    const handleAssign = async () => {
        if (selectedAgent && selectedOrders.length > 0) {
            try {
                const res = await fetch(`${BaseUrl}/orders/assign`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        agent_id: Number(selectedAgent),
                        order_ids: selectedOrders,
                    }),
                });
                const data = await res.json();
                if (res.ok) {
                    const agentName = agents.find(
                        (a) => a.id === Number(selectedAgent)
                    )?.name;
                    const orderDescriptions = orders
                        .filter((o) => selectedOrders.includes(o.id))
                        .map((o) => o.description)
                        .join(", ");
                    setMessage(`✅ Successfully assigned ${agentName} to ${orderDescriptions}.`);
                    setSelectedAgent("");
                    setSelectedOrders([]);
                    setTimeout(() => {
                        window.location.reload();
                    }, 1200);
                } else {
                    setMessage("❌ " + (data.detail || "Assignment failed."));
                }
            } catch (err) {
                setMessage("❌ Assignment failed.");
            }
        } else {
            setMessage("⚠️ Please select an agent and at least one order.");
        }
    };

    return (
        <div>
            <h2 style={{ margin: "1rem 1rem", backgroundColor: "#f5f5f5", padding: "12px", borderRadius: "8px" }}>Delivery Assign Portal</h2>
            <div style={{ display: "flex", gap: 32 }}>
                {/* Left: Assign UI */}
                <div style={styles.container}>
                    <h2 style={styles.header}>Assign Delivery</h2>
                    {/* Agent Selection */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>1. Select Agent</label>
                        <select
                            value={selectedAgent}
                            onChange={(e) => setSelectedAgent(e.target.value)}
                            style={styles.selectInput}
                        >
                            <option value="">-- Choose an Agent --</option>
                            {agents.map((agent) => (
                                <option key={agent.id} value={agent.id}>
                                    {agent.name}- {agent.id}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Order Selection */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>2. Select Order(s)</label>
                        {/* Select All Checkbox */}
                        <div style={{ marginBottom: "8px" }}>
                            <input
                                type="checkbox"
                                id="selectAllOrders"
                                checked={orders.length > 0 && selectedOrders.length === orders.length}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedOrders(orders.map((order) => order.id));
                                    } else {
                                        setSelectedOrders([]);
                                    }
                                }}
                            />
                            <label htmlFor="selectAllOrders" style={{ marginLeft: 8, fontWeight: 500 }}>
                                Select All
                            </label>
                        </div>
                        <div style={styles.orderListContainer}>
                            {orders
                                .filter(order => !order.assigned_agent_id)
                                .map((order) => {
                                    const isSelected = selectedOrders.includes(order.id);
                                    return (
                                        <div
                                            key={order.id}
                                            onClick={() => handleOrderToggle(order.id)}
                                            style={{
                                                ...styles.orderItem,
                                                ...(isSelected ? styles.orderItemSelected : {}),
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "12px"
                                            }}
                                        >
                                            {isSelected && <CheckIcon />}
                                            {order.mainImageUrl && (
                                                <img
                                                    src={order.mainImageUrl}
                                                    alt={order.product_name || "Order"}
                                                    style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6 }}
                                                />
                                            )}
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{order.product_name || order.description} - Order ID : #{order.id}</div>
                                                <div style={{ fontSize: 13, color: "#555" }}>{order.address}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>

                    {/* Assign Button */}
                    <button onClick={handleAssign} style={styles.assignButton}>
                        Assign Now
                    </button>

                    {/* Feedback Message */}
                    {message && (
                        <div
                            style={{
                                ...styles.message,
                                color: message.startsWith("✅") ? "#28a745" : "#dc3545",
                            }}
                        >
                            {message}
                        </div>
                    )}
                </div>
                {/* Right: Assigned Agents */}
                <div style={styles.assignedContainer}>
                    <h3 style={{ marginBottom: 16 }}>Assigned Agents</h3>
                    {assignedAgents.length === 0 && (
                        <div style={{ color: "#888" }}>No assignments yet.</div>
                    )}
                    {assignedAgents.map((agent) => (
                        <div key={agent.agent_id} style={styles.agentSection}>
                            <div
                                style={styles.agentHeader}
                                onClick={() => handleExpandAgent(agent.agent_id)}
                            >
                                <span style={{ fontWeight: 600 }}>{agent.agent_name} - {agent.agent_id}</span>
                                <span style={{
                                    marginLeft: 8,
                                    cursor: "pointer",
                                    fontSize: 18,
                                    userSelect: "none",
                                    transform: expandedAgents[agent.agent_id] ? "rotate(90deg)" : "rotate(0deg)",
                                    transition: "transform 0.2s"
                                }}>
                                    ▶
                                </span>
                            </div>
                            {expandedAgents[agent.agent_id] && (
                                <div style={styles.agentOrdersList}>
                                    {agent.orders.map((order) => (
                                        <div key={order.id} style={styles.agentOrderItem}>
                                            {order.mainImageUrl && (
                                                <img
                                                    src={order.mainImageUrl}
                                                    alt={order.product_name || "Order"}
                                                    style={{ width: 32, height: 32, objectFit: "cover", borderRadius: 4, marginRight: 8 }}
                                                />
                                            )}
                                            <div>
                                                <div style={{ fontWeight: 500 }}>{order.product_name || order.description}</div>
                                                <div style={{ fontSize: 12, color: "#555" }}>{order.address}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>

    );
};

// --- Styles ---
const styles = {

    assignedContainer: {
        margin: "0rem auto",
        padding: "2rem",
        // minWidth: 320,
        width: 600,
        background: "#f7f9fa",
        border: "1px solid #e0e0e0",
        borderRadius: "12px",
        padding: "1.5rem",
        height: "fit-content",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    },
    agentSection: {
        marginBottom: 18,
        borderBottom: "1px solid #eee",
        paddingBottom: 10,
    },
    agentHeader: {
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        fontSize: 16,
        marginBottom: 6,
    },
    agentOrdersList: {
        marginLeft: 18,
        marginTop: 4,
    },
    agentOrderItem: {
        display: "flex",
        alignItems: "center",
        marginBottom: 8,
        gap: 8,
    },
    container: {
        width: 750,
        margin: "0rem auto",
        padding: "2rem",
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        border: "1px solid #e0e0e0",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        background: "#ffffff",
    },
    header: {
        textAlign: "center",
        color: "#333",
        marginBottom: "1.5rem",
        borderBottom: "1px solid #eee",
        paddingBottom: "1rem",
    },
    formGroup: {
        marginBottom: "1.5rem",
    },
    label: {
        display: "block",
        marginBottom: "0.5rem",
        color: "#555",
        fontWeight: "600",
    },
    selectInput: {
        width: "100%",
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        background: "#f9f9f9",
        fontSize: "1rem",
    },
    orderListContainer: {
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "8px",
        background: "#f9f9f9",
    },
    orderItem: {
        display: "flex",
        alignItems: "center",
        padding: "12px",
        borderRadius: "6px",
        cursor: "pointer",
        marginBottom: "4px",
        transition: "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
    },
    orderItemSelected: {
        backgroundColor: "#007bff",
        color: "#ffffff",
        fontWeight: "bold",
    },
    assignButton: {
        width: "100%",
        padding: "14px",
        fontSize: "1.1rem",
        fontWeight: "bold",
        color: "#fff",
        backgroundColor: "#28a745",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "background-color 0.2s ease",
    },
    message: {
        marginTop: "1.5rem",
        padding: "12px",
        borderRadius: "8px",
        textAlign: "center",
        fontWeight: "500",
        backgroundColor: 'rgba(0,0,0,0.03)',
        border: '1px solid rgba(0,0,0,0.05)'
    },
};


export default AssignPortal;