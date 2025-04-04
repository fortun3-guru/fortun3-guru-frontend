import idleVideo from "@/assets/bg-video/idle.mp4";
import bgSound from "@/assets/bg-video/bg-sound.mp3";
import speakingVideo from "@/assets/bg-video/speak.mp4";
import loadingVideo from "@/assets/bg-video/loading.mp4";

/* eslint-disable */
import { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/shadcn/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";

import ButtonSection from "./buttton-section";
import { Button } from "@/components/shadcn/button";

export default function HomeView() {
  const [question, setQuestion] = useState("");
  const [language, setLanguage] = useState("");
  const [source, setSource] = useState("");
  const [currentVideo, setCurrentVideo] = useState("idle");
  const [showPanel, setShowPanel] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const idleVideoRef = useRef<HTMLVideoElement | null>(null);
  const loadingVideoRef = useRef<HTMLVideoElement | null>(null);
  const speakingVideoRef = useRef<HTMLVideoElement | null>(null);

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

  // Handle video end events
  useEffect(() => {
    const handleLoadingVideoEnd = () => {
      console.log("loading video ended");
      setCurrentVideo("speaking");
      if (speakingVideoRef.current) {
        speakingVideoRef.current.currentTime = 0;
        speakingVideoRef.current.play().catch((error) => {
          console.error("Error playing speaking video:", error);
        });
      }
    };

    const handleSpeakingVideoEnd = () => {
      console.log("speaking video ended, showing panel");
      setCurrentVideo("idle");
      setShowPanel(true);
      if (idleVideoRef.current) {
        idleVideoRef.current.currentTime = 0;
        idleVideoRef.current.play().catch((error) => {
          console.error("Error playing idle video:", error);
        });
      }
    };

    if (loadingVideoRef.current) {
      loadingVideoRef.current.addEventListener("ended", handleLoadingVideoEnd);
    }

    if (speakingVideoRef.current) {
      speakingVideoRef.current.addEventListener(
        "ended",
        handleSpeakingVideoEnd
      );
    }

    return () => {
      if (loadingVideoRef.current) {
        loadingVideoRef.current.removeEventListener(
          "ended",
          handleLoadingVideoEnd
        );
      }
      if (speakingVideoRef.current) {
        speakingVideoRef.current.removeEventListener(
          "ended",
          handleSpeakingVideoEnd
        );
      }
    };
  }, []);

  const handleNextClick = () => {
    setCurrentVideo("loading");
    setShowPanel(false);
    if (loadingVideoRef.current) {
      loadingVideoRef.current.currentTime = 0;
      loadingVideoRef.current.play().catch((error) => {
        console.error("Error playing loading video:", error);
      });
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
          currentVideo === "idle" ? "block" : "hidden"
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
          currentVideo === "loading" ? "block" : "hidden"
        }`}
      >
        <source src={loadingVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <video
        ref={speakingVideoRef}
        autoPlay
        muted
        playsInline
        className={`absolute top-0 left-0 w-full h-full object-cover z-0 ${
          currentVideo === "speaking" ? "block" : "hidden"
        }`}
      >
        <source src={speakingVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Content with higher z-index to appear above video */}
      {showPanel && (
        <div id="panel" className="w-full max-w-3xl mx-auto px-4 pb-12">
          <div className=" p-6 space-y-6 bg-white/20 rounded-lg border-2 border-white/55 relative z-10">
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
                    <SelectItem value="wallet-address">
                      Wallet Address
                    </SelectItem>
                    <SelectItem value="txhash">Transaction Hash</SelectItem>
                    <SelectItem value="timestamp">Time Stamp</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="text-center mt-4">
                <ButtonSection />
                <Button
                  size="lg"
                  variant="default"
                  className="bg-black/80 ml-2 text-white hover:bg-black/70 px-6 py-2 rounded-lg text-sm"
                  onClick={handleNextClick}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
