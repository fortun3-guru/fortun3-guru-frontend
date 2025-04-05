import axios from "axios";
import { toast } from "sonner";
import { sleep } from "@/utils/sleep";
import { chainMap } from "@/web3/chain";
import { useBoolean } from "@/hooks/use-boolean";
import idleVideo from "@/assets/bg-video/idle.mp4";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/shadcn/button";
import bgSound from "@/assets/bg-video/bg-sound.mp3";
import speakingVideo from "@/assets/bg-video/speak.mp4";
import { Textarea } from "@/components/shadcn/textarea";
import loadingVideo from "@/assets/bg-video/loading.mp4";
import useConsultPay from "@/web3/hooks/use-consult-pay";
import useMintingPay from "@/web3/hooks/use-minting-pay";
import useConnectWallet from "@/web3/use-connect-wallet";
import {
  ConsultResponse,
  MintNftResponse,
  TellResponse,
} from "@/types/fortune";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/shadcn/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";

import TypeWriter from "./type-writer";
import ButtonSection from "./buttton-section";

export default function HomeView() {
  const [question, setQuestion] = useState("");
  const [language, setLanguage] = useState("en");
  const [source, setSource] = useState("txhash");
  // const [currentVideo, setCurrentVideo] = useState("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const idleVideoRef = useRef<HTMLVideoElement | null>(null);
  const loadingVideoRef = useRef<HTMLVideoElement | null>(null);
  const speakingVideoRef = useRef<HTMLVideoElement | null>(null);
  // const navigate = useNavigate();
  const executeMinting = useMintingPay();
  const minting = useBoolean(false);
  const consulting = useBoolean(false);

  const executeConsult = useConsultPay();
  const [consultStatus, setConsultStatus] = useState<
    "idle" | "speaking" | "loading"
  >("idle");
  const { activeWallet, activeAccount } = useConnectWallet();
  const isLoadingVideoPlaying = useBoolean(false);
  const [tellResponse, setTellResponse] = useState<TellResponse["data"] | null>(
    null
  );
  const [consultResponse, setConsultResponse] = useState<
    ConsultResponse["data"] | null
  >(null);
  const isSpeekingEnded = useBoolean(false);

  const tarotDialog = useBoolean(false);

  const [mintingResponse, setMintingResponse] =
    useState<MintNftResponse | null>(null);

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio(bgSound);
    audioRef.current.loop = true; // Loop the sound
    audioRef.current.volume = 0.5; // Set volume to 50%

    // Play the sound
    audioRef.current.play().catch((error) => {
      console.error("Error playing audio:", error);
    });

    // Cleanup function to stop audio when component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // useEffect(() => {
  //   if (consultStatus === "loading") {
  //     if (loadingVideoRef.current) {
  //       loadingVideoRef.current.currentTime = 0;
  //       loadingVideoRef.current.play().catch((error) => {
  //         console.error("Error playing loading video:", error);
  //       });
  //     }
  //   }
  //   if (consultStatus === "speaking") {
  //     if (speakingVideoRef.current) {
  //       speakingVideoRef.current.currentTime = 0;
  //       speakingVideoRef.current.play().catch((error) => {
  //         console.error("Error playing speaking video:", error);
  //       });
  //     }
  //   }
  //   if (consultStatus === "idle") {
  //     if (idleVideoRef.current) {
  //       idleVideoRef.current.currentTime = 0;
  //       idleVideoRef.current.play().catch((error) => {
  //         console.error("Error playing idle video:", error);
  //       });
  //     }
  //   }
  // }, [consultStatus]);

  useEffect(() => {
    if (consultStatus === "loading") {
      if (loadingVideoRef.current) {
        loadingVideoRef.current.currentTime = 0;
        loadingVideoRef.current.play();
        loadingVideoRef.current.addEventListener("playing", () => {
          isLoadingVideoPlaying.onTrue();
        });
        loadingVideoRef.current.addEventListener("ended", () => {
          if (!tellResponse) {
            loadingVideoRef.current?.play();
          }
          isLoadingVideoPlaying.onFalse();
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consultStatus]);

  useEffect(() => {
    if (
      tellResponse?.sound &&
      !isLoadingVideoPlaying.value &&
      consultStatus !== "speaking" &&
      !isSpeekingEnded.value
    ) {
      setConsultStatus("speaking");
      const audio = new Audio(tellResponse.sound);
      audio.play();
      audio.addEventListener("playing", () => {
        if (speakingVideoRef.current) {
          speakingVideoRef.current.currentTime = 0;
          speakingVideoRef.current.play();
        }
      });

      audio.addEventListener("ended", () => {
        if (idleVideoRef.current) {
          idleVideoRef.current.currentTime = 0;
          idleVideoRef.current.pause();
          isSpeekingEnded.onTrue();
          setConsultStatus("idle");
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consultStatus, isLoadingVideoPlaying.value]);

  useEffect(() => {
    if (isSpeekingEnded.value && consultResponse?.tarot) {
      tarotDialog.onTrue();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consultResponse, isSpeekingEnded.value]);

  const handleConsult = async () => {
    try {
      if (!question || !language) {
        toast.error("Please enter a question and language");
        return;
      }
      setConsultStatus("idle");
      consulting.onTrue();
      const receipt = await executeConsult();
      if (!receipt) {
        throw new Error("Consult failed");
      }
      await sleep(5000);
      consulting.onFalse();

      // call api
      setConsultStatus("loading");

      const chainId = activeWallet?.getChain()?.id;

      if (!chainId) {
        throw new Error("Chain not found");
      }

      const { data: consultData } = await axios.post<TellResponse>(
        "http://192.168.0.23:3000/fortune/tell",
        {
          txHash: receipt.transactionHash,
          walletAddress: activeAccount?.address,
          consult: question,
          lang: language,
          receiptId: receipt.receiptId,
          chainId: chainMap[chainId],
        }
      );
      setTellResponse(consultData.data);
      let _consultResponse: ConsultResponse["data"] | null = null;
      while (true) {
        const { data: card } = await axios.get<ConsultResponse>(
          `http://192.168.0.23:3000/fortune/consult/${consultData.data.documentId}`
        );

        await sleep(2000);
        if (card.data?.tarot) {
          _consultResponse = card.data;
          break;
        }
      }

      setConsultResponse(_consultResponse);
    } catch (error) {
      console.log(error);
      reset();
      toast.error("Consult failed");
    } finally {
      // setConsultStatus("idle");
    }
  };

  const reset = () => {
    setConsultStatus("idle");
    isSpeekingEnded.onFalse();
    setTellResponse(null);
    isLoadingVideoPlaying.onFalse();
  };

  const handleMinting = async () => {
    try {
      minting.onTrue();
      const receipt = await executeMinting();
      if (!receipt) {
        throw new Error("Minting failed");
      }
      const { data } = await axios.post<MintNftResponse>(
        `http://192.168.0.23:3000/fortune/mint-nft`,
        {
          consultId: tellResponse?.documentId,
          receiptId: receipt.receiptId,
        }
      );

      if (!data.success) {
        throw new Error("Minting failed");
      }
      setMintingResponse(data);
      toast.success("Minting success");
    } catch (error) {
      console.log(error);
      toast.error("Minting failed");
    } finally {
      minting.onFalse();
    }
  };

  const onCancelMinting = () => {
    if (minting.value) {
      toast.error("Please wait for the minting to complete");
      return;
    }
    tarotDialog.onFalse();
    setConsultResponse(null);
  };

  return (
    <div className="flex flex-col-reverse h-screen w-screen relative">
      {/* Video Backgrounds */}
      <video
        ref={idleVideoRef}
        autoPlay
        loop
        muted
        playsInline
        className={`absolute top-0 left-0 w-full h-full object-cover z-0 ${
          consultStatus === "idle" ? "block" : "hidden"
        }`}
      >
        <source src={idleVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <video
        ref={loadingVideoRef}
        autoPlay
        muted
        playsInline
        className={`absolute top-0 left-0 w-full h-full object-cover z-0 ${
          consultStatus === "loading" ? "block" : "hidden"
        }`}
      >
        <source src={loadingVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <video
        ref={speakingVideoRef}
        autoPlay
        muted
        loop
        playsInline
        className={`absolute top-0 left-0 w-full h-full object-cover z-0 ${
          consultStatus === "speaking" ? "block" : "hidden"
        }`}
      >
        <source src={speakingVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Content with higher z-index to appear above video */}

      {tellResponse?.short && consultStatus === "speaking" && (
        <div className="w-full max-w-3xl mx-auto px-4 pb-12">
          <div className=" p-6 space-y-6 bg-white/80 rounded-lg border-2 border-white/55 relative z-10 min-h-[330px]">
            <p className="text-black text-xl">
              <TypeWriter text={tellResponse.short} delay={100} />
            </p>
          </div>
        </div>
      )}

      {consultStatus === "idle" && (
        <div id="panel" className="w-full max-w-3xl mx-auto px-4 pb-12">
          <div className=" p-6 space-y-6 bg-white/20 rounded-lg border-2 border-white/55 relative z-10 min-h-[330px]">
            <h1 className="text-xl font-normal  text-white mb-4">
              Using F3 token to check your fortune. One F3 Token a time.
            </h1>

            <div className="space-y-4">
              <div>
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="What do you want to know ?"
                  className="min-h-[120px] resize-none !bg-white text-gray-800 text-sm rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="!bg-white text-gray-800 text-sm w-full !h-10">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="th">Thai</SelectItem>
                    <SelectItem value="cn">Chinese</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={source} onValueChange={setSource}>
                  <SelectTrigger className="!bg-white text-gray-800 text-sm w-full !h-10">
                    <SelectValue placeholder="Source of destiny" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectItem value="wallet-address">
                      Wallet Address
                    </SelectItem> */}
                    <SelectItem value="txhash">Transaction Hash</SelectItem>
                    {/* <SelectItem value="timestamp">Time Stamp</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>

              <div className="text-center mt-4">
                <ButtonSection
                  handleConsult={handleConsult}
                  consulting={consulting.value}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <Dialog open={tarotDialog.value} onOpenChange={onCancelMinting}>
        <DialogContent>
          <DialogHeader>
            <img
              src={consultResponse?.tarot}
              alt="tarot"
              className="w-full h-full object-cover"
            />

            {!mintingResponse?.explorerUrl ? (
              <div className="mt-4 flex gap-2 justify-center">
                <Button onClick={onCancelMinting} size="lg" variant="ghost">
                  Not now
                </Button>

                <Button
                  onClick={handleMinting}
                  loading={minting.value}
                  size="lg"
                  variant="default"
                >
                  Mint NFT
                </Button>
              </div>
            ) : (
              <>
                <div className="mt-4 flex gap-2 justify-center">
                  <Button onClick={onCancelMinting} size="lg" variant="ghost">
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      window.open(mintingResponse?.explorerUrl, "_blank");
                    }}
                    size="lg"
                    variant="default"
                  >
                    See on Explorer
                  </Button>
                </div>
              </>
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
