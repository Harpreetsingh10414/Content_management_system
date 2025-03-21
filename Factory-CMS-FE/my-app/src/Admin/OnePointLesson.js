import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Box, Typography } from "@mui/material";
import Header from "../Header/Header_two";
const OnePointLesson = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [language, setLanguage] = useState("en");
    const [image, setImage] = useState(null);
    const [createdBy, setCreatedBy] = useState("");
    const [approvedBy, setApprovedBy] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("language", language);
        formData.append("image", image);
        formData.append("createdBy", createdBy);
        formData.append("approvedBy", approvedBy);

        try {
            const response = await axios.post("http://localhost:3000/api/one-point-lesson", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log("Lesson created:", response.data);
            alert("One-Point Lesson created successfully!");
        } catch (error) {
            console.error("Error creating lesson:", error);
            alert("Error creating One-Point Lesson.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div>
                <Header />
            </div>
            <Box sx={{ padding: 2, maxWidth: 600, margin: "0 auto", marginTop: '120px' }}>
                <Typography variant="h4" gutterBottom>Create One-Point Lesson</Typography>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth margin="normal" required />
                    <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth margin="normal" required />

                    <FormControl fullWidth margin="normal" required>
                        <InputLabel>Language</InputLabel>
                        <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
                            <MenuItem value="en">English</MenuItem>
                            <MenuItem value="es">Spanish</MenuItem>
                            <MenuItem value="fr">French</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField label="Created By" value={createdBy} onChange={(e) => setCreatedBy(e.target.value)} fullWidth margin="normal" required />
                    <TextField label="Approved By" value={approvedBy} onChange={(e) => setApprovedBy(e.target.value)} fullWidth margin="normal" required />
                    <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required style={{ marginTop: "16px" }} />
                    <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }} disabled={loading}>
                        {loading ? "Submitting..." : "Submit Lesson"}
                    </Button>
                </form>
            </Box>
        </div>
    );
};

export default OnePointLesson;
