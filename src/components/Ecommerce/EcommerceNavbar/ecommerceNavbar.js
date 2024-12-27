import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, InputBase, Badge, Box, List, ListItem, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import './ecommerceNavbar.css';

const Search = styled('div')(({ theme }) => ({
  '--theme-shape-border-radius': theme.shape.borderRadius,
  '--theme-palette-common-white': theme.palette.common.white,
  '--theme-spacing-2': theme.spacing(2),
  '--theme-spacing-3': theme.spacing(3),
  position: 'relative',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  '--theme-spacing-0-2': theme.spacing(0, 1),
  background: '#f0f0f0',
  borderRadius: '6px',
  cursor: 'pointer'
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  '--theme-spacing-1-1-1-0': theme.spacing(1, 1, 1, 0),
  '--theme-spacing-4': theme.spacing(4),
  '--theme-transitions-create-width': theme.transitions.create('width'),
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

function EcommerceNavbar() {
  const [searchInput, setSearchInput] = useState('');
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchProducts = async (query) => {
    try {
      console.log(`Fetching products for query: ${query}`);
      const response = await fetch(`http://localhost:8001/products?keywords=${query}`);
      const data = await response.json();
      console.log('Fetched products:', data);
      if (Array.isArray(data) && data.length === 0) {
        setError('No products found');
      } else {
        setError('');
      }
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
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

  const filteredProducts = Array.isArray(products) ? products.filter(product =>
    product.name.toLowerCase().includes(searchInput.toLowerCase())
  ) : [];

  return (
    <div className='ecommerce-navbar'>
      <div className='toolbar'>
        <IconButton edge="start" color="inherit">
          <AccountCircle sx={{color:'white'}}/>
          <Typography variant="h6" sx={{ color: 'white', marginLeft: 5 }} className='nav-heading'>
            neuraLife
          </Typography>
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <Search className="search">
          <SearchIconWrapper className="searchIconWrapper"  onClick={handleSearchSubmit}>
            <SearchIcon sx={{color:'black'}}/>
          </SearchIconWrapper>
          <StyledInputBase
            className="styledInputBase"
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
            value={searchInput}
            onChange={handleSearchChange}
            onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
          />
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
        <IconButton color="inherit" sx={{ mx: 1.5 }} onClick={() => navigate('/cart')}>
          <Badge badgeContent={4} color="secondary" sx={{ '& .MuiBadge-badge': { fontSize: '0.75rem', padding: '0 4px', marginTop: '-6px'} }}>
          <span style={{ color: 'white', fontSize: '1rem' }} className='en-urbanist-regular'>Cart</span>
          </Badge>
        </IconButton>
        <IconButton color="inherit" sx={{ mx: 1.5 }}>
          <Badge badgeContent={17} color="secondary" sx={{ '& .MuiBadge-badge': { fontSize: '0.75rem', padding: '0 4px', marginTop: '-6px' }}}>
          <span style={{ color: 'white', fontSize: '1rem' }} className='en-urbanist-regular'>Mail</span>
          </Badge>
          </IconButton>
        <IconButton color="inherit" sx={{ mx: 1.5 }}>
        <span style={{ color: 'white', fontSize: '1rem' }} className='en-urbanist-regular'>Orders</span>
        </IconButton>
        <IconButton color="inherit" sx={{ mx: 1.5 }}>
        <span style={{ color: 'white', fontSize: '1rem' }} className='en-urbanist-regular'>Favorites</span>
        </IconButton>
        <IconButton edge="start" color="inherit" sx={{ mx: 1.5 }}>
        <AccountCircle sx={{color:'white'}}/>
        </IconButton>
      </div>
    </div>
  );
}

export default EcommerceNavbar;