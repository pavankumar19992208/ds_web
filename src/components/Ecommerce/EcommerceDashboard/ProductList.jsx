import React, { useEffect, useState } from "react";

function ProductList() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("http://localhost:8000/products");
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div>
            <h1>Products</h1>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
                {products.map((product) => (
                    <div key={product.id} style={{ border: "1px solid #ddd", margin: 10, padding: 10 }}>
                        <img src={product.image_url} alt={product.name} style={{ width: 100, height: 100 }} />
                        <h2>{product.name}</h2>
                        <p>{product.description}</p>
                        <p>Price: ${product.price}</p>
                        <button>Add to Cart</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductList;