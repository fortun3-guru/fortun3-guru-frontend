import { getContract } from "thirdweb";

import { client } from "./client";
import { getChain } from "./chain";
import { counterServiceAbi } from "./abis/counter-service.abi";

if (!import.meta.env.VITE_COUNTER_SERVICE_CONTRACT_ADDRESS) {
  throw new Error("VITE_COUNTER_SERVICE_CONTRACT_ADDRESS is not set");
}

if (!import.meta.env.VITE_USDC_CONTRACT_ADDRESS) {
  throw new Error("VITE_USDC_CONTRACT_ADDRESS is not set");
}

if (!import.meta.env.VITE_F3_CONTRACT_ADDRESS) {
  throw new Error("VITE_F3_CONTRACT_ADDRESS is not set");
}

export const counterServiceContract = getContract({
  address: import.meta.env.VITE_COUNTER_SERVICE_CONTRACT_ADDRESS,
  chain: getChain(),
  client,
  abi: counterServiceAbi,
});

export const usdcContract = getContract({
  address: import.meta.env.VITE_USDC_CONTRACT_ADDRESS,
  chain: getChain(),
  client,
});

export const f3Contract = getContract({
  address: import.meta.env.VITE_F3_CONTRACT_ADDRESS,
  chain: getChain(),
  client,
});
