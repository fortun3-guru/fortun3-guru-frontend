import numeral from "numeral";
import { toast } from "sonner";
import { useState } from "react";
import { useBoolean } from "@/hooks/use-boolean";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import useExchangeF3 from "@/web3/hooks/use-exchange-f3";

export default function TopupView() {
  const [usdc, setUsdc] = useState("");
  const [f3Token, setF3Token] = useState("");
  const executeExchange = useExchangeF3();
  const loading = useBoolean(false);

  const calculateF3Token = (e: React.ChangeEvent<HTMLInputElement>) => {
    const __usdc = e.target.value;
    const _usdc = __usdc.replace(/,/g, "");

    if (!_usdc) {
      setUsdc("");
      setF3Token("");
      return;
    }
    const isNumberChar = /^[0-9]+$/.test(_usdc);
    if (!isNumberChar) {
      return;
    }
    setUsdc(_usdc);
    const f3Token = +_usdc * 10;
    setF3Token(`${f3Token}`);
  };

  const handleExchange = async () => {
    try {
      loading.onTrue();
      const { success } = await executeExchange(+usdc);
      if (success) {
        toast.success("Exchange successfully");
        setUsdc("");
        setF3Token("");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to exchange");
    } finally {
      loading.onFalse();
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen px-4">
      <div className="w-full max-w-3xl mx-auto p-6 space-y-6 bg-white/20 rounded-lg border-2 border-white/55 mt-36">
        <h1 className="text-xl font-normal text-white mb-4">
          Exchange USDC to F3 Token
        </h1>

        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-white text-sm">Spend USDC</p>
            <Input
              placeholder="USDC Amount"
              value={usdc ? numeral(usdc).format("0,0") : ""}
              onChange={calculateF3Token}
            />
          </div>

          <div className="space-y-2">
            <p className="text-white text-sm">You will get</p>
            <Input
              placeholder="You will get"
              value={`${numeral(f3Token).format("0,0")} F3 Token`}
              disabled
            />
          </div>

          <div className="flex justify-center">
            <Button
              loading={loading.value}
              className="bg-black/80 ml-2 text-white hover:bg-black/70 px-6 py-2 rounded-lg text-sm"
              onClick={handleExchange}
            >
              Exchange
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
