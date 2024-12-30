import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import './ecomDash.css';

const EcommerceDashboard = () => {
    const [demandedProducts, setDemandedProducts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchDemandedProducts = async () => {
            try {
                const response = await fetch('http://localhost:8001/demanded-products');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setDemandedProducts(data);
            } catch (error) {
                console.error('Error fetching demanded products:', error);
            }
        };

        fetchDemandedProducts();
    }, []);

    const handlePrevClick = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? demandedProducts.length - 1 : prevIndex - 1));
    };

    const handleNextClick = () => {
        setCurrentIndex((prevIndex) => (prevIndex === demandedProducts.length - 1 ? 0 : prevIndex + 1));
    };

    if (demandedProducts.length === 0) {
        return <div>Loading...</div>;
    }

    const currentProduct = demandedProducts[currentIndex];

    return (
        <div className="ecomm-dashboard">
            <button className="nav-button left" onClick={handlePrevClick}>{"<"}</button>
            <Grid className="products-container">
                <Grid className="product-info">
                    <h2 className='product-name'>{currentProduct.name}</h2>
                    <button className="buy-button">Buy</button>
                </Grid>
                <Grid className="product-image">
                    <img src={currentProduct.mainImageUrl} alt={currentProduct.name} />
                </Grid>
            </Grid>
            <button className="nav-button right" onClick={handleNextClick}>{">"}</button>
        </div>
    );
};

export default EcommerceDashboard;