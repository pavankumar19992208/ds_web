import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import EcommerceNavbar from '../../EcommerceNavbar/ecommerceNavbar';
import './Addresses.css'; 

const Addresses = ({ userId }) => {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
    isDefault: false
  });

  // Fetch addresses from API
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch(`${BaseUrl}/api/addresses?user_id=${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setAddresses(data);
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };

    if (userId) {
      fetchAddresses();
    }
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BaseUrl}/api/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ...formData, user_id: userId })
      });
      
      if (response.ok) {
        const newAddress = await response.json();
        setAddresses([...addresses, newAddress]);
        setShowForm(false);
        setFormData({
          name: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          zip: '',
          country: 'India',
          isDefault: false
        });
      }
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  const deleteAddress = async (id) => {
    try {
      await fetch(`${BaseUrl}/api/addresses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setAddresses(addresses.filter(addr => addr.id !== id));
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const setDefaultAddress = async (id) => {
    try {
      await fetch(`${BaseUrl}/api/addresses/set-default`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ address_id: id, user_id: userId })
      });
      
      setAddresses(addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      })));
    } catch (error) {
      console.error('Error setting default address:', error);
    }
  };

  return (
    <div className="addresses-page">
    <EcommerceNavbar />

    <div className="address-container">

      <h2>Saved Addresses</h2>
      
      <div className="address-grid">
        {/* Add New Address Card */}
        <div className="address-card add-new" onClick={() => setShowForm(true)}>
          <FaPlus size={24} />
          <span>Add New Address</span>
        </div>
        
        {/* Existing Address Cards */}
        {addresses.map(address => (
          <div key={address.id} className={`address-card ${address.isDefault ? 'default' : ''}`}>
            {address.isDefault && <div className="default-badge">Default</div>}
            <div className="address-content">
              <h3>{address.name}</h3>
              <p>{address.address}</p>
              <p>{address.city}, {address.state} - {address.zip}</p>
              <p>{address.country}</p>
              <p>Phone: {address.phone}</p>
            </div>
            <div className="address-actions">
              <button 
                onClick={() => setDefaultAddress(address.id)}
                disabled={address.isDefault}
              >
                {address.isDefault ? 'Default' : 'Set Default'}
              </button>
              <div>
                <button className="icon-btn" title="Edit">
                  <FaEdit />
                </button>
                <button 
                  className="icon-btn" 
                  title="Delete"
                  onClick={() => deleteAddress(address.id)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Add Address Form Modal */}
      {showForm && (
        <div className="address-modal">
          <div className="add-modal-content">
            <h3>Add New Address</h3>
            <button className="add-close-btn" onClick={() => setShowForm(false)}>×</button>
            
            <form onSubmit={handleSubmit}>
              <div className="add-form-row">
                <div className="add-form-group">
                  <label>Full Name*</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="add-form-group">
                  <label>Phone Number*</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>
              
              <div className="add-form-group">
                <label>Address*</label>
                <textarea 
                  name="address" 
                  value={formData.address}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="add-form-row">
                <div className="form-group">
                  <label>City*</label>
                  <input 
                    type="text" 
                    name="city" 
                    value={formData.city}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="add-form-group">
                  <label>State*</label>
                  <input 
                    type="text" 
                    name="state" 
                    value={formData.state}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="add-form-group">
                  <label>ZIP Code*</label>
                  <input 
                    type="text" 
                    name="zip" 
                    value={formData.zip}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>
              
              <div className="add-form-group">
                <label>Country</label>
                <input 
                  type="text" 
                  name="country" 
                  value={formData.country}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="add-form-check">
                <input 
                  type="checkbox" 
                  id="defaultAddress" 
                  name="isDefault" 
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                />
                <label htmlFor="defaultAddress">Set as default address</label>
              </div>
              
              <div className="add-form-actions">
                <button type="button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary">
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Addresses;