import useContract from "./useContract";

import CampaignFactory from "../Ethereum/abis/CampaignFactory.json";

const useCampaignFactoryContract = () =>
  useContract('0x83f4a04B7425fc7Def60097F2c7190A5e9b2bC7F', CampaignFactory.abi, true);

export default useCampaignFactoryContract;
