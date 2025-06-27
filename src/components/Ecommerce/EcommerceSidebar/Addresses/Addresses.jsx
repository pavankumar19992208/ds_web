import React, { useState, useEffect, useContext } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import EcommerceNavbar from '../../EcommerceNavbar/ecommerceNavbar';
import BaseUrl from '../../../../config';
import { GlobalStateContext } from '../../GlobalState';
import './Addresses.css';

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const { user } = useContext(GlobalStateContext) || {};
  const [deleteId, setDeleteId] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // <-- Add this state

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
    "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir",
    "Ladakh", "Lakshadweep", "Puducherry"
  ];

  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    pincode: '',
    flatNo: '',
    area: '',
    landmark: '',
    city: '',
    state: '',
    isDefault: false,
    lat: null,
    lon: null
  });

  // Fetch addresses from API
  useEffect(() => {
    const fetchAddresses = async (id) => {
      try {
        const response = await fetch(`${BaseUrl}/user/addresses/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = await response.json();
        console.log('Fetched address data:', data);
        // Map is_default to isDefault for frontend use
        const mapped = Array.isArray(data)
          ? data.map(addr => ({
            ...addr,
            isDefault: addr.is_default, // map snake_case to camelCase
          }))
          : [];
        setAddresses(mapped);
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };

    if (user?.id && typeof user.id === 'number') {
      fetchAddresses(user.id);
    } else {
      console.warn('Invalid or missing user.id:', user?.id);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Map frontend fields to backend fields
    const payload = {
      user_id: user.id,
      full_name: formData.fullName,
      mobile_number: formData.mobileNumber,
      pincode: formData.pincode,
      line1: `${formData.flatNo}, ${formData.area}`,
      line2: '', // You can add a separate field if needed
      landmark: formData.landmark,
      city: formData.city,
      state: formData.state,
      country: 'India',
      is_default: formData.isDefault,
      lat: formData.lat,
      lon: formData.lon
    };

    console.log('Submitting address payload:', payload);

    try {
      const response = await fetch(`${BaseUrl}/user/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const newAddress = await response.json();
        setAddresses([...addresses, newAddress]);
        setShowForm(false);
        setFormData({
          fullName: '',
          mobileNumber: '',
          pincode: '',
          flatNo: '',
          area: '',
          landmark: '',
          city: '',
          state: '',
          isDefault: false,
          lat: null,
          lon: null
        });
      }
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  const deleteAddress = async (id) => {
    try {
      await fetch(`${BaseUrl}/user/addresses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setAddresses(addresses.filter(addr => addr.id !== id));
      setShowDeleteConfirmation(true); // <-- Show confirmation modal
      console.log(`Address with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  // Handler for closing the confirmation modal
  const closeDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
  };

  // Handler for delete icon click
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeletePopup(true);
  };

  // Handler for confirming delete
  const confirmDelete = () => {
    if (deleteId !== null) {
      deleteAddress(deleteId);
    }
    setShowDeletePopup(false);
    setDeleteId(null);
  };

  // Handler for cancelling delete
  const cancelDelete = () => {
    setShowDeletePopup(false);
    setDeleteId(null);
  };

  const setDefaultAddress = async (id) => {
    try {
      await fetch(`${BaseUrl}/addresses/set-default`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ address_id: id })
      });

      setAddresses(addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      })));
      console.log({ address_id: id, user_id: user.id });
    } catch (error) {
      console.error('Error setting default address:', error);
    }
  };

  const handleAutofill = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=d796b29e46d84caebda6f2d39a91f766`);
        const data = await response.json();

        if (data.results.length > 0) {
          const location = data.results[0].components;

          setFormData((prev) => ({
            ...prev,
            city: location.city || location.town || location.village || '',
            state: location.state || '',
            pincode: location.postcode || '',
            area: location.suburb || location.neighbourhood || '',
            flatNo: '',
            landmark: '',
            lat: latitude,
            lon: longitude
          }));
        } else {
          alert("Could not autofill the address. Please fill it manually.");
        }
      } catch (error) {
        console.error('Autofill error:', error);
        alert("Failed to fetch location data.");
      }
    }, (err) => {
      console.error(err);
      alert("Unable to fetch your location.");
    });
  };

  return (
    <div className="addresses-page">
      <EcommerceNavbar />

      <div className="address-container">
        <h2>Saved Addresses</h2>

        <div className="address-layout">
          {/* Left side - Address cards */}
          <div className="address-list">
            <div className="address-grid">
              {/* Add New Address Card */}
              <div className="address-card add-new" onClick={() => setShowForm(true)}>
                <FaPlus size={24} />
                <span>Add New Address</span>
              </div>

              {/* Existing Address Cards */}
              {addresses.map(address => (
                <div key={address.id} className={`address-card ${address.is_default ? 'default' : ''}`}>
                  {address.is_default && <div className="default-badge">Default</div>}
                  <div className="address-content">
                    <h3>{address.full_name}</h3>
                    <p>{address.line1}</p>
                    {address.landmark && <p>Landmark: {address.landmark}</p>}
                    <p>{address.city}, {address.state} - {address.pincode}</p>
                    <p>{address.country}</p>
                    <p>Phone: {address.mobile_number}</p>
                    {address.lat && address.lon && (
                      <p>Lat/Lon: {address.lat}, {address.lon}</p>
                    )}
                  </div>
                  <div className="address-actions">
                    <button
                      onClick={() => setDefaultAddress(address.id)}
                      disabled={address.is_default}
                    >
                      {address.is_default ? 'Default' : 'Set Default'}
                    </button>
                    <div>
                      <button className="icon-btn" title="Edit">
                        <FaEdit />
                      </button>
                      <button
                        className="icon-btn"
                        title="Delete"
                        onClick={() => handleDeleteClick(address.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Address form (conditionally rendered) */}
          {showForm && (
            <div className="address-form-sidebar">
              <div className="address-form-container">
                <h3>Add New Address</h3>
                <button className="close-btn" onClick={() => setShowForm(false)}>×</button>

                {/* Autofill Button */}
                <div className="autofill-section">
                  <span>Save time. Autofill your current location.</span>
                  <button type="button" className="autofill-btn" onClick={handleAutofill}>
                    Autofill
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="add-form-group">
                    <label>Full Name (First and Last Name)*</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="add-form-group">
                    <label>Mobile Number*</label>
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="add-form-group">
                    <label>Pincode*</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="add-form-group">
                    <label>Flat, House No, Building, Company, Apartment*</label>
                    <input
                      type="text"
                      name="flatNo"
                      value={formData.flatNo}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="add-form-group">
                    <label>Area, Street, Sector, Village*</label>
                    <input
                      type="text"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="add-form-group">
                    <label>Landmark</label>
                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="add-form-group">
                    <label>Town/City*</label>
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
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select State</option>
                      {indianStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  <div className="add-form-check">
                    <input
                      type="checkbox"
                      id="defaultAddress"
                      name="isDefault"
                      checked={formData.isDefault}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="defaultAddress">Make this default</label>
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
        {showDeletePopup && (
          <div className="delete-popup-overlay">
            <div className="delete-popup">
              <p>Are you sure you want to delete this address?</p>
              <div className="popup-actions">
                <button onClick={cancelDelete} className="no-btn">No</button>
                <button onClick={confirmDelete} className="yes-btn">Yes</button>
              </div>
            </div>
          </div>
        )}
        {/* Confirmation modal after deletion */}
        {showDeleteConfirmation && (
          <div className="delete-popup-overlay">
            <div className="delete-popup">
              <p>Address deleted successfully.</p>
              <div className="popup-actions">
                <button onClick={closeDeleteConfirmation} className="yes-btn">OK</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Addresses;