import { useContext } from "react";

import { HoloContext } from "./holo-context";

export const useHoloContext = () => {
  const context = useContext(HoloContext);

  if (!context)
    throw new Error("useHoloContext context must be use inside HoloProvider");

  return context;
};
