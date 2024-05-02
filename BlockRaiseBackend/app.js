require('dotenv').config();
const express = require('express');
const { ethers } = require('ethers');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());


const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_URL);
console.log('Provider is set.');

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
console.log('Wallet is set.');

const contractABIPath = path.resolve(__dirname, "../artifacts/contracts/BlockRaise.sol/BlockRaise.json");
const contractABI = JSON.parse(fs.readFileSync(contractABIPath, 'utf8')).abi;
const contractAddress = '0x54b176Ee23254c3b8172BaCDE36CFE6958848409';
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

app.get('/', (req, res) => {
    res.send('BlockRaise Backend is running.');
});

app.get('/campaigns', async (req, res) => {
    try {
        console.log("Inside fetch")
        const campaignCount = await contract.getCampaignCount(); 
        if (campaignCount === 0) {
            res.json([]); 
            return;
        }
        const campaignsPromises = [];
        for (let i = 0; i < campaignCount; i++) {
            campaignsPromises.push(contract.campaigns(i));
        }
        const campaignsData = await Promise.all(campaignsPromises);
        const formattedCampaigns = campaignsData.map(campaign => ({
            owner: campaign.owner,
            title: campaign.title,
            description: campaign.description,
            goal: ethers.utils.formatUnits(campaign.goal, 'ether'),
            funds: ethers.utils.formatUnits(campaign.funds, 'ether'),
        }));
        res.json(formattedCampaigns);
    } catch (error) {
        console.error('Error fetching campaigns:', error);
        res.status(500).send('Failed to fetch campaigns');
    }
});

app.get('/campaign/:id', async (req, res) => {
    const campaignId = req.params.id;
    if (isNaN(campaignId)) {
        return res.status(400).send('Campaign ID must be a number');
    }
    try {
        const campaign = await contract.campaigns(campaignId);
        if (!campaign || campaign.owner === ethers.constants.AddressZero) {
            return res.status(404).send('Campaign not found');
        }
        res.json({
            owner: campaign.owner,
            title: campaign.title,
            description: campaign.description,
            goal: ethers.utils.formatUnits(campaign.goal, 'ether'),
            funds: ethers.utils.formatUnits(campaign.funds, 'ether')
        });
    } catch (error) {
        console.error('Error fetching campaign:', error);
        res.status(500).send('Failed to fetch campaign details');
    }
});

app.post('/create-campaign', async (req, res) => {
    const { title, description, goal } = req.body;
    try {
        const txResponse = await contract.createCampaign(title, description, ethers.utils.parseUnits(goal, 'ether'));
        const receipt = await txResponse.wait();
        const campaignCreatedEvent = receipt.events.find(event => event.event === "CampaignCreated");
        const campaignId = campaignCreatedEvent.args.campaignId;
        res.status(201).json({
            message: 'Campaign created successfully.',
            campaignId: campaignId.toString()
        });
    } catch (error) {
        console.error('Creating campaign failed:', error);
        res.status(500).json({
            message: 'Failed to create campaign.',
            error: error.message
        });
    }
});

app.post('/campaign/:id/donate', async (req, res) => {
    const campaignId = req.params.id;
    // const campaignId = 1;
    const { amount } = req.body;
    console.log(campaignId)
    if (isNaN(campaignId)) {
        return res.status(400).send('Campaign ID must be a number');
    }
    try {
        const txResponse = await contract.donate(campaignId, { value: ethers.utils.parseUnits(amount, 'ether') });
        const receipt = await txResponse.wait();
        res.status(201).json({
            message: 'Donation successful.',
            transactionId: receipt.transactionHash
        });
    } catch (error) {
        console.error('Donation failed:', error);
        res.status(500).send('Donation failed.');
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
