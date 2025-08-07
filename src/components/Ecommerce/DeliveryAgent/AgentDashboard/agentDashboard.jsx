import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './agentDashboard.css';
import BaseUrl from '../../../../config';

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
  const [orders, setOrders] = useState([]);
  const [orderMarkers, setOrderMarkers] = useState([]); // State to hold order markers
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [infoWindow, setInfoWindow] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedCustomerName, setSelectedCustomerName] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [showDeliverPopup, setShowDeliverPopup] = useState(false);


  const handleLogout = () => {
    localStorage.removeItem('agentToken');
    localStorage.removeItem('agentData');
    window.location.href = '/agent-login';
  };

  const handleDeliver = () => {
    if (!currentLocation || !selectedDestination) {
      alert("Please select a destination and ensure your location is available.");
      return;
    }
    const distance = getDistanceMeters(currentLocation, selectedDestination);
    if (distance <= 20) {
      // Proceed with delivery logic here
      alert("Delivery successful!"); // Replace with your delivery logic
    } else {
      setShowDeliverPopup(true);
    }
  };

  // Add this helper function to calculate distance in meters between two lat/lng points
  function getDistanceMeters(loc1, loc2) {
    if (!loc1 || !loc2) return Infinity;
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371000; // Earth radius in meters
    const dLat = toRad(loc2.lat - loc1.lat);
    const dLng = toRad(loc2.lng - loc1.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(loc1.lat)) *
      Math.cos(toRad(loc2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // --- 1. Fetch orders from the backend ---
  useEffect(() => {
    const agentData = localStorage.getItem('agentData');
    const agentId = agentData ? JSON.parse(agentData).id : null;
    console.log('Fetched agentId:', agentId);
    if (!agentId) return;

    fetch(`${BaseUrl}/orders/agent/${agentId}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => setOrders(data.orders || []))
      .catch(error => {
        console.error("Failed to fetch orders:", error);
        setOrders([]);
      });
  }, []); // Runs once on component mount

  // --- 2. Initialize the map (without markers) ---
  const initMap = () => {
    if (!window.google || !window.google.maps || !mapRef.current) return;

    // Use currentLocation if available
    const center = currentLocation || { lat: 22.9734, lng: 78.6569 };

    const newMap = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: currentLocation ? 15 : 5,
      zoomControl: true,
      mapTypeControl: true,
      streetViewControl: false,
      rotateControl: true,
      fullscreenControl: false,
    });

    setMap(newMap);

    // If currentLocation exists, set blue dot marker
    if (currentLocation) {
      const marker = new window.google.maps.Marker({
        position: currentLocation,
        map: newMap,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#4285F4',
          fillOpacity: 0.9,
          strokeColor: '#fff',
          strokeWeight: 2,
        },
        zIndex: 999,
      });
      setLocationMarker(marker);
    }

    // Add "My Location" button as before
    const locationButton = document.createElement("button");
    locationButton.textContent = "📍 My Location";
    locationButton.classList.add("custom-map-location-btn");
    locationButton.addEventListener("click", () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
            newMap.setCenter(pos);
            newMap.setZoom(18);

            if (locationMarker) {
              locationMarker.setMap(null);
            }

            const marker = new window.google.maps.Marker({
              position: pos,
              map: newMap,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#4285F4',
                fillOpacity: 0.9,
                strokeColor: '#fff',
                strokeWeight: 2,
              },
              zIndex: 999,
            });
            setLocationMarker(marker);
            setCurrentLocation(pos);
          },
          () => alert("Could not get your location.")
        );
      } else {
        alert("Geolocation not supported.");
      }
    });
    newMap.controls[window.google.maps.ControlPosition.TOP_RIGHT].push(locationButton);
  };

  // --- 3. A separate useEffect to draw markers when map and orders are ready ---
  useEffect(() => {
    // Exit if map isn't initialized or there are no orders
    if (!map || !orders.length) return;

    // Clear any old markers from the map before drawing new ones
    orderMarkers.forEach(marker => marker.setMap(null));

    const newMarkers = [];
    const bounds = new window.google.maps.LatLngBounds();

    orders.forEach(order => {
      // Your backend provides 'lat' and 'lon'. Ensure they are valid numbers.
      const lat = parseFloat(order.lat);
      const lon = parseFloat(order.lon);
      console.log(`Order ID ${order.id}, lat: ${lat}, lon: ${lon}`);

      if (!isNaN(lat) && !isNaN(lon)) {
        const position = { lat, lng: lon };
        const marker = new window.google.maps.Marker({
          position,
          map: map,
          title: `Order #${order.id} for ${order.user_name}`,
          icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
          }
        });

        // Add marker click listener:
        marker.addListener('click', () => {
          setSelectedDestination(position);
          setSelectedAddress(order.address);
          setSelectedCustomerName(order.user_name); // Set customer name
          setSelectedOrderId(order.id); // Set order ID

          // Show an info window (optional)
          if (infoWindow) infoWindow.close();
          const iw = new window.google.maps.InfoWindow({
            content: `<div>Order #${order.id}<br/>${order.user_name}</div>`
          });
          iw.open(map, marker);
          setInfoWindow(iw);
        });

        newMarkers.push(marker);
        bounds.extend(position); // Add this marker's position to the bounds
      }
    });

    setOrderMarkers(newMarkers); // Save the new markers to state

    // Optional: Automatically adjust the map's zoom and center to fit all markers
    if (newMarkers.length > 0) {
      map.fitBounds(bounds);
    }

  }, [map, orders]); // This effect depends on `map` and `orders`

  // Draw route from current location to dummy destination
  const handleSetRoute = () => {
    if (!window.google || !map || !currentLocation) {
      alert("Map or your current location is not ready. Click 'My Location' first.");
      return;
    }
    if (!selectedDestination) {
      alert("Please click on a marker to choose your delivery address.");
      return;
    }
    if (routePolyline) {
      routePolyline.setMap(null);
    }
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: currentLocation,
        destination: selectedDestination,
        travelMode: window.google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === "OK") {
          const polyline = new window.google.maps.Polyline({
            path: result.routes[0].overview_path,
            strokeColor: "#FFD600",
            strokeOpacity: 1.0,
            strokeWeight: 8,
            map: map
          });
          setRoutePolyline(polyline);
          // Fit map to show both current location and selected marker
          const bounds = new window.google.maps.LatLngBounds();
          bounds.extend(currentLocation);
          bounds.extend(selectedDestination);
          map.fitBounds(bounds);
        } else {
          alert("Could not set route: " + status);
        }
      }
    );
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
  // const initMap = () => {
  //   if (!window.google || !window.google.maps || !mapRef.current) return;

  //   const center = currentLocation || { lat: 22.9734, lng: 78.6569 };

  //   const newMap = new window.google.maps.Map(mapRef.current, {
  //     center,
  //     zoom: currentLocation ? 15 : 5,
  //     zoomControl: true,
  //     mapTypeControl: true,
  //     scaleControl: false,
  //     streetViewControl: false,
  //     rotateControl: true,
  //     fullscreenControl: false,
  //   });

  //   setMap(newMap);

  //   // Add order markers
  //   orders.forEach(order => {
  //     console.log('Order:', order.description, 'Lat:', order.lat, 'Lng:', order.lon);

  //     if (order.lat && order.lon) {
  //       new window.google.maps.Marker({
  //         position: { lat: Number(order.lat), lng: Number(order.lon) },
  //         map: newMap,
  //         title: order.user_name + " - " + order.description,
  //         icon: {
  //           url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png", // or any custom icon
  //         }
  //       });
  //     }
  //   });

  //   // Add custom "Current Location" button
  //   const locationButton = document.createElement("button");
  //   locationButton.textContent = "📍 My Location";
  //   locationButton.classList.add("custom-map-location-btn");
  //   locationButton.style.background = "#fff";
  //   locationButton.style.border = "2px solid #4285F4";
  //   locationButton.style.borderRadius = "4px";
  //   locationButton.style.padding = "6px 12px";
  //   locationButton.style.margin = "10px";
  //   locationButton.style.cursor = "pointer";
  //   locationButton.style.fontWeight = "bold";

  //   locationButton.addEventListener("click", () => {
  //     if (navigator.geolocation) {
  //       navigator.geolocation.getCurrentPosition(
  //         (position) => {
  //           const { latitude, longitude } = position.coords;
  //           const pos = { lat: latitude, lng: longitude };
  //           newMap.setCenter(pos);
  //           newMap.setZoom(18);

  //           // Remove previous marker if exists
  //           if (locationMarker) {
  //             locationMarker.setMap(null);
  //           }

  //           // Add blue dot marker
  //           const marker = new window.google.maps.Marker({
  //             position: pos,
  //             map: newMap,
  //             icon: {
  //               path: window.google.maps.SymbolPath.CIRCLE,
  //               scale: 10,
  //               fillColor: '#4285F4',
  //               fillOpacity: 0.9,
  //               strokeColor: '#fff',
  //               strokeWeight: 2,
  //             },
  //             zIndex: 999,
  //           });
  //           setLocationMarker(marker);
  //         },
  //         () => {
  //           alert("Could not get your location.");
  //         }
  //       );
  //     } else {
  //       alert("Geolocation not supported.");
  //     }
  //   });

  //   newMap.controls[window.google.maps.ControlPosition.TOP_RIGHT].push(locationButton);
  // };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
          setCurrentLocation(pos);
        },
        (err) => {
          console.error('Error getting location:', err);
          // Optionally keep a default
        }
      );
    }
  }, []);

  // Load Google Maps script and initialize map
  useEffect(() => {
    if (window.google && window.google.maps) {
      initMap();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,directions`; // added directions library
    script.async = true;
    script.onload = () => initMap();
    document.head.appendChild(script);

    return () => {
      // Clean up the script when the component unmounts
      document.head.removeChild(script);
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
      {/* <div className="user-name">
        <p className='user-name-text'>Hello, {agentName}</p>
      </div> */}

      {/* Location and refresh button */}
      {/* <div className="location-section">
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
      </div> */}

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
          style={{ width: '100%', height: '100%' }}
        />
        <div className="order-details">
          <div className="dummy-destination">
            <span className="detail-label">Delivery Address:</span>
            <span className="detail-value"> {selectedAddress || '--'}</span>
          </div>
          <div className="order-detail">
            <span className="detail-label">Customer Name:</span>
            <span className="detail-value">{selectedCustomerName || '--'}</span>
          </div>
          <div className="order-detail">
            <span className="detail-label">Order ID:</span>
            <span className="detail-value">{selectedOrderId ? `#${selectedOrderId}` : '--'}</span>
          </div>
        </div>
      </div>

      {/* Order details section */}


      {/* Route and Deliver buttons above the footer */}
      <div className="route-deliver-actions">
        <button className="route-btn" onClick={handleSetRoute}>Set Route</button>
        <button className="deliver-btn" onClick={handleDeliver}>Deliver</button>
      </div>
      {showDeliverPopup && (
        <div className="agt-dash-popup">
          <div className="agt-dash-popup-content">
            <p>You must be within 20 meters of the delivery location to deliver.</p>
            <button onClick={() => setShowDeliverPopup(false)}>OK</button>
          </div>
        </div>
      )}

      {/* Footer with home icon */}
      <footer className="agt-footer">
        <div className="home-icon">⌂</div>
        <div className='agt-orders-btn' onClick={() => Navigate('/agent-orders')}> Order</div>
      </footer>
    </div>
  );
};

export default AgentDashboard;