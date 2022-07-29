import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";
//const campaignAddress = "0x1eD55e37d1132988f8AaFae9068b12588A04b1C1";

const instance = new web3.eth.Contract(JSON.parse(CampaignFactory.interface), "0x1eD55e37d1132988f8AaFae9068b12588A04b1C1");

export default instance;

