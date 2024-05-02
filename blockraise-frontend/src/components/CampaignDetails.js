/* eslint-disable no-unused-vars */

import { useParams } from "react-router-dom";
import React from 'react';
import DonationForm from './DonationForm'; 

const CampaignDetails = ({campaigns}) => {
    const { index } = useParams();
    const campaign = campaigns[index];

    const handleDonation = (amount) => {
        console.log(`Donating ${amount} ETH to campaign ID ${index}`);
        
    };

    return (
        <div>
            <h3>{campaign.title}</h3>
            <p>{campaign.description}</p>
            <p>Goal: {campaign.goal} ETH</p>
            <p>Raised: {campaign.funds} ETH</p>
            <DonationForm id={index} />

        </div>
    );
};

export default CampaignDetails;

