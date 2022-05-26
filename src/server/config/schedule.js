import { axiosInstance } from "../host";

export const DoctorSchedule = (doctorId) => {
  const config = {
    method: "get",
    url: `schedule/doctor/${doctorId}`,
  };
  return axiosInstance(config);
};

export const DoctorScheduleMakeBusy = (data) => {
  const config = {
    method: "post",
    url: `schedule/update/doctor`,
    data,
  };
  return axiosInstance(config);
};
