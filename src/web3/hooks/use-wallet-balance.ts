import { Chain } from "thirdweb/chains";
import { getWalletBalance } from "thirdweb/wallets";

import { client } from "../client";
import useConnectWallet from "../use-connect-wallet";
import { f3Contract, usdcContract } from "../contracts";

export default function useWalletBalance() {
  const { activeWallet, isNetworkMatched } = useConnectWallet();

  const getBalanceOnChain = async (
    walletAddress: string,
    tokenAddress: string,
    chain: Chain
  ) => {
    if (!chain) {
      throw new Error("Wallet is required");
    }

    const balance = await getWalletBalance({
      address: walletAddress,
      client: client,
      chain: chain,
      tokenAddress: tokenAddress,
    });

    return balance.displayValue;
  };

  const execute = async (walletAddress?: string) => {
    if (!walletAddress) {
      return null;
    }

    const chain = activeWallet?.getChain();

    if (!chain || !isNetworkMatched) {
      return null;
    }

    const tokens = [usdcContract(chain).address, f3Contract(chain).address];
    const balance = await Promise.all(
      tokens.map((token) => getBalanceOnChain(walletAddress, token, chain))
    );

    return {
      usdc: balance[0],
      f3: balance[1],
    };
  };

  return execute;
}
