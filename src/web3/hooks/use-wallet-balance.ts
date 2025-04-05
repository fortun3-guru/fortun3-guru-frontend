import { getWalletBalance } from "thirdweb/wallets";

import { client } from "../client";
import { getChain } from "../chain";
import { f3Contract, usdcContract } from "../contracts";

export default function useWalletBalance() {
  const getBalanceOnChain = async (
    walletAddress: string,
    tokenAddress?: string
  ) => {
    const balance = await getWalletBalance({
      address: walletAddress,
      client: client,
      chain: getChain(),
      tokenAddress: tokenAddress,
    });

    return balance.displayValue;
  };

  const execute = async (walletAddress?: string) => {
    if (!walletAddress) {
      return null;
    }
    const tokens = [usdcContract.address, f3Contract.address];
    const balance = await Promise.all(
      tokens.map((token) => getBalanceOnChain(walletAddress, token))
    );

    return {
      usdc: balance[0],
      f3: balance[1],
    };
  };

  return execute;
}
