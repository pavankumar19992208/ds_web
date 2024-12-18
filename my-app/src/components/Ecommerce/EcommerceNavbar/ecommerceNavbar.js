import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, InputBase, Badge, Box, List, ListItem, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MailIcon from '@mui/icons-material/Mail';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ListAltIcon from '@mui/icons-material/ListAlt';
import './ecommerceNavbar.css';

const Search = styled('div')(({ theme }) => ({
  '--theme-shape-border-radius': theme.shape.borderRadius,
  '--theme-palette-common-white': theme.palette.common.white,
  '--theme-spacing-2': theme.spacing(2),
  '--theme-spacing-3': theme.spacing(3),
  position: 'relative',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  '--theme-spacing-0-2': theme.spacing(0, 2),
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
  const navigate = useNavigate();

  const fetchProducts = async (query) => {
    try {
      console.log(`Fetching products for query: ${query}`);
      const response = await fetch(`http://localhost:8001/products?search=${query}`);
      const data = await response.json();
      console.log('Fetched products:', data);
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchInput(query);
    if (query) {
      fetchProducts(query);
    } else {
      setProducts([]);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product-overview/${productId}`);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className='ecommerce-navbar'>
      <div className='toolbar'>
        <IconButton edge="start" color="inherit">
          <AccountCircle sx={{color:'white'}}/>
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <Search className="search">
          <SearchIconWrapper className="searchIconWrapper">
            <SearchIcon sx={{color:'black'}}/>
          </SearchIconWrapper>
          <StyledInputBase
            className="styledInputBase"
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
            value={searchInput}
            onChange={handleSearchChange}
          />
          {filteredProducts.length > 0 && (
            <ResultsList>
              <List>
                {filteredProducts.map((product) => (
                  <ListItem 
                    key={product.id} 
                    button 
                    onClick={() => handleProductClick(product.id)}
                  >
                    {product.name}
                  </ListItem>
                ))}
              </List>
            </ResultsList>
          )}
        </Search>
        <IconButton color="inherit" sx={{ mx: 1 }}>
          <Badge badgeContent={4} color="secondary">
            <ShoppingCartIcon sx={{color:'white'}}/>
          </Badge>
        </IconButton>
        <IconButton color="inherit" sx={{ mx: 1 }}>
          <Badge badgeContent={17} color="secondary">
            <MailIcon sx={{color:'white'}}/>
          </Badge>
        </IconButton>
        <IconButton color="inherit" sx={{ mx: 1 }}>
          <ListAltIcon sx={{color:'white'}}/>
        </IconButton>
        <IconButton color="inherit" sx={{ mx: 1 }}>
          <FavoriteIcon sx={{color:'white'}}/>
        </IconButton>
        <IconButton edge="start" color="inherit" sx={{ mx: 1 }}>
          <AccountCircle sx={{color:'white'}}/>
        </IconButton>
      </div>
    </div>
  );
}

export default EcommerceNavbar;