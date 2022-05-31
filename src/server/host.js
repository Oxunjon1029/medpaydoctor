import axios from "axios";
import { API_URL, headers } from "../assets/constants";

export let axiosInstance = axios.create({
  baseURL: `${API_URL}`,
  headers,
  timeout: 100000,
});

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response) {
//       if (error.response.status === 403 ) {
//         deleteCookie(TOKEN)
//         message.error('Refresh');
//         window.location.href = "/login";
//       }
//       error.response.data && message.error(error.response.data.message);
//     }
//     throw error;
//   }
// );