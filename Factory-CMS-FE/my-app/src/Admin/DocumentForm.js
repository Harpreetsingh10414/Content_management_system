import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Box, Typography } from "@mui/material";
import Header from "../Header/Header_two";

const DocumentForm = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [language, setLanguage] = useState("");
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!title || !description || !language || !document) {
            alert("All fields are required!");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("language", language);
        formData.append("document", document);

        try {
            const response = await axios.post("http://localhost:3000/api/documents/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Response:", response.data);
            alert("Document uploaded successfully!");
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
            alert(error.response?.data?.message || "Failed to upload document.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
    
        <Box sx={{ padding: 2, maxWidth: 600, margin: "0 auto", marginTop: '120px' }}>
            <Typography variant="h4" gutterBottom>Upload Document</Typography>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth margin="normal" required />
                <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth margin="normal" required />
                <TextField label="Language" value={language} onChange={(e) => setLanguage(e.target.value)} fullWidth margin="normal" required />
                <input type="file" accept="application/pdf" onChange={(e) => setDocument(e.target.files[0])} style={{ marginTop: "16px" }} required />
                <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }} disabled={loading}>
                    {loading ? "Uploading..." : "Upload"}
                </Button>
            </form>
        </Box>
        </>
    );
};

export default DocumentForm;
