import axios from "axios";
// import { API_URL } from "@env";
// TODO - Add env variables

export const axiosInstance = axios.create({
  // baseURL: API_URL,
  baseURL: "http://192.168.1.11:3333",
});
