import { defineChain } from "thirdweb";

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

export const sepolia = /*@__PURE__*/ defineChain({
  id: 11155111,
  name: "Sepolia",
  nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
  blockExplorers: [
    {
      name: "Etherscan",
      url: "https://sepolia.etherscan.io",
      apiUrl: "https://api-sepolia.etherscan.io/api",
    },
  ],
  testnet: true,
  rpcUrls: {
    default: {
      http: ["https://eth-sepolia.public.blastapi.io"],
    },
  },
});
