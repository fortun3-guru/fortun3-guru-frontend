import { Nft } from "@/types/nft";
import { Button } from "@/components/shadcn/button";
import { Separator } from "@/components/shadcn/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/shadcn/dialog";

type Props = {
  open: boolean;
  onClose: () => void;
  nft: Nft;
};

export default function NftDialog({ open, onClose, nft }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <img
            src={nft.image}
            alt="tarot"
            className="w-full h-full object-cover"
          />

          <div className="p-4 bg-background">
            <h3 className="text-xl font-bold">{nft.name}</h3>
            <p className="text-sm text-muted-foreground">{nft.description}</p>
          </div>

          <Separator />

          <div className="my-2 flex gap-2 justify-center">
            <Button onClick={onClose} size="lg" variant="ghost">
              Close
            </Button>
            <Button
              onClick={() => {
                window.open(nft.explorerUrl, "_blank");
              }}
              size="lg"
              variant="default"
            >
              See on Explorer
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
