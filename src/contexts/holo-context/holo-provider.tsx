import { toast } from "sonner";
import { useState } from "react";
import { sleep } from "@/utils/sleep";
import { useBoolean } from "@/hooks/use-boolean";
import useConsultPay from "@/web3/hooks/use-consult-pay";

import { HoloContext } from "./holo-context";

export default function HoloProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [consultStatus, setConsultStatus] = useState<
    "idle" | "loading" | "speaking"
  >("idle");
  const consulting = useBoolean(false);

  const executeConsult = useConsultPay();

  const handleConsult = async () => {
    try {
      setConsultStatus("idle");
      consulting.onTrue();
      const receipt = await executeConsult();
      if (!receipt) {
        throw new Error("Consult failed");
      }
      consulting.onFalse();

      // call api
      setConsultStatus("loading");
      await sleep(20000);

      // play speaking video
      setConsultStatus("speaking");
      await sleep(20000);
    } catch (error) {
      console.log(error);
      toast.error("Consult failed");
    } finally {
      setConsultStatus("idle");
    }
  };

  return (
    <HoloContext.Provider
      value={{
        consultStatus,
        setConsultStatus,
        handleConsult,
        consulting: consulting.value,
      }}
    >
      {children}
    </HoloContext.Provider>
  );
}
