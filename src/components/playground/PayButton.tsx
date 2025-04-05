import axios from "@/libs/axios";
import { endpoints } from "@/libs/axios";
import {
  MiniKit,
  tokenToDecimals,
  Tokens,
  PayCommandInput,
} from "@worldcoin/minikit-js";

export default function PayButton() {
  const handlePay = async () => {
    const paid = await sendPayment();

    if (!paid) {
      console.log("error to pay");
      return null;
    }

    const { finalPayload, nonce } = paid;
    if (!finalPayload) {
      console.log("error to pay");
      return;
    }

    if (finalPayload.status == "success") {
      const { data } = await axios.post(endpoints.worldcoin.confirmPayment, {
        payload: finalPayload,
        nonce,
      });

      if (data.success) {
        console.log("success");
      } else {
        console.log("failed");
      }
    } else {
      console.log("failed");
    }
  };

  const sendPayment = async () => {
    try {
      const { data: nonce } = await axios.get(endpoints.worldcoin.nonce);

      console.log({ nonce });

      const payload: PayCommandInput = {
        reference: nonce,
        to: "0x0c892815f0B058E69987920A23FBb33c834289cf", // Test address
        tokens: [
          {
            symbol: Tokens.WLD,
            token_amount: tokenToDecimals(0, Tokens.WLD).toString(),
          },
          {
            symbol: Tokens.USDCE,
            token_amount: tokenToDecimals(0.1, Tokens.USDCE).toString(),
          },
        ],
        description: "Watch this is a test",
      };
      if (MiniKit.isInstalled()) {
        const _pay = await MiniKit.commandsAsync.pay(payload);
        console.log({ _pay });
        return {
          ..._pay,
          nonce,
        };
      }
      return null;
    } catch (error: unknown) {
      console.log("Error sending payment", error);
      return null;
    }
  };

  return (
    <button
      onClick={handlePay}
      className="px-4 py-2 bg-yellow-700 hover:bg-yellow-600 text-white rounded-lg border-2 border-yellow-900/50 font-bold shadow-md transition-colors disabled:opacity-50 tracking-wide"
    >
      <div className="flex items-center">
        <span className="mr-2">🎰</span>
        <span className="font-serif">PAY</span>
      </div>
    </button>
  );
}
