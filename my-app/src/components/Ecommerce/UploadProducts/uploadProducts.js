import React, { useState, useEffect } from "react";
import { storage } from "../../connections/firebase"; // Adjust the import path as necessary
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
    Container,
    TextField,
    TextareaAutosize,
    Button,
    Checkbox,
    FormControlLabel,
    Select,
    MenuItem,
    InputLabel,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";

function AdminUploadPage() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [category, setCategory] = useState("");
    const [mainImage, setMainImage] = useState(null);
    const [images, setImages] = useState([]);
    const [imageNames, setImageNames] = useState([]);
    const [demanded, setDemanded] = useState(false);
    const [demandedProducts, setDemandedProducts] = useState([]);
    const [fetchedProducts, setFetchedProducts] = useState([]); // New state for fetched products
    const [open, setOpen] = useState(false); // State to manage modal open/close
    const [selectedProductId, setSelectedProductId] = useState(null); // State to store selected product ID
    const [selectedProductName, setSelectedProductName] = useState(""); // State to store selected product name
    const [searchQuery, setSearchQuery] = useState(""); // State for search query

    useEffect(() => {
        const fetchDemandedProducts = async () => {
            try {
                const response = await fetch("http://localhost:8001/demanded-products");
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
            const response = await fetch("http://localhost:8001/upload", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
            } else {
                alert("Upload failed");
            }
        } catch (error) {
            console.error(error);
            alert("Upload failed");
        }
    };

    const handleReplace = async (productId, productName) => {
        try {
            const response = await fetch("http://localhost:8001/products");
            const data = await response.json();
            setFetchedProducts(data); // Update state with fetched products
            setSelectedProductId(productId); // Set the selected product ID
            setSelectedProductName(productName); // Set the selected product name
            setOpen(true); // Open the modal
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const handleConfirmReplace = async (newProductId) => {
        try {
            const response = await fetch(`http://localhost:8001/replace-demanded-product`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    oldProductId: selectedProductId,
                    newProductId: newProductId,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                setOpen(false);
                // Refresh demanded products list
                const demandedResponse = await fetch("http://localhost:8001/demanded-products");
                const demandedData = await demandedResponse.json();
                setDemandedProducts(demandedData);
            } else {
                alert("Replacement failed");
            }
        } catch (error) {
            console.error("Error replacing product:", error);
            alert("Replacement failed");
        }
    };

    const filteredProducts = fetchedProducts
    .filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(product => !demandedProducts.some(demandedProduct => demandedProduct.id === product.id));

    return (
        <Container>
            <Typography variant="h6" gutterBottom>Upload Product Data</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Price"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Stock"
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                        labelId="category-label"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        fullWidth
                        margin="normal"
                    >
                        <MenuItem value="">Select Category</MenuItem>
                        <MenuItem value="Books">Books</MenuItem>
                        <MenuItem value="Stationery">Stationery</MenuItem>
                        <MenuItem value="Accessories">Accessories</MenuItem>
                        <MenuItem value="Furniture">Furniture</MenuItem>
                        <MenuItem value="Exam Preparation">Exam Preparation</MenuItem>
                        <MenuItem value="Sports">Sports</MenuItem>
                    </Select>
                </Grid>
                <Grid item xs={12}>
                    <TextareaAutosize
                        minRows={3}
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{ width: '100%', marginBottom: '16px', height: '40vh' }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Button
                        variant="contained"
                        component="label"
                        startIcon={<PhotoCamera />}
                        fullWidth
                        margin="normal"
                    >
                        Upload Main Image
                        <input
                            type="file"
                            hidden
                            onChange={handleMainImageChange}
                        />
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Button
                        variant="contained"
                        component="label"
                        startIcon={<PhotoCamera />}
                        fullWidth
                        margin="normal"
                    >
                        Upload Images
                        <input
                            type="file"
                            multiple
                            hidden
                            onChange={handleImageChange}
                        />
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={demanded}
                                onChange={(e) => setDemanded(e.target.checked)}
                            />
                        }
                        label="Mark as Demanded"
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpload}
                        fullWidth
                        margin="normal"
                    >
                        Upload
                    </Button>
                </Grid>
            </Grid>
            <Typography variant="h6" gutterBottom sx={{marginTop: '20px'}}>Selected Images:</Typography>
            <List>
                {imageNames.map((name, index) => (
                    <ListItem key={index}>
                        <ListItemText primary={name} />
                    </ListItem>
                ))}
            </List>
            
            <Typography variant="h6" gutterBottom>Demanded Products:</Typography>
            <List>
                {demandedProducts.map((product) => (
                    <ListItem key={product.id}>
                        <ListItemText primary={product.name}/>
                        <ListItemSecondaryAction>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => handleReplace(product.id, product.name)}
                            >
                                Replace
                            </Button>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="80vw" fullWidth>
            <Typography variant="h6" gutterBottom padding={'20px'}>
                <strong>Selected product:</strong> {selectedProductName}
            </Typography>
            <DialogTitle>Select a Product to Replace</DialogTitle>
            <DialogContent>
                <TextField
                    label="Search Products"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <List>
                    {filteredProducts.map((product) => (
                        <ListItem key={product.id} button onClick={() => handleConfirmReplace(product.id)}>
                            <ListItemText primary={`${product.name} - ${product.category}`} />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)} color="primary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
        </Container>
    );
}

export default AdminUploadPage;