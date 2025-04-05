import React, { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./Display.css";

const DocumentList = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get("http://localhost:3000/api/documents")
            .then((response) => {
                setDocuments(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setError("Failed to fetch data.");
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <>
            <div className="document-carousel">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 3000 }}
                    loop
                    className="swiper-container"
                >
                    {documents.map((doc) => (
                        <SwiperSlide key={doc._id} className="swiper-slide">
                            <div className="document-info">
                                <h3>{doc.title}</h3>
                                <p>{doc.description}</p>
                                <a href={doc.filePath} target="_blank" rel="noopener noreferrer">
                                    📄 View Document
                                </a>
                                <p>Language: {doc.language}</p>
                                <p>Uploaded at: {new Date(doc.uploadedAt).toLocaleString()}</p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </>

    );
};

export default DocumentList;
