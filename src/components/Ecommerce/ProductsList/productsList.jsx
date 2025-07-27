import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import EcommerceNavbar from '../EcommerceNavbar/ecommerceNavbar';
import BaseUrl from '../../../config';
import { useParams } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import { Slider, Box, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import { GlobalStateContext } from '../GlobalState'; // Make sure this path is correct
import './productsList.css';
import Lottie from 'lottie-react';
import loadingAnimation from '../loader/loader.json';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { redirect } from 'react-router-dom';


const ProductsList = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]); // To keep the original list
  const [sortOption, setSortOption] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [maxPrice, setMaxPrice] = useState(1000);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(GlobalStateContext) || {};
  const [isLoading, setIsLoading] = useState(true);


  // Effect to fetch initial product data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams(location.search);
        const category = params.get('category');
        const search = params.get('search');
        let url = `${BaseUrl}/products`;
        if (category) {
          url += `?category=${category}`;
        } else if (search) {
          url += `?keywords=${search}`;
        }
        const response = await fetch(url);
        const data = await response.json();

        setOriginalProducts(data); // Store the original, unfiltered list
        setProducts(data); // The list that will be displayed and modified

        // Dynamically set the max price for the slider
        if (data.length > 0) {
          const highestPrice = Math.ceil(Math.max(...data.map(p => p.price)));
          setMaxPrice(highestPrice);
          setPriceRange([0, highestPrice]);
        } else {
          setMaxPrice(0);
          setPriceRange([0, 0]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [location.search]);

  // Effect to apply filters and sorting whenever options change
  useEffect(() => {
    let processedProducts = [...originalProducts];

    // 1. Filter by price range
    processedProducts = processedProducts.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // 2. Sort the filtered products
    switch (sortOption) {
      case 'price-asc':
        processedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        processedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        processedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        processedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // No sorting applied
        break;
    }

    setProducts(processedProducts);
  }, [sortOption, priceRange, originalProducts]);


  const handleAddToCart = async (product) => {
    if (!user || !user.id) {
      alert('Please log in to add items to your cart.');
      return;
    }
    toast.success(
      <div>
        {product.name} <span className="toast-bold-yellow">added to cart!</span>
      </div>,
      {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }
    );
    console.log(`Add to Cart clicked for product ID: ${product.id}`);
    try {
      const response = await fetch(`${BaseUrl}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, id: product.id, quantity: 1 })
      });
      if (!response.ok) throw new Error('Failed to add to cart');
      console.log('Product added to cart');
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleAddToFavourites = (productId) => {
    console.log(`Add to Favourites clicked for product ID: ${productId}`);
    // Implement add to favourites functionality here
  };

  const handleProductClick = (productId) => {
    navigate(`/product-overview/${productId}`);
  };

  const loaderStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.25)'
  };

  // if (isLoading) {
  //   return (
  //     <div style={loaderStyle}>
  //       <Lottie
  //         animationData={loadingAnimation}
  //         loop={true}
  //         style={{ width: 200, height: 200 }}
  //       />
  //     </div>
  //   );
  // }

  return (
    <>
      <div className='product-list-page'>
        <EcommerceNavbar />
        {isLoading && (
        <div style={loaderStyle}>
          <Lottie
            animationData={loadingAnimation}
            loop={true}
            style={{ width: 200, height: 200 }}
          />
        </div>
        )}

        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <div className="product-list">
          <div className='product-list-cont-1'>
            {
              products.map((product) => (
                <div key={product.id} className="product">
                  <div className="image-container">
                    {product.mainImageUrl && (
                      <img src={product.mainImageUrl} alt={`Product`} className="image" />
                    )}
                  </div>
                  <div className="product-details">
                    <p onClick={() => handleProductClick(product.id)}>{product.name.length > 80 ? product.name.slice(0, 80) + '...' : product.name}</p>
                    <div className='product-card-sections'>
                      <div className='product-card-section1'>
                        <p>Price: <span className='price'>₹{product.price}</span></p>
                        <p className='stock'>Sold: {product.stock}</p>
                      </div>
                      <div className='product-list-btn'>
                        <button className="add-to-cart" onClick={() => handleAddToCart(product)}>Add to Cart</button>
                        {/* <button
                                                className="add-to-favourites"
                                                onClick={() => handleAddToFavourites(product.id)}
                                                title="Add to Favourites"
                                            >
                                                <FaHeart />
                                            </button> */}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
          <div className='product-list-cont-2'>
            <Box sx={{ padding: '20px', backgroundColor: '#fff' }}>
              <Typography gutterBottom>Filters</Typography>
              {/* Sorting Dropdown */}
              <FormControl fullWidth sx={{ mb: 4, mt: 2, borderRadius: '20px' }}>
                <InputLabel id="sort-by-label">Sort By</InputLabel>
                <Select
                  labelId="sort-by-label"
                  value={sortOption}
                  label="Sort By"
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  <MenuItem value="price-asc">Price: Low to High</MenuItem>
                  <MenuItem value="price-desc">Price: High to Low</MenuItem>
                  <MenuItem value="name-asc">Name: A-Z</MenuItem>
                  <MenuItem value="name-desc">Name: Z-A</MenuItem>
                </Select>
              </FormControl>

              {/* Price Slider */}
              <Typography gutterBottom>Price Range</Typography>
              <Slider
                getAriaLabel={() => 'Price range'}
                value={priceRange}
                onChange={(event, newValue) => setPriceRange(newValue)}
                valueLabelDisplay="auto"
                min={0}
                max={maxPrice}
                step={100}
                marks
                disableSwap
                getAriaValueText={(value) => `₹${value}`}
                valueLabelFormat={(value) => `₹${value}`}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">₹{priceRange[0]}</Typography>
                <Typography variant="body2">₹{priceRange[1]}</Typography>
              </Box>
            </Box>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsList;
