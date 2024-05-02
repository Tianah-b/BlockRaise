let expect;

describe("BlockRaise", function() {
    let blockRaise;
    let owner;
    let donor;
    let accounts;

    before(async function() {
    
        const chai = await import("chai");
        expect = chai.expect;

        const BlockRaise = await ethers.getContractFactory("BlockRaise");
        [owner, donor, ...accounts] = await ethers.getSigners();
        blockRaise = await BlockRaise.deploy();
        await blockRaise.deployed();
    });

    it("should allow a user to create a campaign", async function() {
        await blockRaise.createCampaign("Save the Whales", "Help save the whales by funding our campaign", 500);
        const campaign = await blockRaise.campaigns(0);
        expect(campaign.title).to.equal("Save the Whales");
        expect(campaign.goal.toString()).to.equal('500');
    });

    it("should allow donations to a campaign", async function() {
        await blockRaise.createCampaign("Save the Whales", "Help save the whales by funding our campaign", 500);
        await blockRaise.connect(donor).donate(0, { value: 100 });
        const campaign = await blockRaise.campaigns(0);
        expect(campaign.funds.toString()).to.equal('100');
    });

    it("should allow the owner to withdraw funds", async function() {
        await blockRaise.createCampaign("Save the Whales", "Help save the whales by funding our campaign", 500);
        await blockRaise.connect(donor).donate(0, { value: 500 });
        await blockRaise.connect(owner).withdrawFunds(0);
        const campaign = await blockRaise.campaigns(0);
        expect(campaign.funds.toString()).to.equal('0');
    });
});
