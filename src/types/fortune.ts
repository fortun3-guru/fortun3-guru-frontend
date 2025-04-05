export type ConsultResponse = {
  data: {
    id: string;
    consult: string;
    filename: number;
    lang: string;
    short: string;
    long: string;
    sound: string;
    txHash: string;
    walletAddress: string;
    raw: string;
    tarot?: string;
  };
  success: boolean;
};

export type TellResponse = {
  data: {
    documentId: string;
    consult: string;
    lang: string;
    short: string;
    long: string;
    sound: string;
  };
  success: boolean;
};
