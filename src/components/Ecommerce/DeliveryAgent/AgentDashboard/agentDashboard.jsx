import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './agentDashboard.css';

const GOOGLE_MAPS_API_KEY = 'AIzaSyCRa-fVZXbbr5jsNPNGhbTK2YGgeCOE6UE';

const DUMMY_DESTINATION = {
  lat: 17.470082,
  lng: 78.446684,
  address: "CRF Colony, Balanagar, Hyderabad, Telangana 500037"
};

const AgentDashboard = () => {
  const Navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [agentName, setAgentName] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentAddress, setCurrentAddress] = useState('');
  const [map, setMap] = useState(null);
  const [circle, setCircle] = useState(null);
  const mapRef = useRef(null);
  const [locationMarker, setLocationMarker] = useState(null);
  const [routePolyline, setRoutePolyline] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('agentToken');
    localStorage.removeItem('agentData');
    window.location.href = '/agent-login';
  };

  useEffect(() => {
    const agentData = localStorage.getItem('agentData');
    if (agentData) {
      const parsedData = JSON.parse(agentData);
      setAgentName(parsedData.name || 'Agent');
    }
  }, []);

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });

          // Reverse geocode to get address
          reverseGeocode(latitude, longitude);

          // Center map and update marker/circle
          if (map) {
            map.setCenter({ lat: latitude, lng: longitude });
            map.setZoom(20); // Zoom in close to show 1m circle
          }
          // Always update or create the circle, even if map is not set yet
          updateLocationCircle(latitude, longitude, 1); // Always 1 meter radius
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Could not get your location. Please enable location services.');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  // Draw route from current location to dummy destination
  const handleSetRoute = () => {
    if (!window.google || !window.google.maps || !map || !currentLocation) {
      alert("Map or location not ready");
      return;
    }

    // Remove previous route if exists
    if (routePolyline) {
      routePolyline.setMap(null);
    }

    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      map: map,
      suppressMarkers: false
    });

    directionsService.route(
      {
        origin: currentLocation,
        destination: { lat: DUMMY_DESTINATION.lat, lng: DUMMY_DESTINATION.lng },
        travelMode: window.google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(result);
          setRoutePolyline(directionsRenderer);
        } else {
          alert("Could not set route: " + status);
        }
      }
    );
  };

  // Update or create the blue location circle with smaller size
  const updateLocationCircle = (lat, lng) => {
    if (!window.google || !window.google.maps || !map) return;

    const location = new window.google.maps.LatLng(lat, lng);

    if (locationMarker) {
      locationMarker.setMap(null);
    }
    const marker = new window.google.maps.Marker({
      position: location,
      map,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10, // size in pixels
        fillColor: '#4285F4',
        fillOpacity: 0.8,
        strokeColor: '#4285F4',
        strokeWeight: 2,
      },
      zIndex: 999,
    });

    setLocationMarker(marker);

  };

  // Reverse geocode coordinates to address
  const reverseGeocode = (lat, lng) => {
    if (!window.google || !window.google.maps) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        setCurrentAddress(results[0].formatted_address);
      } else {
        console.error('Geocoder failed:', status);
      }
    });
  };

  // Initialize map with current location
  const initMap = () => {
    if (!window.google || !window.google.maps || !mapRef.current) return;

    // Default to India center if no location yet
    const center = currentLocation || { lat: 22.9734, lng: 78.6569 };

    const newMap = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: currentLocation ? 15 : 5,
      zoomControl: true,
      mapTypeControl: true,
      scaleControl: true,
      streetViewControl: true,
      rotateControl: true,
      fullscreenControl: true,
      gestureHandling: 'greedy'
    });

    setMap(newMap);

    // Add click listener to update location
    newMap.addListener('click', (e) => {
      const { lat, lng } = e.latLng;
      setCurrentLocation({ lat: lat(), lng: lng() });
      reverseGeocode(lat(), lng());

      // Update circle position when clicked with smaller size
      if (circle) {
        circle.setCenter(new window.google.maps.LatLng(lat(), lng()));
        circle.setRadius(1);
      } else {
        updateLocationCircle(lat(), lng());
      }
      if (map) {
        map.setZoom(20);
      }
    });
  };

  // Load Google Maps script and initialize map
  useEffect(() => {
    if (window.google && window.google.maps) {
      initMap();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.onload = () => {
      initMap();
      // Get location after map loads
      getCurrentLocation();
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup
      document.body.removeChild(script);
    };
  }, []);

  // Update map when currentLocation changes
  useEffect(() => {
    if (map && currentLocation) {
      map.setCenter(currentLocation);
      map.setZoom(20);
    }
  }, [currentLocation, map]);

  return (
    <div className="delivery-page">
      {/* Sidebar */}
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

      {/* User name section */}
      <div className="user-name">
        <h2>Hello, {agentName}</h2>
      </div>

      {/* Location and refresh button */}
      <div className="location-section">
        <div className="current-location">
          <span role="img" aria-label="location">📍</span>
          {currentAddress || 'Getting your location...'}
        </div>
        <button
          className="refresh-location-btn"
          onClick={getCurrentLocation}
        >
          Refresh Location
        </button>
      </div>

           {/* Dummy destination display
      <div className="dummy-destination">
        <span className="detail-label">Delivery Address:</span>
        <span className="detail-value">{DUMMY_DESTINATION.address}</span>
      </div> */}

      {/* Map container */}
      <div className="map-container">
        <div
          className="map-placeholder"
          ref={mapRef}
          style={{ width: '100%', height: '200px', minHeight: '200px' }}
        />
      </div>

      {/* Order details section */}
      <div className="order-details">
         <div className="dummy-destination">
        <span className="detail-label">Delivery Address:</span>
        <span className="detail-value">{DUMMY_DESTINATION.address}</span>
      </div>
        <div className="order-detail">
          <span className="detail-label">Order Name:</span>
          <span className="detail-value">Grocery Delivery</span>
        </div>
        <div className="order-detail">
          <span className="detail-label">Order ID:</span>
          <span className="detail-value">#ORD-123456</span>
        </div>
        <div className="order-detail">
          <span className="detail-label">Order Type:</span>
          <span className="detail-value">Express Delivery</span>
        </div>
      </div>

      {/* Route and Deliver buttons above the footer */}
      <div className="route-deliver-actions">
        <button className="route-btn" onClick={handleSetRoute}>Set Route</button>
        <button className="deliver-btn">Deliver</button>
      </div>

      {/* Footer with home icon */}
      <footer className="agt-footer">
        <div className="home-icon">⌂</div>
        <div className='agt-orders-btn' onClick={() => Navigate('/agent-orders')}> Order</div>
      </footer>
    </div>
  );
};

export default AgentDashboard;