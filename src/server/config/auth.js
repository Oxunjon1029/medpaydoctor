import { axiosInstance } from "../host";

export const loginUser = (data) => {
    const config = {
      method: "POST",
      url: `auth/signin`,
      data,
    };
    return axiosInstance(config);
  };