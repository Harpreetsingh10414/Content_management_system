import React, { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./Display.css";

const DosAndDontsList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/dos-donts")
      .then((response) => {
        setItems(response.data);
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
    <div className="lesson-carousel">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop
        className="swiper-container"
      >
        {items.map((item) => (
          <SwiperSlide key={item.id} className="swiper-slide">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="lesson-image"
            />
            <div className="lesson-info">
              <h3>{item.title}</h3>
              <p>Created by: {item.createdBy}</p>
              <p>Approved by: {item.approvedBy}</p>
              <p>Date: {item.date}</p>
              <p>Revision: {item.revision}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default DosAndDontsList;
