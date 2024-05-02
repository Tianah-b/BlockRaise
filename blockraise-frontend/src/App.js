import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CampaignList from "./components/CampaignList";
import CampaignDetails from "./components/CampaignDetails";
import { API_URL } from "./constants";


const App = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCampaigns = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/campaigns`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data,"data")
      setCampaigns(data);
    } catch (e) {
      console.error("Failed to fetch campaigns:", e);
      setError("Failed to fetch campaigns. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    console.log(campaigns);
  }, [campaigns]);

  return (
    <Router>
      <div>
        <h1>Welcome to BlockRaise!</h1>
        {loading && <p>Loading campaigns...</p>}
        {error && <p>Error: {error}</p>}
        {!loading && !error && campaigns.length === 0 && (
          <p>No campaigns to display.</p>
        )}
        {!loading && !error && campaigns.length > 0 && (
          <Routes>
            <Route path="/" element={<CampaignList campaigns={campaigns} />} />
            <Route path="/campaigns/:index" element={<CampaignDetails campaigns={campaigns} />} />
          </Routes>
        )}
        
      </div>
    </Router>
  );
};

export default App;
