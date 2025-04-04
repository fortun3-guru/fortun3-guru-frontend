import { useState } from "react";
import logo from "@/assets/logo/logo.svg";
import { Button } from "@/components/shadcn/button";
import { Textarea } from "@/components/shadcn/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";

export default function DashboardView() {
  const [question, setQuestion] = useState("");
  const [language, setLanguage] = useState("");
  const [source, setSource] = useState("");

  return (
    <div className="container mx-auto h-screen w-screen relative flex flex-col-reverse pb-36">
      <header className="flex h-20 w-full shrink-0 items-center absolute top-0 left-0 right-0">
        <img src={logo} alt="logo" />
        <div className="ml-auto flex gap-2">
          <Button variant="outline" className="justify-self-end" size="lg">
            Connect Wallet
          </Button>
        </div>
      </header>
      <div className="w-full max-w-3xl mx-auto p-6 space-y-6 bg-white/20 rounded-lg border-2 border-white/55">
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
                <SelectItem value="tarot">Tarot Cards</SelectItem>
                <SelectItem value="zodiac">Zodiac Signs</SelectItem>
                <SelectItem value="numerology">Numerology</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-center mt-4">
            <Button
              size="lg"
              variant="default"
              className="bg-black/80 text-white hover:bg-black/70 px-6 py-2 rounded-lg text-sm"
            >
              That's it !!
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
