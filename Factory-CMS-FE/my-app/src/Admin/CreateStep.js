import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Box, Typography } from "@mui/material";
import Header from "../Header/Header_two";
const CreateStep = () => {
  const [productId, setProductId] = useState("");
  const [stepNumber, setStepNumber] = useState("");
  const [description, setDescription] = useState("");
  const [mediaType, setMediaType] = useState("image");
  const [toolsUsed, setToolsUsed] = useState([]);
  const [partsInvolved, setPartsInvolved] = useState([]);
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch available products, tools, and parts to populate the selects
  const [products, setProducts] = useState([]);
  const [tools, setTools] = useState([]);
  const [parts, setParts] = useState([]);

  useEffect(() => {
    // Fetch data for products, tools, and parts (assumes your API has these endpoints)
    const fetchData = async () => {
      try {
        const productsResponse = await axios.get("http://localhost:3000/api/work-instructions/products");
        setProducts(productsResponse.data);

        const toolsResponse = await axios.get("http://localhost:3000/api/work-instructions/tools");
        setTools(toolsResponse.data);

        const partsResponse = await axios.get("http://localhost:3000/api/work-instructions/parts");
        setParts(partsResponse.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("stepNumber", stepNumber);
    formData.append("description", description);
    formData.append("mediaType", mediaType);
    formData.append("media", media);
    toolsUsed.forEach((tool) => formData.append("toolsUsed[]", tool));
    partsInvolved.forEach((part) => formData.append("partsInvolved[]", part));

    try {
      const response = await axios.post("http://localhost:3000/api/work-instructions/steps", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Step created:", response.data);
      alert("Step created successfully!");
    } catch (error) {
      console.error("Error creating step:", error);
      alert("Error creating step.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <Header />
      </div>
      <Box sx={{ padding: 2, maxWidth: 600, margin: "0 auto", marginTop:'120px' }}>
        <Typography variant="h4" gutterBottom>Create a Step</Typography>
        <form onSubmit={handleSubmit} encType="multipart/form-data">

          {/* Product ID Dropdown */}
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Product Name</InputLabel>
            <Select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              displayEmpty
            >
              {products.map((product) => (
                <MenuItem key={product._id} value={product._id}>
                  {product.name} {/* Display the name or another relevant field */}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Display Product Name or ID in TextField */}
          <TextField
            label="Selected Product ID"
            value={productId ? products.find(product => product._id === productId)?._id || "" : ""}
            fullWidth
            margin="normal"
            disabled
          />

          {/* Step Number */}
          <TextField
            label="Step Number"
            value={stepNumber}
            onChange={(e) => setStepNumber(e.target.value)}
            fullWidth
            margin="normal"
            required
          />

          {/* Description */}
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
            required
          />

          {/* Media Type */}
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Media Type</InputLabel>
            <Select value={mediaType} onChange={(e) => setMediaType(e.target.value)}>
              <MenuItem value="image">Image</MenuItem>
              <MenuItem value="video">Video</MenuItem>
              <MenuItem value="pdf">PDF</MenuItem>
            </Select>
          </FormControl>

          {/* Tools Used */}
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Tools Used</InputLabel>
            <Select
              multiple
              value={toolsUsed}
              onChange={(e) => setToolsUsed(e.target.value)}
              renderValue={(selected) => selected.join(", ")}
            >
              {tools.map((tool) => (
                <MenuItem key={tool._id} value={tool._id}>
                  {tool.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Parts Involved */}
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Parts Involved</InputLabel>
            <Select
              multiple
              value={partsInvolved}
              onChange={(e) => setPartsInvolved(e.target.value)}
              renderValue={(selected) => selected.join(", ")}
            >
              {parts.map((part) => (
                <MenuItem key={part._id} value={part._id}>
                  {part.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* File Upload */}
          <input
            type="file"
            onChange={(e) => setMedia(e.target.files[0])}
            required
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Step"}
          </Button>
        </form>
      </Box>
    </div>

  );
};

export default CreateStep;
