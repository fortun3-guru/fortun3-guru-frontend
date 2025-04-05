import { useBoolean } from "@/hooks/use-boolean";

import NftDialog from "./nft-dialog";

type Props = {
  name: string;
  image: string;
  description: string;
};

export default function NftCard({ name, image, description }: Props) {
  const open = useBoolean();

  return (
    <>
      <div
        className="relative overflow-hidden rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2 transition-transform duration-300 ease-in-out cursor-pointer"
        onClick={open.onTrue}
      >
        <span className="sr-only">View</span>

        <img
          src={image}
          alt={name}
          width={450}
          height={450}
          className="object-cover w-full aspect-[3/2] group-hover:opacity-50 transition-opacity"
        />
        <div className="p-4 bg-background">
          <h3 className="text-xl font-bold">{name}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <NftDialog
        open={open.value}
        onClose={open.onFalse}
        nft={{ name, image, description, explorerUrl: "" }}
      />
    </>
  );
}
