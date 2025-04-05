import { useCallback } from "react";
import { useActiveAccount } from "thirdweb/react";
import { approve } from "thirdweb/extensions/erc20";
import { prepareContractCall, sendAndConfirmTransaction } from "thirdweb";

import { f3Contract, counterServiceContract } from "../contracts";

export default function useMintingPay() {
  const account = useActiveAccount();

  const execute = useCallback(async () => {
    try {
      if (!account) {
        throw new Error("Account is required");
      }

      const approveTransaction = approve({
        contract: f3Contract,
        spender: counterServiceContract.address,
        amount: 1,
      });

      const { transactionHash: approveTxHash } =
        await sendAndConfirmTransaction({
          transaction: approveTransaction,
          account,
        });

      if (!approveTxHash) {
        throw new Error("Approve transaction failed");
      }

      const transaction = prepareContractCall({
        contract: counterServiceContract,
        method: "payForMinting",
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
      console.log(error);
      return { success: false };
    }
  }, [account]);

  return execute;
}
