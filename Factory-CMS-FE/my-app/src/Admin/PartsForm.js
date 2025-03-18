import React, { useState } from "react";
import axios from "axios";
import Header from "../Header/Header_two";

const PartsForm = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/work-instructions/parts", {
        name: name,
      });

      if (response.status === 201) {
        setMessage("Parts Created Successfully!");
        setName(""); // Clear input field
      }
    } catch (error) {
      setMessage("Error: Unable to create Parts.");
      console.error("API Error:", error);
    }
  };

  return (
    <div>
      <div>
        <Header />
      </div>
      <div style={{ textAlign: "center", marginTop: "120px" }}>
        <h2>Create a New Parts</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Parts Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ padding: "8px", marginRight: "10px" }}
          />
          <button type="submit" style={{ padding: "8px 12px", cursor: "pointer" }}>
            Submit
          </button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default PartsForm;
