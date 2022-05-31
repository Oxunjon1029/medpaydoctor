import { axiosInstance } from "../host"

export const Logout = () => {
    const config = {
        method: 'post',
        url: `doctor/logout`,
    }
    return axiosInstance(config)
}