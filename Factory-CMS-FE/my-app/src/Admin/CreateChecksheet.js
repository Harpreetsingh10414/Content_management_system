import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Box, Typography } from "@mui/material";

const CreateChecksheet = () => {
    const [formData, setFormData] = useState({
        title: "",
        formatNo: "",
        issueNoDate: "",
        revNoDate: "",
        pageNo: "",
        machineName: "",
        identificationNo: "",
        location: "",
        maintenanceTechnician: "",
        maintenanceHOD: "",
        pmDoneDate: "",
        pmNextDueDate: ""
    });
    
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post("http://localhost:3000/api/checksheets", formData, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            console.log("Response:", response.data);
            alert("Checksheet created successfully!");
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
            alert(error.response?.data?.message || "Failed to create checksheet.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ padding: 2, maxWidth: 600, margin: "0 auto", marginTop: "50px" }}>
            <Typography variant="h4" gutterBottom>Create Checksheet</Typography>
            <form onSubmit={handleSubmit}>
                {Object.keys(formData).map((key) => (
                    <TextField
                        key={key}
                        label={key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
                        name={key}
                        value={formData[key]}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                ))}
                <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }} disabled={loading}>
                    {loading ? "Submitting..." : "Submit"}
                </Button>
            </form>
        </Box>
    );
};

export default CreateChecksheet;
