import numeral from "numeral";
import { useState } from "react";
import { Input } from "@/components/shadcn/input";

export default function TopupView() {
  const [usdc, setUsdc] = useState("");
  const [f3Token, setF3Token] = useState("");

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
    const f3Token = +_usdc * 100;
    setF3Token(`${f3Token}`);
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
        </div>
      </div>
    </div>
  );
}
