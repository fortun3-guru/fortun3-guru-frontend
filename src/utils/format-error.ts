/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from "axios";

export const fError = (error: unknown): any => {
  if (error instanceof TypeError) {
    return error.message;
  }
  if (error instanceof AxiosError) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }

  const msg: string = (error as any)?.message || "unknown error instance";

  return msg;
};
