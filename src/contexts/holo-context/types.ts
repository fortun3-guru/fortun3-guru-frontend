export type HoloContextType = {
  consultStatus: "idle" | "loading" | "speaking";
  setConsultStatus: (status: "idle" | "loading" | "speaking") => void;
  handleConsult: () => Promise<void>;
  consulting: boolean;
};
