import React, { useEffect, useState } from 'react';
import './productsList.css';

const ProductsList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8000/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="dashboard">
      <h1 className="header">neuraLife</h1>
      <div className="">
        <p>Welcome to the neuraLife E-commerce!</p>
        <div className="product-list">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="product">
                <h2>{product.name}</h2>
                <div className="image-container">
                  {Array.isArray(product.imageUrls) && product.imageUrls.map((url, index) => (
                    <img key={index} src={url} alt={`Product ${index}`} className="image" />
                  ))}
                </div>
                <p>Price: ${product.price}</p>
                <p>Stock: {product.stock}</p>
                <p>Category: {product.category}</p>
                <p>Description: <br/><br/>{product.description}</p>

              </div>
            ))
          ) : (
            <p>No products available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsList;