import { toast } from "sonner";
import { useState } from "react";
import axios from "@/libs/axios";
import { useEffect } from "react";
import { sleep } from "@/utils/sleep";
import { Nft, NFTsResponse } from "@/types/nft";
import { useBoolean } from "@/hooks/use-boolean";
import useConnectWallet from "@/web3/use-connect-wallet";

import NftCard from "./nft-card";
import NftViewSkeleton from "./nft-view-skeleton";

export default function NftsView() {
  const loading = useBoolean(true);
  const { activeAccount } = useConnectWallet();
  const [nfts, setNfts] = useState<Nft[]>([]);

  useEffect(() => {
    const fetchNfts = async (walletAddress: string) => {
      try {
        const { data } = await axios.get<NFTsResponse>(
          `/nordit/wallet/${walletAddress}`
        );
        console.log({ data });
        setNfts([
          ...data.chains.base_sepolia.data,
          ...data.chains.sepolia.data,
        ]);
        await sleep(2000);
      } catch (error) {
        console.error(error);
        toast.error("Error fetching NFTs");
      } finally {
        loading.onFalse();
      }
    };
    if (activeAccount) {
      fetchNfts(activeAccount.address);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAccount]);

  return (
    <section className="w-screen py-12 md:py-24 lg:py-32 pt-20">
      <div className="grid gap-8 px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Your Prophecies
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              List of your Fortun3 NFTs
            </p>
          </div>
        </div>
        {loading.value ? (
          <NftViewSkeleton />
        ) : (
          <>
            {nfts.length === 0 ? (
              <div className="text-center text-muted-foreground mt-12 text-sm">
                No NFTs found
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {nfts.map((nft, index) => {
                  if (!nft.rawMetadata) {
                    return null;
                  }
                  const metadata = JSON.parse(nft.rawMetadata);
                  console.log(metadata);

                  return (
                    <NftCard
                      key={index}
                      image={metadata.image}
                      name={metadata.name}
                      description={metadata.description}
                    />
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
