import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ProductOverview = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8000/products/${productId}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>Price: ₹{product.price}</p>
      <p>Stock: {product.stock}</p>
      <img src={product.mainImageUrl} alt={product.name} />
    </div>
  );
};

export default ProductOverview;