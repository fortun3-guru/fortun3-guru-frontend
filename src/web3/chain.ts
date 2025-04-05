import { defineChain } from "thirdweb";
import { baseSepolia, celo } from "thirdweb/chains";

export const getChain = () => {
  return [sepolia, baseSepolia, celo];
};

const sepolia = /*@__PURE__*/ defineChain({
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

export const chainMap = {
  [sepolia.id]: "sepolia",
  [baseSepolia.id]: "base_sepolia",
  [celo.id]: "celo_mainnet",
  [480]: "worldcoin",
} as const;
