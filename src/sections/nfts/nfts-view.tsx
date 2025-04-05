import { toast } from "sonner";
import { useState } from "react";
import { useEffect } from "react";
import { Nft } from "@/types/nft";
import { sleep } from "@/utils/sleep";
import { useBoolean } from "@/hooks/use-boolean";

import NftCard from "./nft-card";
import NftViewSkeleton from "./nft-view-skeleton";

export default function NftsView() {
  const loading = useBoolean(true);
  const [, setNfts] = useState<Nft[]>([]);

  useEffect(() => {
    const fetchNfts = async () => {
      try {
        setNfts([]);
        await sleep(2000);
      } catch (error) {
        console.error(error);
        toast.error("Error fetching NFTs");
      } finally {
        loading.onFalse();
      }
    };
    fetchNfts();
  }, [loading]);

  return (
    <section className="w-screen py-12 md:py-24 lg:py-32 pt-20">
      <div className="grid gap-8 px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
              Featured Products
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Discover Our Offerings
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Explore our diverse range of products and services designed to
              meet your needs.
            </p>
          </div>
        </div>
        {loading.value ? (
          <NftViewSkeleton />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 12 }).map((_, index) => (
              <NftCard
                key={index}
                image="https://intuitivetarotreadings.wordpress.com/wp-content/uploads/2017/03/robin-wood-tarot-the-fool.jpg"
                name="The Fool"
                description="The Fool is the first card in the tarot deck. It represents new beginnings, spontaneity, and a willingness to take risks."
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
