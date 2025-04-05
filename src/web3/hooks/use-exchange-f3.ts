import { useCallback } from "react";
import { useActiveAccount } from "thirdweb/react";
import { approve } from "thirdweb/extensions/erc20";
import { prepareContractCall, sendAndConfirmTransaction } from "thirdweb";

import { counterServiceContract, usdcContract } from "../contracts";

export default function useExchangeF3() {
  const account = useActiveAccount();

  const execute = useCallback(
    async (amount: number) => {
      try {
        if (!account) {
          throw new Error("Account is required");
        }

        const approveTransaction = approve({
          contract: usdcContract,
          spender: counterServiceContract.address,
          amount,
        });

        const { transactionHash: approveTxHash } =
          await sendAndConfirmTransaction({
            transaction: approveTransaction,
            account,
          });
        console.log({ approveTxHash });
        if (!approveTxHash) {
          throw new Error("Approve transaction failed");
        }

        const transaction = prepareContractCall({
          contract: counterServiceContract,
          method: "exchange",
          params: [BigInt(amount * 10 ** 18)],
        });

        const receipt = await sendAndConfirmTransaction({
          transaction,
          account,
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
    [account]
  );

  return execute;
}
