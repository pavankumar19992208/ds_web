import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, InputBase, Badge, Box, List, ListItem, Paper, Typography, Button, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import './ecommerceNavbar.css';
import BaseUrl from '../../../config';
import EcommerceSidebar from '../EcommerceSidebar/EcommerceSidebar';
import AuthWrapper from '../Authentication/AuthWrapper';
import { GlobalStateContext } from '../GlobalState';
import logo from '../../../images/logo.png'; // Adjust the path as needed
import orders from '../../../images/orders.png'; // Adjust the path as needed
import { FcLike } from "react-icons/fc";
import mail from '../../../images/mail.png'; // Adjust the path as needed
import cart from '../../../images/shopping-cart.png'; // Adjust the path as needed
import profilePic from '../../../images/man.png'; // Adjust the path as needed

const Search = styled('div')(({ theme }) => ({
  '--theme-shape-border-radius': theme.shape.borderRadius,
  '--theme-palette-common-white': theme.palette.common.white,
  '--theme-spacing-2': theme.spacing(2),
  '--theme-spacing-3': theme.spacing(3),
  position: 'relative',
  width: '100%',
  maxWidth: '500px',
  marginLeft: '20px',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  '--theme-spacing-0-2': theme.spacing(0, 1),
  background: '#f0f0f0',
  borderRadius: '6px',
  cursor: 'pointer',
  position: 'absolute',
  right: 0,
  bottom: '-40px',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  '--theme-spacing-1-1-1-0': theme.spacing(1, 1, 1, 0),
  '--theme-spacing-4': theme.spacing(4),
  '--theme-transitions-create-width': theme.transitions.create('width'),
  width: '100%',
}));

const ResultsList = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  zIndex: 1000,
  maxHeight: '200px',
  overflowY: 'auto',
}));

const ProfileBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '8px 16px',
  borderRadius: '32px',
  backgroundColor: '#ffffff',
  '&:hover': {
    backgroundColor: 'rgba(32, 76, 194, 0.1)',
  },
});

function EcommerceNavbar() {
  const [searchInput, setSearchInput] = useState('');
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authPopupOpen, setAuthPopupOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const navigate = useNavigate();
  const { user } = useContext(GlobalStateContext) || {};

  // Fetch cart count for logged-in user
  useEffect(() => {
    const fetchCartCount = async () => {
      if (user && user.id) {
        try {
          const response = await fetch(`${BaseUrl}/cart/${user.id}`);
          const data = await response.json();
          setCartCount(Array.isArray(data) ? data.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0);
        } catch (err) {
          setCartCount(0);
        }
      } else {
        setCartCount(0);
      }
    };
    fetchCartCount();
  }, [user]);

  // Fetch order count for logged-in user
  useEffect(() => {
    const fetchOrderCount = async () => {
      if (user && user.id) {
        try {
          const response = await fetch(`${BaseUrl}/orders/user/${user.id}`);
          const data = await response.json();
          setOrderCount(Array.isArray(data) ? data.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0);
        } catch (err) {
          setOrderCount(0);
        }
      } else {
        setOrderCount(0);
      }
    };
    fetchOrderCount();
  }, [user]);

  const fetchProducts = async (query) => {
    try {
      const response = await fetch(`${BaseUrl}/products?keywords=${query}`);
      const data = await response.json();
      if (Array.isArray(data) && data.length === 0) {
        setError('No products found');
      } else {
        setError('');
      }
      setProducts(data);
    } catch (error) {
      setError('Error fetching products');
      setProducts([]);
    }
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchInput(query);
    if (query) {
      fetchProducts(query);
    } else {
      setProducts([]);
      setError('');
    }
  };

  const handleSearchSubmit = () => {
    if (searchInput) {
      navigate(`/products?search=${searchInput}`);
    }
  };

  const handleProductClick = (productId) => {
    setSearchInput('');
    window.open(`/product-overview/${productId}`, '_blank');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const filteredProducts = Array.isArray(products) ? products.filter(product =>
    product.name.toLowerCase().includes(searchInput.toLowerCase())
  ) : [];

  return (
    <div className='ecommerce-navbar'>
      <div className='toolbar'>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/ecommerce-dashboard')}>
            <img src={logo} alt="Logo" style={{ width: 38, height: 38 }}/>
          </IconButton>
          <button  className='nav-heading' onClick={() => navigate('/ecommerce-dashboard')}>
            neuraLife
          </button>
          
          <Search className="search">
            <StyledInputBase
              className="styledInputBase"
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              value={searchInput}
              onChange={handleSearchChange}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
            />
            <SearchIconWrapper className="searchIconWrapper" onClick={handleSearchSubmit}>
              <SearchIcon sx={{ color: 'black' }} />
            </SearchIconWrapper>
            {searchInput && (
              <ResultsList>
                <List>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <ListItem
                        key={product.id}
                        button
                        onClick={() => handleProductClick(product.id)}
                      >
                        {product.name}
                      </ListItem>
                    ))
                  ) : (
                    <ListItem>
                      {error || 'No products found'}
                    </ListItem>
                  )}
                </List>
              </ResultsList>
            )}
          </Search>
        </Box>

        <Box sx={{ flexGrow: 1 }} />
        
        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <IconButton color="inherit" onClick={() => navigate('/cart')}>
              <Badge badgeContent={cartCount} sx={{ '& .MuiBadge-badge': { backgroundColor: '#1F309B', color: '#fff', fontSize: '0.75rem', padding: '0 4px', marginTop: '-6px' } }}>
                <img src={cart} alt="Logo" style={{ width: 28, height: 28 }}/>
              </Badge>
            </IconButton>
            
            <IconButton color="inherit">
              <Badge badgeContent={17} sx={{ '& .MuiBadge-badge': { backgroundColor: '#1F309B', color: '#fff', fontSize: '0.75rem', padding: '0 4px', marginTop: '-6px' } }}>
                <img src={mail} alt="Logo" style={{ width: 28, height: 28 }}/>
              </Badge>
            </IconButton>
            
            <IconButton color="inherit" onClick={() => navigate('/orders')}>
              <Badge badgeContent={orderCount} sx={{ '& .MuiBadge-badge': { backgroundColor: '#1F309B', color: '#fff', fontSize: '0.75rem', padding: '0 4px', marginTop: '-6px' } }}>
              <img src={orders} alt="Logo" style={{ width: 30, height: 30 }}/>
              </Badge>
            </IconButton>
            
            <IconButton color="inherit">
              <FcLike />
            </IconButton>
            
            <ProfileBox onClick={() => setSidebarOpen(true)}>
              <Typography variant="body1" sx={{ color: 'black', fontWeight: '600' }}>
                {user.name || 'Profile'}
              </Typography>
              <Avatar sx={{ width: 36, height: 36, bgcolor: 'black', color: '#edeeef' }}>
                <img src={profilePic} alt="Logo" style={{ width: 36, height: 36 }}/>
              </Avatar>
            </ProfileBox>
          </Box>
        ) : (
          <Button
            color="inherit"
            sx={{
              color: '#1F309B',
              fontWeight: 'bold',
              border: '2px solid #1F309B',
              borderRadius: '20px',
              padding: '6px 24px',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)'
              }
            }}
            onClick={() => setAuthPopupOpen(true)}
          >
            Login
          </Button>
        )}
      </div>
      
      {/* Sidebar Drawer */}
      <EcommerceSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Authentication Popup */}
      {authPopupOpen && (
        <AuthWrapper onClose={() => setAuthPopupOpen(false)} />
      )}
    </div>
  );
}

export default EcommerceNavbar;