import axios from "axios";

const api = axios.create({
  baseURL: "https://casarao-api.onrender.com"
});

export default api;