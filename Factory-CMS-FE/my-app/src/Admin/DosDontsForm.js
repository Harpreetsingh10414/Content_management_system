import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Box, Typography } from "@mui/material";
import Header from "../Header/Header_two";

const DosDontsForm = () => {
    const [title, setTitle] = useState("");
    const [createdBy, setCreatedBy] = useState("");
    const [approvedBy, setApprovedBy] = useState("");
    const [date, setDate] = useState("");
    const [revision, setRevision] = useState("");
    const [language, setLanguage] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Check if all fields are filled
        if (!title || !createdBy || !approvedBy || !date || !revision) {
            alert("All fields are required!");
            setLoading(false);
            return;
        }

        if (!image) {
            alert("Please upload an image.");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("createdBy", createdBy);
        formData.append("approvedBy", approvedBy);
        formData.append("date", date);
        formData.append("revision", revision);
        formData.append("language", language);
        formData.append("image", image);

        // Debugging: Log form data before submitting
        console.log("Form Data:");
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        try {
            const response = await axios.post("http://localhost:3000/api/dos-donts/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Response:", response.data);
            alert("Dos & Don'ts submitted successfully!");
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
            alert(error.response?.data?.message || "Failed to submit Dos & Don'ts.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Header />
            <Box sx={{ padding: 2, maxWidth: 600, margin: "0 auto", marginTop: '120px' }}>
                <Typography variant="h4" gutterBottom>Create Dos & Don'ts</Typography>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth margin="normal" required />
                    <TextField label="Created By" value={createdBy} onChange={(e) => setCreatedBy(e.target.value)} fullWidth margin="normal" required />
                    <TextField label="Approved By" value={approvedBy} onChange={(e) => setApprovedBy(e.target.value)} fullWidth margin="normal" required />
                    <TextField label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} fullWidth margin="normal" required InputLabelProps={{ shrink: true }} />
                    <TextField label="Revision" value={revision} onChange={(e) => setRevision(e.target.value)} fullWidth margin="normal" required />
                    <TextField label="Language" value={language} onChange={(e) => setLanguage(e.target.value)} fullWidth margin="normal" required />
                    <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} style={{ marginTop: "16px" }} required />
                    <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }} disabled={loading}>
                        {loading ? "Submitting..." : "Submit"}
                    </Button>
                </form>
            </Box>
        </div>
    );
};

export default DosDontsForm;
