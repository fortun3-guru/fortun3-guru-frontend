import { toast } from "sonner";
import { sleep } from "@/utils/sleep";
import { chainMap } from "@/web3/chain";
import axios, { endpoints } from "@/libs/axios";
import { useBoolean } from "@/hooks/use-boolean";
import idleVideo from "@/assets/bg-video/idle.mp4";
import { Button } from "@/components/shadcn/button";
import { useState, useEffect, useRef } from "react";
import speakingVideo from "@/assets/bg-video/speak.mp4";
import { Textarea } from "@/components/shadcn/textarea";
import loadingVideo from "@/assets/bg-video/loading.mp4";
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
import {
  MiniKit,
  VerifyCommandInput,
  VerificationLevel,
  ISuccessResult,
  PayCommandInput,
  Tokens,
  tokenToDecimals,
} from "@worldcoin/minikit-js";

import TypeWriter from "./type-writer";

export default function MiniAppHomeView() {
  const [question, setQuestion] = useState("");
  const [language, setLanguage] = useState("en");
  const [source, setSource] = useState("txhash");
  // const [currentVideo, setCurrentVideo] = useState("idle");
  // const audioRef = useRef<HTMLAudioElement | null>(null);
  const idleVideoRef = useRef<HTMLVideoElement | null>(null);
  const loadingVideoRef = useRef<HTMLVideoElement | null>(null);
  const speakingVideoRef = useRef<HTMLVideoElement | null>(null);

  const isLoadingVideoPlayingRef = useRef(false);

  const minting = useBoolean(false);
  const consulting = useBoolean(false);

  const [consultStatus, setConsultStatus] = useState<
    "idle" | "speaking" | "loading"
  >("idle");

  const isLoadingVideoPlaying = useBoolean(false);
  // const [tellResponse, setTellResponse] = useState<TellResponse["data"] | null>(
  //   null
  // );
  const tellResponseRef = useRef<TellResponse["data"] | null>(null);
  const [consultResponse, setConsultResponse] = useState<
    ConsultResponse["data"] | null
  >(null);
  const isSpeekingEnded = useBoolean(false);
  const verifySuccess = useBoolean(false);
  const tarotDialog = useBoolean(false);

  const [mintingResponse, setMintingResponse] =
    useState<MintNftResponse | null>(null);

  // useLayoutEffect(() => {
  //   // Create audio element
  //   let bgAudio: HTMLAudioElement | null = null;

  //   setTimeout(() => {
  //     bgAudio = new Audio(bgSound);
  //     bgAudio.loop = true; // Loop the sound
  //     bgAudio.volume = 0.5; // Set volume to 50%

  //     // Play the sound
  //     bgAudio.play().catch((error) => {
  //       console.error(error);
  //     });
  //   }, 5000);

  //   // Cleanup function to stop audio when component unmounts
  //   return () => {
  //     if (bgAudio) {
  //       bgAudio.pause();
  //     }
  //   };
  // }, []);

  useEffect(() => {
    if (consultStatus === "loading") {
      if (loadingVideoRef.current) {
        loadingVideoRef.current.currentTime = 0;
        loadingVideoRef.current.play();
        loadingVideoRef.current.addEventListener("playing", () => {
          console.log("do true");
          isLoadingVideoPlaying.onTrue();
        });
        loadingVideoRef.current.addEventListener("ended", () => {
          console.log(tellResponseRef.current);
          if (!tellResponseRef.current) {
            console.log("play again ", loadingVideoRef.current);
            loadingVideoRef.current?.pause();

            loadingVideoRef.current?.play();
          }
          console.log("do false");
          isLoadingVideoPlaying.onFalse();
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consultStatus]);

  // console.log({ isLoadingVideoPlaying: isLoadingVideoPlaying.value });
  // console.log({ isLoadingVideoPlayingRef: isLoadingVideoPlayingRef.current });

  useEffect(() => {
    if (
      tellResponseRef.current?.sound &&
      !isLoadingVideoPlaying.value &&
      consultStatus !== "speaking" &&
      !isSpeekingEnded.value
    ) {
      console.log("do1");
      setConsultStatus("speaking");
      const audio = new Audio(tellResponseRef.current.sound);
      console.log("do2");
      audio.play();
      console.log("do3");
      audio.addEventListener("playing", () => {
        if (speakingVideoRef.current) {
          speakingVideoRef.current.currentTime = 0;
          console.log("play");
          speakingVideoRef.current.play();
        }
      });

      audio.addEventListener("ended", () => {
        if (idleVideoRef.current) {
          console.log("stop");
          idleVideoRef.current.currentTime = 0;
          idleVideoRef.current.pause();
          isSpeekingEnded.onTrue();
          setConsultStatus("idle");
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tellResponseRef.current, isLoadingVideoPlaying.value]);

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
      const payment = await sendPayment();
      if (!payment?.transaction_id || !payment?.reference) {
        throw new Error("Consult failed");
      }

      console.log({ payment });

      consulting.onFalse();

      // call api
      setConsultStatus("loading");

      const { data: consultData } = await axios.post<TellResponse>(
        "/fortune/tell",
        {
          txHash: payment.transaction_id,
          walletAddress: payment?.from,
          consult: question,
          lang: language,
          receiptId: payment.reference,
          chainId: chainMap[480],
        }
      );

      // setTellResponse(consultData.data);
      tellResponseRef.current = consultData.data;

      let _consultResponse: ConsultResponse["data"] | null = null;
      const interval = setInterval(async () => {
        try {
          const { data: card } = await axios.get<ConsultResponse>(
            `/fortune/consult/${consultData.data.documentId}`
          );

          if (card.data?.tarot) {
            _consultResponse = card.data;
            setConsultResponse(_consultResponse);

            clearInterval(interval);
          }
        } catch (error) {
          console.error(error);
          clearInterval(interval);
        }
      }, 5000);
    } catch (error) {
      console.log(error);
      reset();
      toast.error("Consult failed");
      await sleep(2000);
      window.location.reload();
    } finally {
      // setConsultStatus("idle");
    }
  };

  const reset = () => {
    setConsultStatus("idle");
    isSpeekingEnded.onFalse();
    // setTellResponse(null);
    tellResponseRef.current = null;
    isLoadingVideoPlaying.onFalse();
    isLoadingVideoPlayingRef.current = false;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleMinting = async () => {
    try {
      minting.onTrue();
      const payment = await sendPayment();
      if (!payment?.transaction_id || !payment?.reference) {
        throw new Error("Consult failed");
      }
      const { data } = await axios.post<MintNftResponse>(`/fortune/mint-nft`, {
        consultId: tellResponseRef.current?.documentId,
        receiptId: payment.reference,
      });

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
    window.location.reload();
  };

  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    // Don't start verification if it's already in progress
    if (isVerifying) {
      console.log("Verification already in progress");
      return;
    }

    if (!MiniKit.isInstalled()) {
      toast.error("Verification failed");
      return;
    }

    try {
      console.log("Starting verification process");
      setIsVerifying(true);

      const action = "fortun3-action";

      const verifyPayload: VerifyCommandInput = {
        action,
        signal: "",
        verification_level: VerificationLevel.Device,
      };

      // Use async approach with commandsAsync
      console.log("Using async verification approach");

      // Ensure the MiniKit is correctly initialized before using it
      if (
        !MiniKit.commandsAsync ||
        typeof MiniKit.commandsAsync.verify !== "function"
      ) {
        throw new Error(
          "MiniKit.commandsAsync.verify is not available. Make sure you're using the latest version of the MiniKit library."
        );
      }

      // Execute the verify command and wait for the result
      console.log({ verifyPayload });
      const { finalPayload } = await MiniKit.commandsAsync.verify(
        verifyPayload
      );

      if (finalPayload.status === "error") {
        console.log("Error payload", finalPayload);
        toast.error("Verification failed: Please try again");
        setIsVerifying(false);
        return;
      }

      try {
        const { data } = await axios.post("/worldcoin/verify-user", {
          payload: finalPayload as ISuccessResult,
          action,
          signal: "",
        });

        console.log({ data });

        setIsVerifying(false);
        verifySuccess.onTrue();

        // onVerificationSuccess();
      } catch (error) {
        console.error("Server verification error:", error);
        toast.error("Verification failed");
      }

      // Process successful verification
      //   await verifyOnServer(finalPayload as ISuccessResult);
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Verification failed");
      setIsVerifying(false);
    }
  };

  const sendPayment = async () => {
    try {
      const { data: nonce } = await axios.get(endpoints.worldcoin.nonce);

      console.log({ nonce });

      const payload: PayCommandInput = {
        reference: nonce,
        to: "0x0767823c412c094c22b45409372052bfa963b966", // P'Earn Address
        tokens: [
          {
            symbol: Tokens.WLD,
            token_amount: tokenToDecimals(0.0001, Tokens.WLD).toString(),
          },
          // {
          //   symbol: Tokens.USDCE,
          //   token_amount: tokenToDecimals(0.001, Tokens.USDCE).toString(),
          // },
        ],
        description:
          "Using 0.0001 WLD to check consult your prophecy. 0.0001 WLD a time.",
      };

      if (!MiniKit.isInstalled()) {
        throw new Error("MiniKit is not installed");
      }
      const paid = await MiniKit.commandsAsync.pay(payload);
      console.log({ paid });

      const { finalPayload } = paid;
      if (!finalPayload || finalPayload.status !== "success") {
        throw new Error("Payment failed");
      }

      const { data } = await axios.post(endpoints.worldcoin.confirmPayment, {
        payload: finalPayload,
        nonce,
      });

      if (!data.success) {
        throw new Error("Payment failed");
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return paid.finalPayload as any;
    } catch (error) {
      console.error(error);
      toast.error("Payment failed");
      return null;
    }
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

      {tellResponseRef.current?.short && consultStatus === "speaking" && (
        <div className="w-full max-w-3xl mx-auto px-4 pb-12 ">
          <div className="p-4 space-y-6 bg-white/80 rounded-lg border-2 border-white/55 relative z-10 min-h-[240px]">
            <p className="text-black text-base">
              <TypeWriter text={tellResponseRef.current?.short} delay={90} />
            </p>
          </div>
        </div>
      )}

      {consultStatus === "idle" && (
        <div id="panel" className="w-full max-w-3xl mx-auto px-3 pb-6">
          <div className="p-4 space-y-6 bg-black/70 rounded-lg border-1 border-white/20 relative z-10 min-h-[300px]">
            <h1 className="text-base font-light  text-white mb-4">
              Using 0.0001 WLD to check consult your prophecy. 0.0001 WLD a
              time.
            </h1>

            <div className="space-y-2">
              <div>
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="What do you want to know ?"
                  className="min-h-[100px] !bg-[oklab(1_0_0_/_0.045)] resize-none  border-b-[oklch(1_0_0_/_0.15)] text-white-800 text-sm rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="!bg-[oklab(1_0_0_/_0.045)]  text-white text-sm !h-10 w-full border-b-[oklch(1_0_0_/_0.15)]">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="th">Thai</SelectItem>
                    <SelectItem value="cn">Chinese</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={source} onValueChange={setSource}>
                  <SelectTrigger className="!bg-[oklab(1_0_0_/_0.045)]  text-white text-sm !h-10 w-full border-b-[oklch(1_0_0_/_0.15)]">
                    <SelectValue placeholder="Source of destiny" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectItem value="wallet-address">
                      Wallet Address
                    </SelectItem> */}
                    <SelectItem value="txhash">
                      Transaction Hash & Wallet Address
                    </SelectItem>
                    {/* <SelectItem value="timestamp">Time Stamp</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>

              <div className="text-center mt-4 flex justify-center">
                {!verifySuccess.value ? (
                  <Button
                    variant="outline"
                    type="button"
                    size="lg"
                    className="!bg-black/80 text-white hover:!bg-black/70 min-w-[160px]"
                    onClick={handleVerify}
                    loading={isVerifying}
                  >
                    Verify
                  </Button>
                ) : (
                  <Button
                    onClick={handleConsult}
                    loading={consulting.value}
                    size="lg"
                    variant="outline"
                    className="button-effect !bg-black/80 text-white hover:!bg-black/70 px-6 py-2 rounded-lg text-sm min-w-[160px]"
                  >
                    That's it !!
                  </Button>
                )}

                {/* <Button
                  variant="outline"
                  type="button"
                  size="lg"
                  className="!bg-black/80 text-white hover:!bg-black/70"
                  onClick={() => navigate("/playground")}
                >
                  play
                </Button> */}
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
              className="w-[300px] h-full object-cover"
            />

            {!mintingResponse?.explorerUrl ? (
              <div className="mt-4 flex flex-col gap-3 justify-center">
                <Button onClick={onCancelMinting} size="lg" variant="ghost">
                  Not now
                </Button>

                <Button
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = consultResponse?.tarot || "";
                    link.download = "tarot-card.png";
                    link.click();
                  }}
                  size="lg"
                  variant="ghost"
                >
                  Download
                </Button>

                {/* <Button
                  onClick={handleMinting}
                  loading={minting.value}
                  size="lg"
                  variant="default"
                >
                  Mint NFT
                </Button> */}
              </div>
            ) : (
              <>
                <div className="mt-4 flex gap-2 justify-center">
                  <Button onClick={onCancelMinting} size="lg" variant="ghost">
                    Close
                  </Button>

                  <Button
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = consultResponse?.tarot || "";
                      link.download = "tarot-card.png";
                      link.click();
                    }}
                    size="lg"
                    variant="ghost"
                  >
                    Download
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
