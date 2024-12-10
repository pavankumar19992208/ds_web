import React, { useState, useEffect } from "react";
import { storage } from "../../connections/firebase"; // Adjust the import path as necessary
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function AdminUploadPage() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [category, setCategory] = useState("");
    const [mainImage, setMainImage] = useState(null);
    const [images, setImages] = useState([]);
    const [imageNames, setImageNames] = useState([]);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [demanded, setDemanded] = useState(false);
    const [demandedProducts, setDemandedProducts] = useState([]);

    useEffect(() => {
        const fetchDemandedProducts = async () => {
            try {
                const response = await fetch("http://localhost:8000/demanded-products");
                const data = await response.json();
                setDemandedProducts(data);
            } catch (error) {
                console.error("Error fetching demanded products:", error);
            }
        };

        fetchDemandedProducts();
    }, []);

    const handleMainImageChange = (e) => {
        const selectedImage = e.target.files[0];
        if (selectedImage) {
            setMainImage(selectedImage);
        } else {
            alert("Please upload an image file.");
            setMainImage(null);
        }
    };

    const handleImageChange = (e) => {
        const selectedImages = Array.from(e.target.files);
        if (selectedImages.length > 0) {
            setImages(selectedImages);
            setImageNames(selectedImages.map(image => image.name));
        } else {
            alert("Please upload image files.");
            setImages([]);
            setImageNames([]);
        }
    };

    const handleUpload = async () => {
        if (!mainImage) {
            alert("Please select a main image to upload.");
            return;
        }

        if (images.length === 0) {
            alert("Please select images to upload.");
            return;
        }

        const mainImageRef = ref(storage, `images/${mainImage.name}`);
        await uploadBytes(mainImageRef, mainImage);
        const mainImageUrl = await getDownloadURL(mainImageRef);

        const imageUrls = await Promise.all(images.map(async (image) => {
            const imageRef = ref(storage, `images/${image.name}`);
            await uploadBytes(imageRef, image);
            return await getDownloadURL(imageRef);
        }));

        const payload = {
            name,
            description,
            price,
            stock,
            category,
            mainImageUrl,
            imageUrls,
            demanded
        };

        console.log("Payload:", payload);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("stock", stock);
        formData.append("category", category);
        formData.append("mainImageUrl", mainImageUrl);
        formData.append("demanded", demanded);
        imageUrls.forEach((url, index) => formData.append(`imageUrls`, url)); // Append as individual items

        try {
            const response = await fetch("http://localhost:8000/upload", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                setUploadedImages(imageUrls); // Update state with uploaded image URLs
            } else {
                alert("Upload failed");
            }
        } catch (error) {
            console.error(error);
            alert("Upload failed");
        }
    };

    const handleReplace = async (productId) => {
        // Implement the logic to replace the demanded product
    };

    return (
        <div>
            <h1>Upload Product Data</h1>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
            <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} />
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Select Category</option>
                <option value="Books">Books</option>
                <option value="Stationery">Stationery</option>
                <option value="Accessories">Accessories</option>
                <option value="Furniture">Furniture</option>
                <option value="Exam Preparation">Exam Preparation</option>
                <option value="Sports">Sports</option>
            </select>
            <input type="file" onChange={handleMainImageChange} />
            <input type="file" multiple onChange={handleImageChange} />
            <label>
                <input type="checkbox" checked={demanded} onChange={(e) => setDemanded(e.target.checked)} />
                Mark as Demanded
            </label>
            <button onClick={handleUpload}>Upload</button>
            <h2>Selected Images:</h2>
            <ul>
                {imageNames.map((name, index) => (
                    <li key={index}>{name}</li>
                ))}
            </ul>
            <h2>Uploaded Images:</h2>
            <ul>
                {uploadedImages.map((url, index) => (
                    <li key={index}><img src={url} alt={`Uploaded ${index}`} width="100" /></li>
                ))}
            </ul>
            <h2>Demanded Products:</h2>
            <ul>
                {demandedProducts.map((product) => (
                    <li key={product.id}>
                        {product.name}
                        <button onClick={() => handleReplace(product.id)}>Replace</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AdminUploadPage;