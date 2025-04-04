import { sepolia } from "thirdweb/chains";

export const getChain = () => {
  // if (!CHAIN_ID) {
  //   throw new Error("CHAIN_ID is not set");
  // }

  // switch (Number(CHAIN_ID)) {
  //   case 11155111:
  //     return sepolia;

  //   default:
  //     throw new Error(`Chain with ID ${CHAIN_ID} is not supported`);
  // }

  return sepolia;
};
