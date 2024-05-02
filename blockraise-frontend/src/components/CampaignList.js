/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";


function CampaignList({ campaigns }) {
  const [campaignsReceived, setcampaignsReceived] = useState([]);

  console.log(campaigns)

  useEffect(() => {
    const loadCampaigns = async () => {
      setcampaignsReceived(campaigns);
    };
    loadCampaigns();
  }, [campaigns]);

  return (
    <div>
      <h2>Active Campaigns</h2>
      <ul>
        {campaigns.map((campaign, index) => (
          <li key={index}>
            <h3>{campaign.title}</h3>
            <p>{campaign.description}</p>
            {/* <DonationForm id={index} /> */}
            <Link to={`/campaigns/${index}`}>View Details</Link>
            {/* <a href={`/campaigns/${index}`}>View Details</a> */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CampaignList;
