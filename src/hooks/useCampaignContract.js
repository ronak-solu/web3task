import useContract from "./useContract";

import Campaign from "../Ethereum/abis/Campaign.json";

const useCampaignContract = ({address}) =>
  useContract(address, Campaign.abi, true);

export default useCampaignContract;
