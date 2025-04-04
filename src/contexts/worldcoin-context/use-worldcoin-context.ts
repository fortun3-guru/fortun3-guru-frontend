import { useContext } from "react";

import { WorldcoinContext } from "./worldcoin-context";

export const useWorldcoinContext = () => {
  const context = useContext(WorldcoinContext);

  if (!context)
    throw new Error(
      "useWorldcoinContext context must be use inside WorldcoinProvider"
    );

  return context;
};
