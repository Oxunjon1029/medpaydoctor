import { axiosInstance } from "../host";

export const Speciality = (page = 1, size = 20) => {
  const config = {
    method: "GET",
    url: `speciality/?page=${page - 1}&size=${size}`,
  };
  return axiosInstance(config);
};
