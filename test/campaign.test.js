const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas:'1000000' });

    campaign = await factory.methods.createCampaign( "100" )
        .send({ from: accounts[0], gas: '1000000' });

    const addresses = await factory.methods.getDeployedCampaigns().call();
    campaignAddress = addresses[0];

    campaign = await new web3.eth.Contract(JSON.parse(compiledCampaign.interface), campaignAddress);  
});

describe('Campaigns', () => {
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('only manager can create a campaign', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    });
    
    it('can contribute to the campaign', async () => {
        await campaign.methods.contribute()
            .send({ from: accounts[1], value: '101'});
        const approver = await campaign.methods.approvers(accounts[1]).call();
       // assert.equal(true, approver);
       assert(approver);    
    });

    it('requieres a minimum contribution', async () => {
        try {
            await campaign.methods.contribute()
            .send({ from: accounts[2], value: '10'});
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('allows a manager to make a payment request', async () => {
        await campaign.methods.createRequest("Batteries", '1000', accounts[3])
            .send({ from: accounts[0], gas: "1000000"});
        
        const request = await campaign.methods.requests(0).call();

        assert.equal('Batteries', request.description);
    });

    it('processes requests', async () => {
        await await campaign.methods.contribute()
            .send({ from: accounts[0], value: web3.utils.toWei('10', 'ether')});

        await campaign.methods.createRequest("Ecrans", web3.utils.toWei('5', 'ether'), accounts[3])
            .send({ from: accounts[0], gas: "1000000"});
        
        await campaign.methods.approveRequest(0)
            .send({ from: accounts[0], gas: "1000000"});

        await campaign.methods.finalizeRequest(0)
            .send({ from: accounts[0], gas: "1000000"});
        
        let balance = await web3.eth.getBalance(accounts[3]);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);
        console.log(balance);
        assert(balance > 104);
    })
});