import axios from "axios";

export const API = "https://practice-gg4k.onrender.com/api";

export const axiosInstance = axios.create({
  baseURL: API
});