import { useCallback } from "react";
import { approve } from "thirdweb/extensions/erc20";
import { prepareContractCall, sendAndConfirmTransaction } from "thirdweb";

import useConnectWallet from "../use-connect-wallet";
import { counterServiceContract, usdcContract } from "../contracts";

export default function useExchangeF3() {
  const { isNetworkMatched, activeWallet, activeAccount } = useConnectWallet();

  const execute = useCallback(
    async (amount: number) => {
      try {
        if (!activeAccount) {
          throw new Error("Account is required");
        }

        const chain = activeWallet?.getChain();
        if (!chain || !isNetworkMatched) {
          throw new Error("Network not supported");
        }

        const approveTransaction = approve({
          contract: usdcContract(chain),
          spender: counterServiceContract(chain).address,
          amount,
        });

        const { transactionHash: approveTxHash } =
          await sendAndConfirmTransaction({
            transaction: approveTransaction,
            account: activeAccount,
          });
        console.log({ approveTxHash });
        if (!approveTxHash) {
          throw new Error("Approve transaction failed");
        }

        const transaction = prepareContractCall({
          contract: counterServiceContract(chain),
          method: "exchange",
          params: [BigInt(amount * 10 ** 18)],
        });

        const receipt = await sendAndConfirmTransaction({
          transaction,
          account: activeAccount,
        });
        console.log({ receipt });

        if (receipt.status !== "success") {
          throw new Error("Pay transaction failed");
        }

        return { success: true };
      } catch (error) {
        console.error(error);
        return { success: false };
      }
    },
    [activeAccount, activeWallet, isNetworkMatched]
  );

  return execute;
}
