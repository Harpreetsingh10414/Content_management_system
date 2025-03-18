import React, { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./Display.css";

const OnePointLessonList = () => {
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/one-point-lesson")
      .then((response) => {
        setLessons(response.data);
      })
      .catch((error) => {
        console.error("Error fetching lessons:", error);
      });
  }, []);

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
        {lessons.map((lesson, index) => (
          <SwiperSlide key={lesson._id} className="swiper-slide">
            <img
              src={`http://localhost:3000${lesson.imageUrl}`}
              alt={lesson.title}
              className="lesson-image"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default OnePointLessonList;
