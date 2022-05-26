import { axiosInstance } from "../host";

export const userGet = () => {
  const config = {
    method: "GET",
    url: `doctor/me`,
  };
  return axiosInstance(config);
};

export const userEdit = (data) => {
  const config = {
    method: "POST",
    url: `doctor/edit`,
    data
  };
  return axiosInstance(config);
};
