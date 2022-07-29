const HDalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('../ethereum/build/CampaignFactory.json');

const provider = new HDalletProvider('bless punch salmon hurdle spring pool slender fade load argue rapid neck',
'https://rinkeby.infura.io/v3/5b40bc29034b4fcfbe2629345157c54c')

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode})
        .send({ from: accounts[0], gas: '1000000'});
    
    

    console.log("Contract deployed to " + result.options.address);
    provider.engine.stop();
};

deploy();