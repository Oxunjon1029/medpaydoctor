
import { axiosInstance } from '../host';
export const loginUser = (data) => {
  const config = {
    method: "POST",
    url: "doctor/login",
    data,
  };
  return axiosInstance(config)
  // axios(config).then(res => {
  //   console.log('esssss', res);
  //   window.location.href = "/bookings"
  // }).catch(err => {
  //   console.log(err);
  // })
};