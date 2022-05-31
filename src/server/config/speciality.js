import { axiosInstance } from "../host";

export const Speciality = () => {
  const config = {
    method: "GET",
    url: `doctor/information-list/specialties`,
  };
  return axiosInstance(config);
};
export const Specializations = () => {
  const config = {
    method: "GET",
    url: `doctor/information-list/specializations`,
  };
  return axiosInstance(config);
};

export const GetSpecializationDirections = (id) => {
  const config = {
    method: "GET",
    url: `doctor/information-list/specialization-directions?specialization_id=${id}`
  }
  return axiosInstance(config)
}