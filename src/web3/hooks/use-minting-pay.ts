import { ethers } from "ethers";
import { useCallback } from "react";
import { approve } from "thirdweb/extensions/erc20";
import { prepareContractCall, sendAndConfirmTransaction } from "thirdweb";

import useConnectWallet from "../use-connect-wallet";
import { counterServiceAbi } from "../abis/counter-service.abi";
import { f3Contract, counterServiceContract } from "../contracts";

export default function useMintingPay() {
  const { isNetworkMatched, activeWallet, activeAccount } = useConnectWallet();

  const execute = useCallback(async () => {
    try {
      if (!activeAccount) {
        throw new Error("Account is required");
      }

      const chain = activeWallet?.getChain();

      if (!chain || !isNetworkMatched) {
        throw new Error("Network not supported");
      }

      const approveTransaction = approve({
        contract: f3Contract(chain),
        spender: counterServiceContract(chain).address,
        amount: 1,
      });

      const { transactionHash: approveTxHash } =
        await sendAndConfirmTransaction({
          transaction: approveTransaction,
          account: activeAccount,
        });

      if (!approveTxHash) {
        throw new Error("Approve transaction failed");
      }

      const transaction = prepareContractCall({
        contract: counterServiceContract(chain),
        method: "payForMinting",
      });

      const receipt = await sendAndConfirmTransaction({
        transaction,
        account: activeAccount,
      });
      console.log({ receipt });

      const contractInterface = new ethers.utils.Interface(counterServiceAbi);
      const parsed = contractInterface.parseLog(receipt.logs[2]);
      const receiptId = parsed.args.receiptId;
      console.log({ receiptId: receiptId.toNumber() });
      if (receipt.status !== "success") {
        throw new Error("Pay transaction failed");
      }

      return { ...receipt, receiptId: receiptId.toNumber() };
    } catch (error) {
      console.log(error);
      return null;
    }
  }, [activeAccount, activeWallet, isNetworkMatched]);

  return execute;
}
