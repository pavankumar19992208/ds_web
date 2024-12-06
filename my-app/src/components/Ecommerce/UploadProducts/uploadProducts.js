import React, { useState } from "react";
import { storage } from "../../connections/firebase"; // Adjust the import path as necessary
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function AdminUploadPage() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [category, setCategory] = useState("");
    const [images, setImages] = useState([]);
    const [imageNames, setImageNames] = useState([]);
    const [uploadedImages, setUploadedImages] = useState([]);

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
        if (images.length === 0) {
            alert("Please select images to upload.");
            return;
        }
    
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
            imageUrls
        };

        console.log("Payload:", payload);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("stock", stock);
        formData.append("category", category);
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

    return (
        <div>
            <h1>Upload Product Data</h1>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
            <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} />
            <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
            <input type="file" multiple onChange={handleImageChange} />
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
        </div>
    );
}

export default AdminUploadPage;