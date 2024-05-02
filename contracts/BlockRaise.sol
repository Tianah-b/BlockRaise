// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

contract BlockRaise {
    address public owner;
    struct Campaign {
        address payable owner;
        string title;
        string description;
        uint goal;
        uint funds;
    }

    Campaign[] public campaigns;

    event CampaignCreated(uint indexed campaignId, address owner, string title, uint goal);
    event DonationReceived(uint indexed campaignId, uint amount, uint newTotal);
    event FundsWithdrawn(uint indexed campaignId, uint amount);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createCampaign(string memory title, string memory description, uint goal) public {
        require(goal > 0, "Goal must be greater than 0");
        campaigns.push(Campaign(payable(msg.sender), title, description, goal, 0));
        emit CampaignCreated(campaigns.length - 1, msg.sender, title, goal);
    }

    function donate(uint campaignIndex) public payable {
        require(campaignIndex < campaigns.length, "Campaign does not exist");
        require(msg.value > 0, "Donation must be greater than 0");
        Campaign storage campaign = campaigns[campaignIndex];
        campaign.funds += msg.value;
        emit DonationReceived(campaignIndex, msg.value, campaign.funds);
    }

    function withdrawFunds(uint campaignIndex) public {
        require(campaignIndex < campaigns.length, "Campaign does not exist");
        Campaign storage campaign = campaigns[campaignIndex];
        require(msg.sender == campaign.owner, "Only campaign owner can withdraw funds");
        uint funds = campaign.funds;
        campaign.owner.transfer(funds);
        campaign.funds = 0;
        emit FundsWithdrawn(campaignIndex, funds);
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Invalid new owner address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    // Function to get the count of campaigns
    function getCampaignCount() public view returns (uint) {
        return campaigns.length;
    }
}
