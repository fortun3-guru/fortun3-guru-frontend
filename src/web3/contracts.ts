import { getContract } from 'thirdweb';

import { client } from './client';
import { getChain } from './chain';
import { counterServiceAbi } from './abis/counter-service.abi';

if (!process.env.NEXT_PUBLIC_CONUTER_SERVICE_CONTRACT_ADDRESS) {
  throw new Error('NEXT_PUBLIC_CONUTER_SERVICE_CONTRACT_ADDRESS is not set');
}

export const counterServiceContract = getContract({
  address: process.env.NEXT_PUBLIC_CONUTER_SERVICE_CONTRACT_ADDRESS,
  chain: getChain(),
  client,
  abi: counterServiceAbi,
});
