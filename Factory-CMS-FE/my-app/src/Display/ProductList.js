import React, { useState, useEffect } from "react";
import axios from "axios";
import { Tabs, Tab, Box, Typography, CircularProgress } from "@mui/material";
import "./Display.css";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [selectedTab, setSelectedTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [steps, setSteps] = useState([]);
    const [stepsLoading, setStepsLoading] = useState(false);
    const [stepsError, setStepsError] = useState("");
    const [selectedStep, setSelectedStep] = useState(null); // Store selected step

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/work-instructions/products");
                setProducts(response.data);
            } catch (err) {
                setError("Error fetching products.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const fetchSteps = async () => {
            if (products.length > 0) {
                const productId = products[selectedTab]._id;
                setStepsLoading(true);
                try {
                    const response = await axios.get(`http://localhost:3000/api/work-instructions/steps/${productId}`);
                    setSteps(response.data);
                    
                    if (response.data.length > 0) {
                        setSelectedStep(response.data[0]); // ✅ Keep the first step open by default
                    }
                } catch (err) {
                    setStepsError("Error fetching steps.");
                } finally {
                    setStepsLoading(false);
                }
            }
        };
    
        fetchSteps();
    }, [selectedTab, products]);
    
    return (
        <Box sx={{ width: "100%", textAlign: "center", marginTop: "50px" }}>
            <Typography variant="h4" gutterBottom>
                Product List
            </Typography>

            {loading && <Typography>Loading products...</Typography>}
            {error && <Typography color="error">{error}</Typography>}

            {!loading && !error && products.length > 0 && (
                <>
                    <Tabs
                        value={selectedTab}
                        onChange={(event, newValue) => setSelectedTab(newValue)}
                        centered
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        {products.map((product) => (
                            <Tab key={product._id} label={product.name} />
                        ))}
                    </Tabs>

                    <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                        {/* Left Steps List */}
                        <div className="leftColumn">
                            {stepsLoading ? (
                                <CircularProgress />
                            ) : stepsError ? (
                                <Typography color="error">{stepsError}</Typography>
                            ) : (
                                steps.map((step) => (
                                    <div
                                        key={step._id}
                                        className={`leftStep ${selectedStep?._id === step._id ? "active" : ""}`}
                                        onClick={() => setSelectedStep(step)}
                                    >
                                        <Typography variant="h6">Step {step.stepNumber}</Typography>
                                        <Typography variant="body2">{step.description}</Typography>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Sticky Middle Section */}
                        {selectedStep && (
                            <div className="centerStep sticky">
                                {/* <Typography variant="h5">Step {selectedStep.stepNumber}</Typography> */}
                                {selectedStep.mediaUrl && (
                                    <img
                                        src={`http://localhost:3000${selectedStep.mediaUrl}`}
                                        alt={`Step ${selectedStep.stepNumber}`}
                                        style={{ width: "100%", height: "auto" }}
                                    />
                                )}
                            </div>
                        )}

                        {/* Right Section (unchanged) */}
                        <div className="rightColumn">
                            {selectedStep && (
                                <>
                                    <Typography variant="body2" color="textSecondary" sx={{ marginTop: "10px" }}>
                                        Tools Used: {selectedStep.toolsUsed.map((tool) => tool.name).join(", ")}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Parts Involved: {selectedStep.partsInvolved.map((part) => part.name).join(", ")}
                                    </Typography>
                                </>
                            )}
                        </div>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default ProductList;
