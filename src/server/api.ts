import axios from "axios";

export const api = axios.create({
  baseURL: "exp://192.168.1.11:3333",
});
