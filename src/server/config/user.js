import { axiosInstance } from "../host";

export const userGet = () => {
  const config = {
    method: "GET",
    url: `doctor/information/data/get`,
  };
  return axiosInstance(config);
};

export const userEdit = (data) => {
  const config = {
    method: "POST",
    url: "doctor/information/data/update",
    data
  };
  return axiosInstance(config);
};
