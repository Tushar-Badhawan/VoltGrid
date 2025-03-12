import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import VoltGrid from "./VoltGrid"; // Import the VoltGrid component

function App() {
  const [message, setMessage] = useState("");

  // Fetch data from backend
  const fetchMessage = useCallback(async () => {
    try {
      console.log("Fetching data from server..."); // Debugging log
      const response = await axios.get("http://127.0.0.1:5000/api/test");
      console.log("Server response:", response.data); // Debugging log
      setMessage(response.data.message);
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessage("Failed to fetch data from server");
    }
  }, []);

  useEffect(() => {
    fetchMessage();
  }, [fetchMessage]);

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>VoltGrid - Power Supply Optimization</h1>
      <p style={{ textAlign: "center", fontWeight: "bold", color: message ? "green" : "red" }}>
        {message || "Loading..."}
      </p>
      <VoltGrid /> {/* Display the grid UI */}
    </div>
  );
}

export default App;
