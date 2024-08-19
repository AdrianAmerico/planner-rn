import { AxiosError } from "axios";

export type AxiosCustomError<T = {}> = AxiosError<
  {
    error: {
      message: string;
    };
  } & T
>;
