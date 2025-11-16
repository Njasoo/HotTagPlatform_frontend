import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

console.log("baseURL:", baseURL);

const request = axios.create({
  baseURL,
  timeout: 5000,
});

export default request;
