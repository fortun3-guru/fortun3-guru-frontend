export interface NFTsResponse {
  success: boolean;
  walletAddress: string;
  chains: Chains;
}

export interface Chains {
  base_sepolia: BaseSepolia;
  sepolia: Sepolia;
}

export interface BaseSepolia {
  chainId: number;
  networkName: string;
  totalCount: number;
  page: number;
  limit: number;
  data: Nft[];
}

export interface Sepolia {
  chainId: number;
  networkName: string;
  totalCount: number;
  page: number;
  limit: number;
  data: Nft[];
}

export interface Nft {
  contract: Contract;
  ownerAddress: string;
  balance: string;
  tokenId: string;
  tokenUri?: string;
  tokenUriSyncedAt?: string;
  rawMetadata?: string;
  metadataSyncedAt?: string;
}

export interface Contract {
  address: string;
  deployedTransactionHash: string;
  deployedAt: string;
  deployerAddress: string;
  logoUrl?: string;
  type: string;
  name: string;
  symbol: string;
}
