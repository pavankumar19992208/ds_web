import React from 'react';
import { AppBar, Toolbar, IconButton, InputBase, Badge, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MailIcon from '@mui/icons-material/Mail';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ListAltIcon from '@mui/icons-material/ListAlt';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.common.white,
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    color: 'black', // Change text color to black
    [theme.breakpoints.up('md')]: {
      width: '30ch', // Increased width
    },
  },
}));

function EcommerceNavbar() {
  return (
    <AppBar style={{backgroundColor:"#084152"}} position="fixed">
      <Toolbar>
        <IconButton edge="start" color="inherit">
          <AccountCircle />
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <Search>
          <SearchIconWrapper>
            <SearchIcon sx={{color:'black'}}/>
          </SearchIconWrapper>
          <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} />
        </Search>
        <IconButton color="inherit" sx={{ mx: 1 }}>
          <Badge badgeContent={4} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        <IconButton color="inherit" sx={{ mx: 1 }}>
          <Badge badgeContent={17} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <IconButton color="inherit" sx={{ mx: 1 }}>
          <ListAltIcon />
        </IconButton>
        <IconButton color="inherit" sx={{ mx: 1 }}>
          <FavoriteIcon />
        </IconButton>
        <IconButton edge="start" color="inherit" sx={{ mx: 1 }}>
          <AccountCircle />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default EcommerceNavbar;